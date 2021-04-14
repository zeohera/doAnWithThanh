const db = require('../db')
const shortid = require('shortid')
const bodyParser = require('body-parser')
const Product = require('../models/product.model')
const Cart = require('../models/cart');
const Bill = require('../models/bill.model');
const Brand = require('../models/brand.model')
const Banner = require('../models/banner.model')
const ProductCategory = require('../models/productCategory.model')
const SubProductCategory = require('../models/SubProductCategory.model')
const { response } = require('express');
const { NULL } = require('node-sass');

module.exports.index = async (req, res) => {
    var range = req.query.range || 2
    var backgroundImage = 'images/wall.jpg'
    var page = req.query.page || 1
    if (page < 1 ) page = 1
    var perPage = 18
    var start = (page -1 ) * perPage

    var productInRange = []
    if (range == 1)
    {
        productInRange = await Product.find({public : true, price : {$lt:2000000} }).limit(perPage).exec()
    }
    else if (range == 2)
    {
        productInRange = await  Product.find({public : true,}).where('price').gt(2000000).lt(5000000).limit(perPage).exec()
    }
    else if (range == 3)
    {
        productInRange = await  Product.find({public : true,}).where('price').gt(5000000).lt(7000000).limit(perPage).exec()
    }
    else if (range == 4)
    {
        productInRange = await  Product.find({public : true,}).where('price').gt(7000000).lt(10000000).limit(perPage).exec()
    }
    else if (range == 5)
    {
        productInRange = await  Product.find({public : true,}).where('price').gt(10000000).lt(15000000).limit(perPage).exec()
    }
    else if (range == 6)
    {
        productInRange = await Product.find({public : true, price : {$gt: 15000000} }).limit(perPage).exec()
    }

    var productsSale = await Product.find({public : true,}).where('discountedPrice').ne(0).ne(null).limit(6)
    var ProductPreOrder = await Product.find({public : true,amount : -1}).limit(12)
    var page = req.query.page || 1
    var perPage = 12
    var start = (page -1 ) * perPage
    var brand = await Brand.find().exec()
    var products = await  Product.find().skip(start).limit(perPage).exec()
    var banner = await Banner.find({}).exec()
    console.log(ProductPreOrder)
    // console.log(banner)
    res.render('product/index', {
        products : products,
        brands : brand,
        productsInRange : productInRange,
        productsSale : productsSale ,
        ProductPreOrder : ProductPreOrder,
        backgroundImage : backgroundImage,
        banners : banner
    })

}

module.exports.category = async (req, res) =>{
    var name = req.query.name 
    if( req.query.name == 'discounted')
    {
        var activeSubCategory = req.query.subCategory
        if (req.query.sort == 1)
            {
                var productsSale = await Product.find({public : true,}).where('discountedPrice').ne(0).ne(null).sort({price: 1})
            }
        else if (req.query.sort == -1)
        {
            var productsSale = await Product.find({public : true,}).where('discountedPrice').ne(0).ne(null).sort({price: -1})
        } 
        else var productsSale = await Product.find({public : true,}).where('discountedPrice').ne(0).ne(null)
        
        var backgroundImage = 'images/wall.jpg'
        res.render('product/category',{
            products: productsSale,
            category : name,
            subCategories : subCategories,
            activeSubCategory : activeSubCategory,
            sort : req.query.sort,
            recentPage : page,
            currentURL : req.url,
            pageArray : arr, 
            backgroundImage : backgroundImage
        })
    }
    var subCategories = await SubProductCategory.find({mother : name}).exec()
    var products
    var page = req.query.page || 1
    if (page < 1 ) page = 1
    var perPage = 12
    var start = (page -1 ) * perPage
    if (req.query.subCategory)
    {
        var activeSubCategory = req.query.subCategory
        if (req.query.sort == 1)
            {
                products = await Product.find({public : true,category: name, subCategory : activeSubCategory}).sort({price: 1}).skip(start).limit(perPage).exec()
            }
        else if (req.query.sort == -1)
        {
            products = await Product.find({public : true,category: name, subCategory : activeSubCategory}).sort({price: -1}).skip(start).limit(perPage).exec()
        } 
        else products = await Product.find({public : true,category: name, subCategory : activeSubCategory}).skip(start).limit(perPage).exec()
    }
    else
    {
        if (req.query.sort == 1)
        {
            products = await Product.find({public : true,category: name}).sort({price: 1}).skip(start).limit(perPage).exec()
        }
        else if (req.query.sort == -1)
        {
            products = await Product.find({public : true,category: name}).sort({price: -1}).skip(start).limit(perPage).exec()
        } 
        else products = await Product.find({public : true,category: name}).skip(start).limit(perPage).exec()
    }
    req.url = req.url.replace("/category/","")
    req.url = req.url.replace("&page=" + page, "")
    console.log(req.url)
    var arr = []
    var pageX = page
    for ( var i = pageX -2 ; i <= parseInt(page) + 2 ; i++ )
        if (i > 0) arr.push(i)
    
    var category = await ProductCategory.findOne({'name' : name}).exec()
    var image = category.image 
    console.log("name", name, image)
    res.render('product/category',{
        products: products,
        category : name,
        subCategories : subCategories,
        activeSubCategory : activeSubCategory,
        sort : req.query.sort,
        recentPage : page,
        currentURL : req.url,
        pageArray : arr,
        backgroundImage : image
    })

}
module.exports.shoppingCart = async (req, res) => {
    if (!req.session.cart || req.session.cart.totalPrice == '0') 
    {
        return res.render('product/shoppingCart', {
            products: null
        });
    } 
    
    else
    {
        cart = new Cart(req.session.cart)
        var arr = cart.getItems()
        console.log(arr)
        var totalPrice = cart.totalPrice
        res.render('product/shoppingCart', {
            title: 'Shopping Cart',
            products: arr,
            totalPrice: totalPrice
        })
    }
}
module.exports.addToShoppingCart = async (req, res) => { 
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var product = await Product.findOne({'_id' : productId})
    cart.add(product._doc, productId);
    req.session.cart = cart;
    cartTotalItems = cart.totalItems
    console.log('cartTotalItems', cartTotalItems)
    res.redirect('/product/shoppingCart')
}

