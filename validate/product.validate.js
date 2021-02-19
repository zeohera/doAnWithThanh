module.exports.postCreate = (req, res, next) => {
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
    next()
}