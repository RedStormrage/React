const http = require('http')
const express = require('express')
const app = express() // 初始化express一个对象,处理请求的处理器
app.use((req,res,next)=>{
    console.log('中间件中....')
    next()
}) // 中间件,next是一个函数，该函数适用于执行以下一个next
app.use((req,res,next)=>{
    console.log('中间件中1....')
    next()
})
const server = http.createServer(app)
server.listen(3000)
