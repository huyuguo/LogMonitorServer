var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
/**
 * http://blog.fens.me/nodejs-log4js/
 * log4js的输出级别6个: trace, debug, info, warn, error, fatal
 */
var log4js = require('log4js');
log4js.configure({
  appenders:[
    // {type: 'console'},
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
    }
  ],
  replaceConsole: true
});

var logger = exports.logger = function (name) {
  var logger = log4js.getLogger(name);
  logger.setLevel('DEBUG');
  return logger;
};

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
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
// app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO, format:':method :url'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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

server.listen(port);
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
  // logger('socket').info('connected');
  // socket.join('rooooomm', function (error) {
    // if (error) {
    //   logger('socket').info('join room error');
    // } else {
    //   logger('socket').info('join room success');
    // }
  // });
  // socket.to('rooooomm').emit('roomData', 'cooolllllll');
  // socket.emit('add user', 'come on baby');
  socket.on('disconnect', function () {
    // logger('socket').info('disconnected');
  });

}
