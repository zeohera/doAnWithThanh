const express = require('express')
var multer  = require('multer')
const router = express.Router()

var controller = require('../controller/auth.controller')
const { route } = require('./admin.route')


router.get('/login', controller.index)

router.get('/logout', controller.logout) 

router.post('/login', controller.PostIndex)


module.exports = router