const bodyParser = require("body-parser");
const md5 = require("md5");
const e = require("express");
const { jsPDF } = require("jspdf");
const autoTable = require("jspdf-autotable");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const ProductCategory = require("../models/productCategory.model");
const SubProductCategory = require("../models/subProductCategory.model");
const Brand = require("../models/brand.model");
const Bill = require("../models/bill.model");
const Banner = require("../models/banner.model");
const City = require("../models/city.model");
const Store = require("../models/store.model");
const District = require("../models/district.model");
var cloudinary = require("cloudinary").v2;
var nodemailer = require("nodemailer");
const fs = require("fs");
var path = require("path");
const { runInNewContext } = require("vm");

module.exports.generateReport = async (req, res) => {
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  var bill = await Bill.find({ date: { $gte: firstDay }, state: 2 }).exec();
  console.log(typeof bill);
  var bills = [];
  var earning = 0;
  bill.forEach((element) => {
    earning = earning + element.price;
    var oneBill = [];
    oneBill.push(element._id);
    oneBill.push(element.price);
    oneBill.push(element.date.toString().replace("(Giờ Đông Dương)", ""));
    bills.push(oneBill);
  });

  var doc = new jsPDF();
  doc.setFont("TimeNewRoman");
  doc.text("Báo cáo", 10, 10);
  doc.setFontSize(12);
  doc.text(
    "Tong thu tu dau thang den ngay  " +
      date.toString().replace("(Giờ Đông Dương)", "") +
      " la : " +
      earning,
    10,
    20
  );

  doc.text("Danh Sach hoa don : ", 10, 30);
  doc.autoTable({
    head: [["Ma Don Hang", "gia tri don hang", "ngay thang hoa don"]],
    body: bills,
    margin: { top: 40 },
  });

  // tenfile
  var todayTime = new Date();
  var month = todayTime.getMonth() + 1;
  var day = todayTime.getDate();
  var year = todayTime.getFullYear();
  var hour = todayTime.getHours();
  var min = todayTime.getMinutes();
  var name =
    "time" + hour + min + "date" + month + "" + day + "" + year + ".pdf";
  // var path = "public/report/";
  console.log(name, typeof name);
  doc.save(path + name);
  // await cloudinary.uploader.upload(
  //   req.file.path,
  //   {
  //     folder : "doAnWeb/report/"
  //   },
  //   function (error, result) {
  //     req.body.avatar = result.url;
  //     req.body.public_id = result.public_id;
  //     console.log(result.public_id);
  //   }
  // );
  res.redirect("/admin");
};

module.exports.deleteReport = async (req, res) => {
  var path = "public/report/";
  path = path + req.params.name;
  fs.unlinkSync(path);
  res.redirect("/admin");
};

cloudinary.config({
  cloud_name: "dghuqrbcd",
  api_key: "581319397623733",
  api_secret: "5pJyWFZherYKawjotfd8V9V6ksk",
});

module.exports.index = async (req, res) => {
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  var bill = await Bill.find({ date: { $gte: firstDay }, state: 2 }).exec();
  var earning = 0;
  bill.forEach((element) => {
    earning = earning + element.price;
  });

  var Bill2 = await Bill.find({ state: 0 }).count();
  var Bill3 = await Bill.find({ state: 2 }).count();
  var product = await Product.find({}).count();

  const testFolder = "./public/report";
  var files = [];
  fs.readdirSync(testFolder).forEach((file) => {
    files.push(file);
  });

  res.render("admin/dashboard", {
    earning: earning,
    notConfirm: Bill2,
    successBill: Bill3,
    product: product,
    files: files,
  });
};

// ADMIN MANAGER
module.exports.adminManager = (req, res) => {
  User.find((error, data) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/adminManager", {
        users: data,
      });
    }
  });
};

module.exports.addAdmin = (req, res) => {
  res.render("admin/createAdmin");
};

module.exports.postAdminCreate = async (req, res) => {
  var errors = [];
  if (errors.length) {
    res.render("admin/createAdmin", {
      errors: errors,
      values: req.body,
    });
    return;
  }
  console.log(req.body);
  
  await cloudinary.uploader.upload(
    req.file.path,
    {
      folder : "doAnWeb/admin/"
    },
    function (error, result) {
      req.body.avatar = result.url;
      req.body.public_id = result.public_id;
      console.log(result.public_id);
    }
  );
  console.log(req.body.avatar)
  var hashedPassword = md5(req.body.password);
  req.body.password = hashedPassword;
  User.create(req.body);
  res.redirect("adminManager");
};

