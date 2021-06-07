require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
var session = require('express-session');
var path = require('path')
var _ = require('lodash');
var cors = require('cors')
function unpollute(req, res, next) {
  req.body = _.omit(req.body, '__proto__');
  next();
}

mongoose.connect(process.env.MONGO_HOST,{ useNewUrlParser: true })
  .then(() => console.log("MongoDB connected")) .catch((err) => console.log(err));

var productRoute = require('./routes/product.route')
var adminRoute = require('./routes/admin.route')
var authRoute = require('./routes/auth.route')
var authMiddleware = require('./middlewares/auth.middleware')
var apiProductRoute = require('./API/routes/product.route')
var apiAdminRoute = require('./API/routes/admin.route')

app.use(express.static('public'))
app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/images',express.static('public/images'));
app.use('*/slide', express.static(path.join(__dirname + 'node_modules/@splidejs/splide/dist')));
app.use('*/css',express.static('public/sbAdmin2/css'));
app.use('*/js',express.static('public/sbAdmin2/js'));
app.use('*/img',express.static('public/sbAdmin2/img'));
app.use('*/vendor',express.static('public/sbAdmin2/vendor'));

// Set some defaults (required if your JSON file is empty)
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(unpollute);


// template engine 
app.set('view engine', 'pug')
app.set('views', './views')

app.use(cookieParser('zxcvbnmasdflkhj'))
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))

app.use('/Auth',authRoute)

app.use('/product', productRoute)

app.use('/admin', authMiddleware.requireAuth, adminRoute )

app.use('/api/product',cors(), apiProductRoute)
app.use('/api/admin', authMiddleware.requireAuth, cors(), apiAdminRoute )
app.get('/', (req, res) => {
    res.redirect('/product')
})

app.listen(port, () => {
  // console.log(`Example app listening at http://localhost:${port}`)
})
