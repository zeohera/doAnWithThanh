module.exports.postAdminCreate = (req, res, next) => {
    console.log(req.body)
    var errors = []
    if(!req.body.name) {
        errors.push('cần nhập tên admin')
    }
    if(!req.body.account) {
        errors.push('cần nhập tên tài khoản đăng nhập')
    }
    if(!req.file) {
        errors.push('chưa chọn ảnh')
    }
    if(!req.body.phoneNumber) {
        errors.push('chưa ghi số điện thoại')
    }
    if(!req.body.email) {
        errors.push('chưa ghi địa chỉ mail')
    }
    if(!req.body.phoneNumber ) {
        errors.push('chưa nhập mật khẩu')
    }
    if (errors.length)
    {
        res.render('admin/createAdmin',
        {
            errors : errors,
            values : req.body
        })
        return
    }
    next()
}