module.exports.deleteAdmin = async (req, res) => {
  var id = req.params.id;
  console.log(id)
  var userDel = await User.findOne({ _id: id }).exec();
  var path = userDel.avatar;
  console.log('path:', path)
  cloudinary.api.delete_resources(userDel.public_id, (error, result)=>{
    console.log(error, result)
  });
  User.deleteOne({ _id: id }).then(function () {
    res.redirect("/admin/adminManager");
  });
  return
};



module.exports.updateAdmin = async (req, res) => {
  var info = await User.findById(req.params.id).exec();
  res.render("admin/adminUpdate", {
    values: info,
  });
};

module.exports.detailAdmin = async (req, res) => {
  var info = await User.findById(req.params.id).exec();
  // res.send(info)
  res.render("admin/adminDetail", {
    values: info,
  });
};

module.exports.postUpdateAdmin = async (req, res) => {
  console.log(req.body.passwordOld);
  var password = md5(req.body.passwordOld);
  var info = await User.findById(req.params.id).exec();
  console.log(info);
  errors = [];
  if (password != info.password) {
    errors.push("mật khẩu không chính xác");
    res.render("admin/adminUpdate", {
      values: info,
      errors: errors,
    });
    return;
  }
  
  if (req.body.passwordNew != ''){
    req.body.password = md5(req.body.passwordNew);
    console.log('password',req.body.password);
  }

  if (req.file != undefined) {
    var user2update = await User.findById({ _id: req.params.id }).exec();
    // var path = user2update.avatar;
    cloudinary.api.delete_resources(user2update.public_id, (error, result)=>{
      console.log(error, result)
    });
    console.log(path)
    if (req.file.path) {
      await cloudinary.uploader.upload(
        req.file.path,
        {
          folder : "doAnWeb/admin/"
        },
        function (error, result) {
          req.body.avatar = result.url;
          req.body.public_id = result.public_id;
          console.log(result.public_id);
        }
      );
    }
    } 
    
  User.findOneAndUpdate({ _id: info._id }, req.body, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    }
    console.log(doc);
  });
  res.redirect("/admin/adminManager");
};

// ---PRODUCT MANAGER
module.exports.productManager = async (req, res) => {
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var perPage = 20;
  var start = (page - 1) * perPage;
  var arr = [];
  var pageX = page;
  for (var i = pageX - 2; i <= parseInt(page) + 2; i++) if (i > 0) arr.push(i);

  req.url = req.url.replace("?page=" + page, "");
  req.url = req.url + "?page=";

  var products = await Product.find().skip(start).limit(perPage).exec();
  res.render("admin/productManager", {
    products: products,
    pageArray: arr,
    currentURL: "/admin" + req.url,
  });
};

module.exports.productCreate = async (req, res) => {
  var productCategory = await ProductCategory.find().exec();
  var brand = await Brand.find().exec();
  var subProductCategory = await SubProductCategory.find().exec();
  res.render("admin/productCreate", {
    ProductCategories: productCategory,
    brands: brand,
    SubProductCategories: subProductCategory,
  });
  res.send({
    ProductCategories: productCategory,
    brands: brand,
    SubProductCategories: subProductCategory,
  });
};

module.exports.postProductCreate = async (req, res) => {
  // req.body.image = req.file.path.split("\\").slice(1).join("/");
  await cloudinary.uploader.upload(
    req.file.path,
    {
      folder : "doAnWeb/product/"
    },
    function (error, result) {
      req.body.image = result.url;
      req.body.public_id = result.public_id;
      console.log(result.public_id);
    }
  );
  req.body.gift = req.body.gift.split(",");
  console.log(req.body);
  Product.create(req.body);
  res.redirect("productManager");
};

module.exports.deleteProduct = async (req, res) => {
  var id = req.params.id;
  var prodDel = await Product.findOne({ _id: id }).exec();
  var path = prodDel.public_id;
  console.log('path', path)
  try {
    cloudinary.api.delete_resources(path, (error, result)=>{
      console.log(error, result)
      console.log("Successfully deleted the file.");
    });
    Product.deleteOne({ _id: id }).then(function () {
      res.redirect("/admin/productManager");
    });
  } catch (err) {
    throw err;
  }
};

