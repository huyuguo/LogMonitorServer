/**
 * Created by 胡玉国 on 16/8/31.
 */

var os = require('os');


var IPv4, hostName;
hostName = os.hostname();
// console.log(hostName)

// for (var i=0;i<os.networkInterfaces().eth0.length;i++) {
//     if(os.networkInterfaces().eth0[i].family == 'IPv4') {
//         IPv4 = os.networkInterfaces().eth0[i].address;
//     }
// }
//
// console.log(IPv4);
console.log(IPv4(os.platform()));


function IPv4(platform) {
    if (platform == 'darwin') {
        var en0 = os.networkInterfaces().en0;
        var length = en0.length;
        for (var i=0;i<length;i++) {
            if (en0[i].family == 'IPv4') {
                return en0[i].address;
            }
        }
    }
    else if (platform == 'linux') {
        var eth0 = os.networkInterfaces().eth0;
        var length = eth0.length;
        for (var i=0;i<length;i++) {
            if (eth0[i].family == 'IPv4') {
                return eth0[i].address;
            }
        }
    }
    else {
        return 'Unkown IPv4';
    }
}
