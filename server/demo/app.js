const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')
const app = express()
//参1: 告知使用模版引擎，参2: 用哪种模版引擎
app.set('view engine','ejs')
// 如果你用的不是views来给文件夹命名，那就要此多一个set，设置名字，路径
app.set('views','views')
app.use(bodyParser.urlencoded({extended:false}))
// 通过给予static方法设置静态文件路径，使其能发送本地html文件同时让html文件引入css静态文件
app.use(express.static(path.join(__dirname,'public'))) 
app.use(shopRoutes)
app.use('/admin',adminRoutes) // 将参数1设置为公共路径
app.use((req,res,next)=>{
    // res.status(404).sendFile(path.join(__dirname,'views','404.html'))
    res.render('404',{title: '404'})
}) // 如果第一个参数是‘/’，可以省略，因为默认值就是‘/’
    

app.listen(3000)