module.exports.changePublicState = async (req, res) => {
  var id = req.params.id;
  var product = await Product.findById(id).exec();
  if (product.public == true)
    await Product.findByIdAndUpdate(id, { public: false });
  else await Product.findByIdAndUpdate(id, { public: true });
  res.redirect("/admin/productManager");
};

module.exports.productUpdate = async (req, res) => {
  var info = await Product.findOne({ _id: req.params.id }).exec();
  var err = [];
  var productCategory = await ProductCategory.find().exec();
  var brand = await Brand.find().exec();
  var subProductCategory = await SubProductCategory.find().exec();
  res.render("admin/productUpdate", {
    info: info,
    errors: err,
    ProductCategories: productCategory,
    brands: brand,
    SubProductCategories: subProductCategory,
  });
};

module.exports.postProductUpdate = async (req, res) => {
  var prodDel = await Product.findOne({ _id: req.params.id }).exec();
  req.body.gift = req.body.gift.split(",");
  var path = prodDel.image;
  console.log(req.file.path);
  if (req.body.image != undefined) {
    console.log("inside");
    try {
      cloudinary.api.delete_resources(path, (error, result)=>{
        console.log(error, result)
        console.log("Successfully deleted the file.");
      });
    } catch (err) {
      throw err;
    }
  }
  // if (req.file) req.body.image = req.file.path.split("\\").slice(1).join("/");
  await cloudinary.uploader.upload(
    req.file.path,
    {
      folder : "doAnWeb/product/"
    },
    function (error, result) {
      req.body.image = result.url;
      req.body.public_id = result.public_id;
      console.log(result.public_id);
    }
  );

  await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
      console.log(doc);
    }
  );
  res.redirect("/admin/productManager");
};

// PRODUCT CATEGORY MANAGER
module.exports.productCategoryManager = async (req, res) => {
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var perPage = 5;
  var start = (page - 1) * perPage;
  var arr = [];
  var pageX = page;
  for (var i = pageX - 2; i <= parseInt(page) + 2; i++) if (i > 0) arr.push(i);
  var productCategory = await ProductCategory.find()
    .skip(start)
    .limit(perPage)
    .exec();
  req.url = req.url.replace("?page=" + page, "");
  res.render("admin/productCategoryManager", {
    productCategories: productCategory,
    pageArray: arr,
    currentURL: "/admin" + req.url,
  });
};

module.exports.createProductCategory = (req, res) => {
  res.render("admin/createProductCategory");
};

module.exports.postProductCategoryCreate = async (req, res) => {
  await cloudinary.uploader.upload(
    req.file.path,
    {
      folder : "doAnWeb/categoryBackground/"
    },
    function (error, result) {
      req.body.image = result.url;
      req.body.public_id = result.public_id;
      console.log(result.public_id);
    }
  );
  ProductCategory.create(req.body);
  res.redirect("productCategoryManager");
};

module.exports.deleteProductCategory = async (req, res) => {
  var id = req.params.id;
  var prodCateDel = await ProductCategory.findOne({ _id: id }).exec();
  cloudinary.api.delete_resources(prodCateDel.public_id, (error, result)=>{
    console.log(error, result)
    console.log("Successfully deleted the file.");
  });
  ProductCategory.deleteOne({ _id: id }).then(function () {
    res.redirect("/admin/productCategoryManager");
  });
};

module.exports.updateProductCategory = async (req, res) => {
  var Category = await ProductCategory.findById(req.params.id).exec();
  var errors = [];
  res.render("admin/updateProductCategory", {
    category: Category,
    errors: errors,
  });
};

module.exports.postUpdateProductCategory = async (req, res) => {
  var category = await ProductCategory.findOne({ _id: req.params.id }).exec();
  var path = category.public_id;
  if (req.body.image != undefined) {
    console.log("inside");
    cloudinary.api.delete_resources(path, (error, result)=>{
      console.log(error, result)
      console.log("Successfully deleted the file.");
    });
  }
  if (req.file){
    await cloudinary.uploader.upload(
      req.file.path,
      {
        folder : "doAnWeb/categoryBackground/"
      },
      function (error, result) {
        req.body.image = result.url;
        req.body.public_id = result.public_id;
        console.log(result.public_id);
      }
    );
  } 
  await ProductCategory.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
      console.log(doc);
    }
  );
  res.redirect("/admin/productCategoryManager");
};

// BRAND MANAGER
module.exports.brandManager = async (req, res) => {
  var brand = await Brand.find().exec();
  res.render("admin/brandManager", {
    brands: brand,
  });
};

