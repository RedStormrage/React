const Product = require('../model/products')

exports.getAddProducts = (req,res,next)=>{
    res.render('admin/add-product',{title:'添加商品', path: '/admin/add-product',prods: Product.fetchAll()})
}

exports.postAddProducts = (req,res,next)=>{
    console.log(req.body)
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/')
}

exports.getProducts = (req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('shop/product-list',{
            prods: products,
            pageTitle: '我的商店',
            path: '/'})
    })
}