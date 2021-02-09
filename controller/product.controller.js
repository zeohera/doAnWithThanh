const db = require('../db')
const shortid = require('shortid')
const bodyParser = require('body-parser')
const Product = require('../models/product.model')

module.exports.index = (req, res) => {
    var page = req.query.page || 1
    var perPage = 12
    var start = (page -1 ) * perPage
    Product.find().skip(start).limit(perPage).then(function(products){
        res.render('product/index', {
            products : products
        })
    })
}

module.exports.search = (req, res)=>{
    var q = req.query.q
    productsFounded = Product.find({'name':q}, (error, data) =>{
        if(error){
            console.log(error)
        } else{
            res.render('product/search',
            {
                products: data,
                q : q
            })
        }
    }).exec()
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