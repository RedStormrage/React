const path = require('path')
const fs = require('fs')
const p = path.join( // 获取数据文件路径
            path.dirname(process.mainModule.filename),
            'data',
            'products.json'
            )
const getProductsFromFile = (cb)=>{
    fs.readFile(p,(err,fileContent)=>{
        if(err){ // 如果报错，说明无该文件，为避免报错，返回空数组 
            return cb && cb([])
        }
        return cb && cb(JSON.parse(fileContent))
    }) 
}

// const products = []
class Product {
    constructor(title){
        this.title = title
    }
    save(){
        getProductsFromFile((products)=>{
            products.unshift(this)
            fs.writeFile(p,JSON.stringify(products),(err)=>{ // 转成stringfy再次写入到文件中
                err && console.log(err)
            })
        })
        // const p = path.join( // 获取数据文件路径
        //     path.dirname(process.mainModule.filename),
        //     'data',
        //     'products.json'
        //     )
        // fs.readFile(p,(err,fileContent)=>{ // 写入数据文件
        //     let products = []
        //     if(!err){ // 没报错说明有该文件，通过JSON将filContent转成对象
        //         products = JSON.parse(fileContent)
        //     }
        //     products.push(this) // 将新增的数据push到数组中
        //     fs.writeFile(p,JSON.stringify(products),(err)=>{ // 转成stringfy再次写入到文件中
        //         err && console.log(err)
        //     })
        // })
    }
    static fetchAll(cb){
        getProductsFromFile(cb)
    }
} 
module.exports = Product