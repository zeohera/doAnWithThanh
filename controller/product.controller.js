const db = require('../db')
const shortid = require('shortid')
const bodyParser = require('body-parser')
const Product = require('../models/product.model')
const Cart = require('../models/cart');
const { response } = require('express')

module.exports.index = async (req, res) => {
    var page = req.query.page || 1
    var perPage = 12
    var start = (page -1 ) * perPage
    var products = await  Product.find().skip(start).limit(perPage).exec()
    res.render('product/index', {
        products : products
    })

}

module.exports.category = async (req, res) =>{
    var name = req.query.name 
    console.log(name)
    // var category = req.query.name'
    var products = await Product.find({category: name}).exec()
    console.log(products)
    res.render('product/category',{
        products: products
    })
    // res.send('xxx')
}
module.exports.shoppingCart = async (req, res) => {
    cart = req.session.cart 
    console.log(cart)
    res.render('product/shoppingCart')
}
module.exports.addToShoppingCart = async (req, res) => { 
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var product = await Product.findOne({'_id' : productId})
    console.log(product)
    cart.add(product._doc, productId);
    req.session.cart = cart;
    console.log(cart)
    cartTotalItems = cart.totalItems
    console.log('cartTotalItems', cartTotalItems)
    res.redirect('/product/shoppingCart')
}
module.exports.checkOut = async (req, res) => {
    res.render('product/checkout')
}

module.exports.search = async (req, res)=>{
    var q = req.query.q
    productsFounded = await Product.find({'name':q}).exec()
    console.log(productsFounded)
    res.render('product/index',
    {
        products: productsFounded,
        q : q
    })

    
}

module.exports.create = (req,res)=>{
    res.render('product/create');
}
module.exports.detail = (req,res)=>{
    var id = req.params.id
    Product.findOne({_id: id }).then(function(product){
        res.render('product/view',{
            product: product
        })
    })
}

module.exports.postCreate = (req,res)=>{
    req.body.id = shortid.generate()
    var errors = []
    if(!req.body.name) {
        errors.push('cần nhập tên sản phẩm')
    }
    if (errors.length){
        res.render('product/create',{
            errors : errors,
            values : req.body
        })
        return
    }

    console.log(req.file)
    req.body.avatar = req.file.path.split('\\').slice(1).join('/')
    db.get('products').push(req.body).write()
    res.redirect('/product')
}