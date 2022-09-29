const express = require('express')
const router = express.Router() // 初始化一个路由对象生成器
const productsController = require('../controllers/products')

router.get('/add-product',productsController.getAddProducts )
router.post('/product',productsController.postAddProducts)


module.exports = router;