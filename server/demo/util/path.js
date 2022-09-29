const path = require('path')
// process.mainModule指向该项目的启动模块，当前是app.js
module.exports = path.dirname(process.mainModule.filename)
// 返回app.js当前的目录的路径