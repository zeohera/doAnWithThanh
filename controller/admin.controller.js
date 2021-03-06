const bodyParser = require('body-parser')
const md5 = require('md5')
const e = require('express')
const {jsPDF} = require('jspdf')
const User = require('../models/user.model')
const Product = require('../models/product.model')
const ProductCategory = require('../models/productCategory.model')
const SubProductCategory = require('../models/SubProductCategory.model')
const Brand = require('../models/brand.model')
const Bill = require('../models/bill.model')
const Banner = require('../models/banner.model')
var nodemailer = require('nodemailer')
const fs = require("fs")
var path = require('path')



module.exports.generateReport = async (req, res) => {

    var date = new Date()
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    var bill = await Bill.find({'date' : { $gte: firstDay}, 'state' : 2}).exec()
    var earning = 0
    bill.forEach(element => {
        earning = earning + element.price
    })
    var doc = new jsPDF()
    doc.setFont('TimeNewRoman');
    doc.text("Báo cáo", 10, 10)
    doc.setFontSize(12);
    doc.text('Tong thu tu dau thang den ngay  '+ date.toString().replace('(Giờ Đông Dương)', '') +' la : ' + earning , 10, 20)

    var todayTime = new Date()
    var month = todayTime.getMonth() + 1
    var day = todayTime.getDate()
    var year = todayTime .getFullYear()
    var hour = todayTime.getHours()
    var min = todayTime.getMinutes()
    var name = 'time' + hour + min +'date'+ month + "" + day + "" + year + '.pdf'
    var path = 'public/report/'
    console.log(name, typeof(name))
    doc.save(path + name)
    res.download(path + name)
    // res.redirect('/admin')
}