module.exports.addBrand = (req, res) => {
  res.render("admin/addBrand");
};

module.exports.postAddBrand = async (req, res) => {
  // req.body.logo = req.file.path.split("\\").slice(1).join("/");
  await cloudinary.uploader.upload(
    req.file.path,
    {
      folder : "doAnWeb/brand/"
    },
    function (error, result) {
      req.body.logo = result.url;
      req.body.public_id_logo = result.public_id_logo;
      console.log(result.public_id);
    }
  );
  Brand.create(req.body);
  res.redirect("brandManager");
};

module.exports.deleteBrand = async (req, res) => {
  var id = req.params.id;
  var brand = await Brand.findOne({ _id: id }).exec();
  cloudinary.api.delete_resources(brand.public_id_logo, (error, result)=>{
    console.log(error, result)
    console.log("Successfully deleted the file.");
  });
  cloudinary.api.delete_resources(brand.public_id_image, (error, result)=>{
    console.log(error, result)
    console.log("Successfully deleted the file.");
  });
  Brand.deleteOne({ _id: id }).then(function () {
    res.redirect("/admin/brandManager");
  });
};

module.exports.updateBrand = async (req, res) => {
  var brand = await Brand.findOne({ _id: req.params.id }).exec();
  console.log("brand", brand);
  var error = [];
  res.render("admin/updateBrand", {
    brand: brand,
    errors: error,
  });
};

module.exports.postUpdateBrand = async (req, res) => {
  var brand = await Brand.findOne({ _id: req.params.id }).exec();
  var path = brand.public_id_image;
  console.log(req.body.image);
  if (req.body.image != undefined) {
    console.log("inside");
  }
  if (req.file){
    try {
      cloudinary.api.delete_resources(path, (error, result)=>{
        console.log(error, result)
        console.log("Successfully deleted the file.");
      });
    } catch (err) {
      throw err;
    }
    await cloudinary.uploader.upload(
      req.file.path,
      {
        folder : "doAnWeb/brand/"
      },
      function (error, result) {
        req.body.image = result.url;
        req.body.public_id_image = result.public_id;
        console.log(result.public_id);
      }
    );
  } 
  await Brand.findOneAndUpdate({ _id: req.params.id }, req.body, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    }
    console.log(doc);
  });
  res.redirect("/admin/brandManager");
};

// SUBCATEGORY
module.exports.subProductCategoryManager = async (req, res) => {
  var subProductCategory = await SubProductCategory.find().exec();
  res.render("admin/subProductCategoryManager", {
    subProductCategories: subProductCategory,
  });
};
module.exports.createSubProductCategory = async (req, res) => {
  var productCategory = await ProductCategory.find().exec();
  res.render("admin/createSubProductCategory", {
    productCategories: productCategory,
  });
};

module.exports.postCreateSubProductCategory = async (req, res) => {
  SubProductCategory.create(req.body);
  res.redirect("subProductCategoryManager");
};
module.exports.deleteSubProductCategory = (req, res) => {
  var id = req.params.id;
  SubProductCategory.deleteOne({ _id: id }).then(function () {
    res.redirect("/admin/subProductCategoryManager");
  });
};

module.exports.updateSubCategory = async (req, res) => {
  var subCategory = await SubProductCategory.findOne({
    _id: req.params.id,
  }).exec();
  var category = await ProductCategory.find({}).exec();
  res.render("admin/updateSubCategory", {
    subCategory: subCategory,
    productCategories: category,
  });
};
module.exports.postUpdateSubCategory = async (req, res) => {
  await SubProductCategory.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
      console.log(doc);
    }
  );
  res.redirect("/admin/subProductCategoryManager");
};

