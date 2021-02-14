const bodyParser = require('body-parser')
const md5 = require('md5')
const e = require('express')
const User = require('../models/user.model')
const Product = require('../models/product.model')

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

// PRODUCT CATEGORY MANAGER
module.exports.productCategoryManager = (req, res) => {
    res.render('admin/productCategoryManager')
}