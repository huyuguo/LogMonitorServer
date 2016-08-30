/**
 * Created by 胡玉国 on 16/8/30.
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
            filename: 'test_log/',
            pattern: 'ios_yyyyMMddhh.log',
            alwaysIncludePattern: true,
            category: 'ydyc_data_monitor'
        }
    ],
    replaceConsole: true
});

var logger = exports.logger = function (name) {
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
};


logger('ydyc_data_monitor').info('sdfsdfdsfdsf');