// BILL MANAGER
module.exports.orderManager = async (req, res) => {
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var perPage = 20;
  var start = (page - 1) * perPage;

  var arr = [];
  var pageX = page;
  for (var i = pageX - 2; i <= parseInt(page) + 2; i++) if (i > 0) arr.push(i);

  if (!req.query.stateX) {
    var orders = await Bill.find()
      .skip(start)
      .limit(perPage)
      .sort({ date: "desc" });
  } else {
    var orders = await Bill.find({ state: req.query.stateX })
      .skip(start)
      .limit(perPage)
      .sort({ date: "desc" });
  }

  req.url = req.url.replace("&page=" + page, "");
  if (req.url.includes("?stateX=")) {
    req.url = req.url + "&page=";
  } else req.url = req.url;
  if (Object.entries(req.query).length === 0) {
    var currentURL = "/admin" + req.url + "/?page=";
  } else var currentURL = "/admin" + req.url;
  res.render("admin/orderManager", {
    orders: orders,
    pageArray: arr,
    currentURL: currentURL,
  });
};
module.exports.orderDetail = async (req, res) => {
  var id = req.params.id;
  var order = await Bill.findOne({ _id: id });
  var emailText =
    "id đơn hàng của bạn : " +
    req.params.id +
    " <br>;.Có giá trị là:" +
    order.price;
  res.render("admin/orderDetail", {
    order: order,
  });
};
module.exports.postUpdateOrderDetail = async (req, res) => {
  var id = req.params.id;
  var bill = await Bill.findOne({ _id: id });
  if (bill.state >= 0) {
    if (req.body.state < 0) {
      var items = bill.items[0];
      console.log("items", items, typeof items);
      for (item in items) {
        console.log(items[item].item._id);
        var proId = items[item].item._id;
        console.log(typeof item);
        var itemQuantity = items[item].quantity;
        var product = await Product.findOne({ _id: proId });
        console.log(product);
        console.log("ccccc", itemQuantity);
        var amount = product.amount + itemQuantity;
        await Product.findOneAndUpdate({ _id: proId }, { amount: amount });
      }
    }

    var billNote = bill.note.toObject();
    billNote.push(req.body.noteNext);
    req.body.note = billNote;
    Bill.findByIdAndUpdate({ _id: id }, req.body, (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    });
  }
  res.redirect("/admin/order/" + id);
};

module.exports.mailSend = (req, res) => {
  var mail = req.params.mail;
  var mailOptions = {
    from: process.env.GMAIL,
    to: mail,
    subject: "InsMaster",
    text: req.body.mail,
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.redirect("/admin/");
};

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PASSWORD,
  },
});

module.exports.bannerImageManager = async (req, res) => {
  var banner = await Banner.find({}).exec();
  res.render("admin/bannerManager", {
    banners: banner,
  });
};
module.exports.bannerUploader = (req, res) => {
  res.render("admin/bannerUploader");
};

module.exports.postBannerUploader = async (req, res) => {
  await cloudinary.uploader.upload(
    req.file.path,
    {
      folder : "doAnWeb/banner/"
    },
    function (error, result) {
      req.body.image = result.url;
      req.body.public_id = result.public_id;
      console.log(result.public_id);
    }
  );

  // req.body.image = req.file.path.split("\\").slice(1).join("/");
  await Banner.create(req.body);
  res.redirect("/admin/bannerManager");
};
module.exports.deleteBanner = async (req, res) => {
  var id = req.params.id;
  var banner = await Banner.findOne({ _id: id }).exec();
  var path = banner.public_id;
  try {
    cloudinary.api.delete_resources(path, (error, result)=>{
      console.log(error, result)
    });
    Banner.deleteOne({ _id: id }).then(function () {
      res.redirect("/admin/bannerManager");
    });
  } catch (err) {
    throw err;
  }
};

module.exports.store = async (req, res) => {
  var city = await City.find().exec();
  var district = await District.find().exec();
  var store = await Store.find().exec();
  console.log(city);
  res.render("admin/storeManager", {
    cities: city,
    districts: district,
    stores: store,
  });
};
module.exports.addCity = async (req, res) => {
  console.log(req.body);
  City.create(req.body);
  res.redirect("/admin/store");
};

module.exports.removeCity = async (req, res) => {
  console.log(req.body.id);
  try {
    City.deleteOne({ _id: req.body.id }).then(function () {
      res.redirect("/admin/store");
      console.log("xóa thành phố thành công");
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.addDistrict = async (req, res) => {
  console.log(req.body);
  await District.create(req.body);
  res.redirect("/admin/store");
};

module.exports.removeDistrict = async (req, res) => {
  console.log(req.body.id);
  try {
    District.deleteOne({ _id: req.body.id }).then(function () {
      res.redirect("/admin/store");
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.addStore = async (req, res) => {
  await Store.create(req.body);
  res.redirect("/admin/store");
};

module.exports.removeStore = async (req, res) => {
  try {
    console.log("req.body.id", req.body.id);
    Store.deleteOne({ _id: req.body.id }).then(function () {
      res.redirect("/admin/store");
    });
  } catch (error) {
    console.log(error);
  }
};
