var db = require('../db')
const User = require('../models/user.model')

module.exports.requireAuth = async (req, res, next) => {
    if(!req.signedCookies.adminAccount)
    {
        res.redirect('/auth/login')
        return
    }

    var user = await User.findOne({account:req.signedCookies.adminAccount}).exec() 
    if(!user){
        res.redirect('/auth/login')
        
        return
    }
    
    res.locals.user = user
    next()  
}