module.exports.removeCartItem = async (req, res) => {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/product/shoppingCart'); 

}

module.exports.checkOut = async (req, res) => {
    cart = new Cart(req.session.cart)
    var arr = cart.getItems()
    console.log(arr)
    var totalPrice = cart.totalPrice    
    res.render('product/checkout', {
        title: 'Checkout',
        products: arr,
        totalPrice: totalPrice
    })
}


module.exports.postCheckOut = async (req, res) =>
{
    cart = new Cart(req.session.cart)
    var arr = cart.getItems()
    req.body.items = cart.items
    req.body.price = cart.totalPrice
    req.body.state = 0
    userNote = req.body.note 
    req.body.note = []
    req.body.note.push(userNote)
    req.body.date = Date.now()
    Bill.create(req.body)
    var cart = new Cart(req.body)
    var arr = cart.getItems()
    console.log(arr)
    for (var product  in arr){
        var obj = arr[product]
        var newAmount =  obj.item['amount'] -  obj.quantity
        console.log(newAmount)
        await Product.findByIdAndUpdate( {_id : obj.item['_id']}, {'amount' : newAmount})
        
    }
    req.session.destroy()
    res.redirect('/product')
}
module.exports.search = async (req, res)=>{
    var q = req.query.q
    productsFounded = await Product.find({public : true,'name':q}).exec()
    console.log(productsFounded)
    res.render('product/search',
    {
        products: productsFounded,
        q : q
    })
}

module.exports.create = (req,res)=>{
    res.render('product/create');
}

module.exports.detail = async (req,res)=>{
    var id = req.params.id
    var backgroundImage = 'images/wall.jpg'
    var product = await Product.findOne({_id : id}).exec()
    console.log(product.brand)
    var brand = await Brand.findOne({name : product.brand}).exec()
    console.log(brand)
    var brandLogo = brand.logo
    var giftListID = product.gift
    var giftList = []
    if (giftListID != "")
        for ( var giftID of giftListID){
            var giftProduct = await Product.findOne({'_id' : giftID}).exec()
            console.log(giftProduct)
            var giftName = giftProduct.name
            var giftImage = giftProduct.image
            giftList.push({giftName : giftName, giftID : giftID, giftImage : giftImage})
        }
    console.log(giftList[0])
    res.render('product/view', {
        productDetail : product,
        brandLogo : brandLogo,
        backgroundImage : backgroundImage,
        giftList : giftList
    })
}

module.exports.brandInfo = async (req, res) =>{
    var name = req.params.brand
    console.log(name) 
    var brand = await Brand.findOne({'name' : name}).exec()
    console.log(brand)
    var backgroundImage = brand.image || '1'
    var product = await Product.find({public : true,'brand' : name}).exec()
    res.render('product/brand',{
        products : product,
        brand : brand,
        backgroundImage : backgroundImage
    })
}

module.exports.postCreate = (req,res)=>{
    req.body.id = shortid.generate()
    var errors = []
    if(!req.body.name) 
    {
        errors.push('cần nhập tên sản phẩm')
    }
    if (errors.length)
    {
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