module.exports.index = async (req, res) =>{
    var date = new Date()
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    var bill = await Bill.find({'date' : { $gte: firstDay}, 'state' : 2}).exec()
    var earning = 0
    bill.forEach(element => {
        earning = earning + element.price
    })
    var Bill2 = await Bill.find({state : 0})
    var total = 0
    Bill2.forEach(element => {
        total += 1
    })
    

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
    var page = req.query.page || 1
    if (page < 1 ) page = 1
    var perPage = 20
    var start = (page -1 ) * perPage
    
    var arr = []
    var pageX = page
    for ( var i = pageX -2 ; i <= parseInt(page) + 2 ; i++ )
        if (i > 0) arr.push(i)
    
    req.url = req.url.replace("?page=" + page, "")  
    req.url = req.url + '?page='

    var products = await  Product.find().skip(start).limit(perPage).exec()
    res.render('admin/productManager',
    {
        products : products,
        pageArray : arr,
        currentURL :'/admin' +  req.url

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

module.exports.changePublicState = async (req, res)=>{
    var id = req.params.id
    var product = await Product.findById(id).exec()
    if (product.public == true)
        await Product.findByIdAndUpdate(id , {public : false})
    else 
        await Product.findByIdAndUpdate(id , {public : true})
    res.redirect('/admin/productManager')

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

module.exports.postProductUpdate = async (req, res) => {
    var prodDel = await Product.findOne({ _id : req.params.id }).exec()
    var path = prodDel.image
    console.log(req.body.image)
    if(req.body.image != undefined)
    {
        console.log('inside')
        try {
            fs.unlinkSync('public/'+ path)
            console.log("Successfully deleted the file.")
            
        } catch(err) {
            throw err
        }
    }
    if (req.file)
        req.body.image = req.file.path.split('\\').slice(1).join('/')
    await Product.findOneAndUpdate( {_id: req.params.id }, req.body, (err, doc)=> {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
    })
    res.redirect('/admin/productManager')
}

// PRODUCT CATEGORY MANAGER
module.exports.productCategoryManager = async (req, res) => {
    var page = req.query.page || 1
    if (page < 1 ) page = 1
    var perPage = 5
    var start = (page -1 ) * perPage
    var arr = []
    var pageX = page
    for ( var i = pageX -2 ; i <= parseInt(page) + 2 ; i++ )
        if (i > 0) arr.push(i)
    var productCategory = await ProductCategory.find().skip(start).limit(perPage).exec()
    req.url = req.url.replace("?page=" + page, "")
    res.render('admin/productCategoryManager', {
        productCategories : productCategory,
        pageArray : arr,
        currentURL :'/admin' +  req.url,
    })
}

module.exports.createProductCategory = (req, res)=>{
    res.render('admin/createProductCategory')
}


module.exports.postProductCategoryCreate = (req, res) => {
    req.body.image = req.file.path.split('\\').slice(1).join('/')
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
module.exports.updateProductCategory = async (req, res) =>{
    var Category = await ProductCategory.findById(req.params.id).exec()
    var errors = []
    // res.send(Category)
    res.render('admin/updateProductCategory',{
        category : Category,
        errors : errors
    })
}
module.exports.postUpdateProductCategory = async (req, res)=> {
    var category = await ProductCategory.findOne({ _id : req.params.id }).exec()
    var path = category.image
    console.log(req.body.image)
    if(req.body.image != undefined)
    {
        console.log('inside')
        try {
            fs.unlinkSync('public/'+ path)
            console.log("Successfully deleted the file.")
            
        } catch(err) {
            throw err
        }
    }
    if (req.file)
        req.body.image = req.file.path.split('\\').slice(1).join('/')
    await ProductCategory.findOneAndUpdate( {_id: req.params.id }, req.body, (err, doc)=> {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
    })
    res.redirect('/admin/productCategoryManager')
     
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
module.exports.updateBrand = async (req, res)=> {
    var category = await ProductCategory.findOne({ _id : req.params.id }).exec()
    var brand = await  Brand.findOne({_id :req.params.id}).exec()
    console.log('brand', brand)
    var error = []
    // res.send
    res.render('admin/updateBrand',
    {
        brand : brand,
        errors : error
    })
}

module.exports.postUpdateBrand = async (req , res)=>{

    var brand = await Brand.findOne({ _id : req.params.id }).exec()
    var path = brand.image
    console.log(req.body.image)
    if(req.body.image != undefined)
    {
        console.log('inside')
        try {
            fs.unlinkSync('public/'+ path)
            console.log("Successfully deleted the file.")
            
        } catch(err) {
            throw err
        }
    }
    if (req.file)
        req.body.image = req.file.path.split('\\').slice(1).join('/')
    await Brand.findOneAndUpdate( {_id: req.params.id }, req.body, (err, doc)=> {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
    })
    res.redirect('/admin/productCategoryManager')
     
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
    var page = req.query.page || 1
    if (page < 1 ) page = 1
    var perPage = 20
    var start = (page -1 ) * perPage
    
    var arr = []
    var pageX = page
    for ( var i = pageX -2 ; i <= parseInt(page) + 2 ; i++ )
        if (i > 0) arr.push(i)

    if (!req.query.stateX)
        {
            var orders = await Bill.find().skip(start).limit(perPage)
        }
    else{
        var orders = await Bill.find({'state' : req.query.stateX}).skip(start).limit(perPage)
    }

    req.url = req.url.replace("&page=" + page, "")  
    if(req.url.includes('?stateX='))
    {
        req.url = req.url + '&page='
    }else req.url = req.url 

    res.render('admin/orderManager',{
        orders : orders,
        pageArray : arr,
        currentURL :'/admin' +  req.url

    })
}
module.exports.orderDetail = async (req, res) => {
    var id = req.params.id
    var order = await Bill.findOne({_id : id })
    var emailText = 'id đơn hàng của bạn : ' + req.params.id + ' <br>;.Có giá trị là:' + order.price 
    res.render('admin/orderDetail',{
        order : order
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

module.exports.bannerImageManager = async (req, res) => {
    var banner = await Banner.find({}).exec()
    res.render('admin/bannerManager', {
        banners : banner
    })
}
module.exports.bannerUploader = (req, res) =>{
    res.render('admin/bannerUploader')
}
module.exports.postBannerUploader = async (req, res) =>{
    req.body.image = req.file.path.split('\\').slice(1).join('/')
    await Banner.create(req.body)
    res.redirect('/admin/bannerManager')
}
module.exports.deleteBanner = async (req, res) => {
    var id = req.params.id
    var banner = await Banner.findOne({ _id : id}).exec()
    var path = banner.image
    try {
        fs.unlinkSync('public/'+path)
        console.log("Successfully deleted the file.")
        Banner.deleteOne({ _id : id}).then(function(){
            res.redirect('/admin/adminManager')
        })
      } catch(err) {
        throw err
      }
}
