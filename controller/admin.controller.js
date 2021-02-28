const bodyParser = require('body-parser')
const md5 = require('md5')
const e = require('express')
const User = require('../models/user.model')
const Product = require('../models/product.model')
const ProductCategory = require('../models/productCategory.model')
const SubProductCategory = require('../models/SubProductCategory.model')
const Brand = require('../models/brand.model')
const Bill = require('../models/bill.model')
var nodemailer = require('nodemailer')
const fs = require("fs")
var path = require('path')

module.exports.index = async (req, res) =>{
    var Bills = await Bill.find({state: 2})
    var earning = 0
    var now = new Date()
    var nowMonth = now.getMonth()
    var nowYear = now.getFullYear()
    console.log(now)
    Bills.forEach(element => {
        var dateTime  = new Date(element.date)
        month = dateTime.getMonth()
        year = dateTime.getFullYear()
        if (nowMonth === month)
            if(nowYear === year)
                earning += element.price
    })
    var Bill2 = await Bill.find({state : 0})
    var total = 0
    Bill2.forEach(element => {
        total += 1
    })
    console.log(total)
    

    res.render('admin/dashboard', {
        earning : earning ,
        notConfirm : total
    })
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

module.exports.deleteAdmin = async (req, res) =>
{
    
    var id = req.params.id
    var userDel = await User.findOne({ _id : id}).exec()
    var path = userDel.avatar
    try {
        fs.unlinkSync('public/'+path)
        console.log("Successfully deleted the file.")
        User.deleteOne({ _id : id}).then(function(){
            res.redirect('/admin/adminManager')
        })
      } catch(err) {
        throw err
      }
    
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

module.exports.detailAdmin = async (req, res) => 
{
    var info = await User.findById(req.params.id).exec()
    // res.send(info)
    res.render('admin/adminDetail',
    {
        values : info
    })
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
    req.body.image = req.file.path.split('\\').slice(1).join('/')
    console.log(req.body)
    Product.create(req.body)
    res.redirect('productManager') 
}

module.exports.deleteProduct = async (req, res) => {

    var id = req.params.id
    var prodDel = await Product.findOne({ _id : id}).exec()
    var path = prodDel.image
    try {
        fs.unlinkSync('public/'+path)
        console.log("Successfully deleted the file.")
        Product.deleteOne({ _id : id}).then(function(){
            res.redirect('/admin/productManager')
        })
      } catch(err) {
        throw err
      }
    
}

module.exports.productUpdate = async (req, res ) => {
    var info = await  Product.findOne({_id : req.params.id}).exec()
    var err = []
    var productCategory = await ProductCategory.find().exec()
    var brand = await  Brand.find().exec()
    var subProductCategory = await SubProductCategory.find().exec()
    res.render('admin/productUpdate', {
        info : info, 
        errors : err,
        ProductCategories : productCategory,
        brands : brand,
        SubProductCategories : subProductCategory
    })
}

module.exports.postProductUpdate = (req, res) => {
    Product.findOneAndUpdate( {_id: req.params.id }, req.body, (err, doc)=> {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
    })
    res.redirect('/admin/productManager')
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

module.exports.deleteProductCategory = async (req, res) =>
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
// BILL MANAGER
module.exports.orderManager = async (req, res) => {
    var orders = await Bill.find()
    res.render('admin/orderManager',{
        orders : orders
    })
}
module.exports.orderDetail = async (req, res) => {
    var id = req.params.id
    var order = await Bill.findOne({_id : id })
    var emailText = 'id đơn hàng của bạn : ' + req.params.id + ' .Có giá trị là:' + order.price 
    res.render('admin/orderDetail',{
        order : order,
        email : emailText
    })
}
module.exports.postUpdateOrderDetail = async (req, res)=>{
    var id = req.params.id
    console.log(id , req.body)
    Bill.findByIdAndUpdate({_id: id}, req.body, (err, doc)=> {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            console.log(doc);})
    res.redirect('/admin/order/'+ id) 
}
 
module.exports.mailSend = (req, res) =>{
    var mail = req.params.mail
    var mailOptions = {
        from: 'buichibao1011@gmail.com',
        to: mail,
        subject: 'InsMaster',
        text: req.body.mail  
      };
    console.log(mailOptions)
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
    res.redirect('/admin/')
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'buichibao1011@gmail.com',
      pass: '101120Bao'
    }
  });
