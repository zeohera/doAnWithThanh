const { signedCookie } = require('cookie-parser')
const md5 = require('md5')

const db = require('../db')
const User = require('../models/user.model')
module.exports.index = (req, res) =>{
    res.render('auth/login')
}
module.exports.PostIndex = async (req, res) => {
    var account = req.body.account
    var password = req.body.password

    // var user = db.get('users').find({account : account}).value()
    // var user
    user = await User.findOne({account : account}).exec()
    if(!user){
        res.render('auth/login',{
            errors : [
                'Tài khoản không tồn tại'
            ],
            values : req.body
        })
        return
    }
    var hashedPassword = md5(password)
    if(user.password !== hashedPassword)
    {
        res.render('auth/login',{
            errors : [
                'Mật khẩu không đúng'
            ],
            values : req.body
        })
        return
    }
    res.cookie('adminAccount', user.account, {
        signed : true
    })

    res.redirect('/admin')
    
}
module.exports.logout = (req, res) => {
    res.clearCookie('adminAccount')
    res.redirect('/auth/login')
}