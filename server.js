var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var compression = require('compression');
var users = exports.users = [];
var querystring = require('querystring');
var fs = require('fs');

/**
 * http://blog.fens.me/nodejs-log4js/
 * log4js的输出级别6个: trace, debug, info, warn, error, fatal
 */
var log4js = require('log4js');
log4js.configure({
  appenders:[
    {type: 'console'},
    {
      type: 'file',
      filename: 'logs/normal.log',
      maxLogSize:104856,
      backups:10,
      category: 'normal'
    },
    {
      type: 'file',
      filename: 'logs/router.log',
      maxLogSize:104856,
      backups:10,
      category: 'router'
    },
    {
      type: 'file',
      filename: 'logs/socket.log',
      maxLogSize:104856,
      backups:10,
      category: 'socket'
    },
    {
      type: 'dateFile', // http://blog.csdn.net/youbl/article/details/32708609
      filename: 'ydyc_data_monitor_logs/ios/',
      pattern: 'ios_yyyyMMddhh.log',
      alwaysIncludePattern: true,
      category: 'ios_log'
    },
    {
      type: 'dateFile', // http://blog.csdn.net/youbl/article/details/32708609
      filename: 'ydyc_data_monitor_logs/android/',
      pattern: 'ios_yyyyMMddhh.log',
      alwaysIncludePattern: true,
      category: 'android_log'
    },
    {
      type: 'dateFile', // http://blog.csdn.net/youbl/article/details/32708609
      filename: 'ydyc_data_monitor_logs/h5/',
      pattern: 'h5_yyyyMMddhh.log',
      alwaysIncludePattern: true,
      category: 'h5_log'
    }
  ],
  replaceConsole: true
});

var logger = exports.logger = function (name) {
  var logger = log4js.getLogger(name);
  logger.setLevel('INFO');
  return logger;
};

var routes = require('./routes/index');
var login = require('./routes/login');
var app = express();

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8089');
app.set('port', port);


/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 *  Create Socket server.
 */
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(log4js.connectLogger(logger('router'), {level:log4js.levels.INFO}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(bodyParser.json({limit: '15mb'}));
app.use(bodyParser.urlencoded({limit: '15mb', extended: true}));

app.use('/', routes);
app.use('/login',login);

app.use('/ydyc/ios', function (req, res, next) {
  logger('ios_log').info(JSON.stringify(req.body));

  if (req.body['req']['uid']) {
    users.forEach(function (user) {
      if(user.data.uid == req.body['req']['uid']) {
        user.emit('data', req.body);
      }
    });
  }

  res.send({status:0, msg:"success"});
});

app.use('/ydyc/android', function (req, res, next) {
  logger('android_log').info(JSON.stringify(req.body));

  if (req.body['uid']) {
    users.forEach(function (user) {
      if(user.data.uid == req.body['uid']) {
        user.emit('data', req.body);
      }
    });
  }

  res.send({status:0, msg:"success"});
});

app.use('/ydyc/h5', function (req, res, next) {
  logger('h5_log').info(JSON.stringify(req.body));

  if (req.body['uid']) {
    users.forEach(function (user) {
      if(user.data.uid == req.body['uid']) {
        user.emit('data', req.body);
      }
    });
  }

  res.send({status:0, msg:"success"});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, '0.0.0.0');
server.on('error', onError);
server.on('listening', onListening);
io.on('connection', onConnection);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  logger('normal').debug('Listening on ' + bind);
}

/**
 * Connect to socket server.
 */
function onConnection(socket) {
  socket.on('login', function (data) {
    if (data.type == 'web') {
       addUser(socket, data);
    }
  });

  socket.on('disconnect', function () {
    if (socket.data != undefined) {
      removeUser(socket);
    }
  });
}

function addUser(socket, data) {
  var contained = false;
  if(users.length !=0) {
    users.forEach(function (user) {
      if (user.data.uid == data.uid) {
        contained = true;
      }
    });
  }

  if (contained) {
    socket.emit('login', {status:1, msg:'登录失败,在其他地方已经登录'});
  } else {
    socket.data = data;
    users.push(socket);
    socket.emit('login', {status:0, msg:'登录成功'});
  }
}

function removeUser(socket) {
  var index = 0;
  for(var i =0,len=users.length; i<len; i++) {
    if (users[i].data.uid == socket.data.uid) {
      index = i;
      break;
    }
  }

  users.splice(index, 1);
}


fs.open("pid.txt","w",0644,function(e,fd){
  if(e) throw e;
  fs.write(fd,process.pid,function(e){
    if(e) throw e;
    fs.closeSync(fd);
  });
});
