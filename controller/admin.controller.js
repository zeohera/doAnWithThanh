const bodyParser = require('body-parser')
const md5 = require('md5')
const e = require('express')
const User = require('../models/user.model')
const Product = require('../models/product.model')
const ProductCategory = require('../models/productCategory.model')
const SubProductCategory = require('../models/SubProductCategory.model')
const Brand = require('../models/brand.model')

module.exports.index = (req, res) =>{
    res.render('admin/dashboard')
}


// ADMIN MANAGER
module.exports.adminManager = (req, res) =>{
    User.find( (error, data) => {
        if(error){
            console.log(error)
        } else {
            res.render('admin/adminManager', {
                users : data
            })
        }
    })
}

module.exports.addAdmin = (req, res) => {
    res.render('admin/createAdmin')
}

module.exports.postAdminCreate = (req, res) =>{
    var errors = []
    if(!req.body.name) {
        errors.push('cần nhập tên sản phẩm')
    }
    if (errors.length){
        res.render('admin/createAdmin',{
            errors : errors,
            values : req.body
        })
        return
    }
    console.log(req.body)
    // chưa làm kiểm tra tên file có trong hệ thống hay không
    req.body.avatar = req.file.path.split('\\').slice(1).join('/')
    var hashedPassword = md5(req.body.password)
    req.body.password = hashedPassword
    User.create(req.body)
    res.redirect('adminManager')
}

module.exports.deleteAdmin = (req, res) =>
{
    // chưa xóa được ảnh lưu trong file hệ thống : tìm hiểu cách render file ảnh bằng file binary hoặc xóa ảnh trong hệ thống trước khi xóa document
    var id = req.params.id
    // db.get('users').remove({id : id}).write()
    User.deleteOne({ _id : id}).then(function(){
        res.redirect('/admin/adminManager')
    })
}

module.exports.updateAdmin = async (req, res) => {
    
    var info = await User.findById(req.params.id).exec()
    // res.send(info)
    res.render('admin/adminUpdate',
    {
        values : info
    }
    )
}

module.exports.postUpdateAdmin = async (req, res) =>{
    console.log(req.body.passwordOld)
    var password = md5(req.body.passwordOld)
    var info = await User.findById(req.params.id).exec()
    console.log(info)
    errors = []
    if (password != info.password)
    {
        errors.push('mật khẩu không chính xác')
        res.render('admin/adminUpdate', {
            values : info, 
            errors : errors
        })
        return
    }
    console.log('throw 2')
    req.body.password = md5(req.body.passwordNew)
    console.log(req.body.password)
    User.findOneAndUpdate( {_id: info._id }, req.body, (err, doc)=> {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
    })
    res.redirect('/admin/adminManager')
    
}

// ---PRODUCT MANAGER
module.exports.productManager = async (req, res) => {
    var products = await  Product.find().exec()
    res.render('admin/productManager',
    {
        products : products
    })
}

module.exports.productCreate = async (req,res) => {
    var productCategory = await ProductCategory.find().exec()
    var brand = await  Brand.find().exec()
    var subProductCategory = await SubProductCategory.find().exec()
    res.render('admin/productCreate', {
        ProductCategories : productCategory,
        brands : brand,
        SubProductCategories : subProductCategory
    })
    res.send({
        ProductCategories : productCategory,
        brands : brand,
        SubProductCategories : subProductCategory
    })
}

module.exports.postProductCreate = (req, res) => {
    // req.body.price = parseInt(req.body.price)
    // req.body.discountedPrice = parseInt(req.body.discountedPrice)
    req.body.image = req.file.path.split('\\').slice(1).join('/')
    console.log(req.body)
    Product.create(req.body)
    res.redirect('productManager') 
}


module.exports.deleteProduct = (req, res) => {
    var id = req.params.id
    Product.deleteOne({ _id : id}).then(function(){
        res.redirect('/admin/productManager')
    })
}



// PRODUCT CATEGORY MANAGER
module.exports.productCategoryManager = async (req, res) => {
    var productCategory = await ProductCategory.find().exec()
    res.render('admin/productCategoryManager', {
        productCategories : productCategory
    })
}

module.exports.createProductCategory = (req, res)=>{
    res.render('admin/createProductCategory')
}

module.exports.postProductCategoryCreate = (req, res) => {
    ProductCategory.create(req.body)
    res.redirect('productCategoryManager')
}

module.exports.deleteProductCategory = (req, res) =>
{
    var id = req.params.id
    ProductCategory.deleteOne({ _id : id}).then(function(){
        res.redirect('/admin/productCategoryManager')
    })
}


// BRAND MANAGER    
module.exports.brandManager = async (req, res) => {
    var brand = await  Brand.find().exec()

    res.render('admin/brandManager',
    {
        brands : brand
    })
}

module.exports.addBrand =  (req, res) => {
    res.render ('admin/addBrand')
}

module.exports.postAddBrand = (req, res) =>{
    req.body.logo = req.file.path.split('\\').slice(1).join('/')
    Brand.create(req.body)
    res.redirect('brandManager')
}

module.exports.deleteBrand = (req, res) =>
{
    var id = req.params.id
    Brand.deleteOne({ _id : id}).then(function(){
        res.redirect('/admin/brandManager')
    })
}

// SUBCATEGORY
module.exports.subProductCategoryManager = async (req, res) =>{
    var subProductCategory = await SubProductCategory.find().exec()
    res.render('admin/subProductCategoryManager', 
    {
        subProductCategories : subProductCategory
    })
}
module.exports.createSubProductCategory = async (req, res)=>{
    var productCategory = await ProductCategory.find().exec()
    res.render('admin/createSubProductCategory',{
        productCategories : productCategory
        
    })
}

module.exports.postCreateSubProductCategory = async (req, res)=>{
    SubProductCategory.create(req.body)
    res.redirect('subProductCategoryManager')
}
module.exports.deleteSubProductCategory = (req, res) =>
{
    var id = req.params.id
    SubProductCategory.deleteOne({ _id : id}).then(function(){
        res.redirect('/admin/subProductCategoryManager')
    })
}
