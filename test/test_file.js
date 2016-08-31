/**
 * Created by 胡玉国 on 16/8/31.
 */
var fs = require('fs');
fs.open("test.txt","w",0644,function(e,fd){
    if(e) throw e;
    fs.write(fd,process.pid,function(e){
        if(e) throw e;
        fs.closeSync(fd);
    });
});

