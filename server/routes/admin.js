var express = require("express");
var router = express.Router();
require("express-group-routes");
const mongoose = require("mongoose");

/**connecting to mongodb GridFSBucket */
let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();
/**@Get saved image from bucketFile */
router.get("/getImg/:fileId", async function (req, res, next) {
  try {
    const { fileId } = req.params;
    // Check if file exists
    const file = await bucket
      .find({ _id: new mongoose.Types.ObjectId(fileId) })
      .toArray();
    if (file.length === 0) {
      return res.status(404).json({ error: { text: "File not found" } });
    }
    // set the headers
    res.set("Content-Type", file[0].contentType);
    res.set("Content-Disposition", `inline; filename=${file[0].filename}`);
    // res.set("Access-Control-Allow-Origin", "*");
    // create a stream to read from the bucket
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );
    // pipe the stream to the response
    downloadStream.pipe(res);
  } catch (error) {
    res.status(400).json({ error: { text: `Unable to download file`, error } });
  }
});

const cms = require("../app/cms/controller/page.controller");
const _cms = new cms();
const _faq = require("../app/faq/controller/faq.controller");
const {
  errorLogs_,
  _emailLogs,
  _loginActivity,
} = require("../app/logs/controller/logsController");
const _contact = require("../app/contactUs/controller/contactUs.controller");
const _user = require("../app/userService/controller/userController");
const { upload } = require("../middleware/upload");
const { _csv } = require("../app/property/controller/csv.controller");
const category = require("../app/category/controller/category.controller");
const _category = new category();
const order = require("../app/order/controller/order.controller");
const _order = new order();
const payment = require("../app/payment/controller/payment.controller");
const payment_ = require("../app/payment/controller/payment.controller");
const _payment = new payment();
const PRODUCT = require("../app/product/controller/product.controller");
const property = require("../app/property/controller/property.controller");
const _property = new property()
const  {places}  = require("../app/uploadData/controllers/place.controller");
const { municiplities } = require("../app/uploadData/controllers/municiplity.controller");
const { districts } = require("../app/uploadData/controllers/district.controller");


/* User Management */
router.group("/user", (admin) => {
  admin.get("/list", _user.getUsers);
  admin.post("/add", upload().single("profileImg"), _user.addUser);
  admin.put("/edit/:id", upload().single("profileImg"), _user.editUserProfile);
  admin.put("/changeState/:id", _user.updateState);
  admin.get("/view/:id", _user.getUserById);
});

/* Content Management pages */
router.group("/cms", (cms) => {
  cms.get("/", _cms.list);
  cms.post("/add", upload().single("image"), _cms.add);
  cms.get("/detail/:id", _cms.detail);
  cms.put("/update/:id", upload().single("image"), _cms.update);
  cms.put("/updateState/:id", _cms.updateState);
  cms.get("/getByType", _cms.getByType);
  cms.delete("/delete/:id", _cms.delete);
});

/* Faq Management  */
router.group("/faq", (faq) => {
  faq.get("/list", _faq.faqList);
  faq.post("/add", _faq.addFaq);
  faq.get("/detail/:id", _faq.faqDetails);
  faq.delete("/delete/:id", _faq.delete);
  faq.put("/edit/:id", _faq.editFaq);
  faq.put("/updateState/:id", _faq.updateFaqState);
});

/* Logs Management  */
router.group("/logs", (logs) => {
  logs.get("/errorList", errorLogs_.getLogs);
  logs.get("/error/:id", errorLogs_.logDetails);
  logs.delete("/delete/:id", errorLogs_.deleteLog);
  logs.delete("/deleteAll", errorLogs_.deleteAllErrorLog);
});

/* Email Logs Management  */
router.group("/emailLogs", (email) => {
  email.get("/list", _emailLogs.emailList);
  email.get("/view/:id", _emailLogs.emailDetails);
  email.delete("/delete/:id", _emailLogs.deleteEmail);
  email.delete("/deleteAll", _emailLogs.deleteAllEmail);
});

/*Login Logs */
router.group("/loginActivity", (loginActivity) => {
  loginActivity.get("/list", _loginActivity.loginHistoryList);
  loginActivity.get("/details/:id", _loginActivity.viewLoginDetails);
  loginActivity.delete("/deleteAll", _loginActivity.deleteAllLoginHistory);
});

/* contact-us Management  */
router.group("/contactUs", (contact) => {
  contact.get("/list", _contact.list);
  contact.get("/view/:id", _contact.view);
  contact.put("/delete", _contact.delete);
});

/*Email Logs */
router.group("/emaillog", (emaillog) => {
  emaillog.get("/list", _emailLogs.emailList);
  emaillog.get("/view/:id", _emailLogs.emailDetails);
  emaillog.delete("/delete/:id", _emailLogs.deleteEmail);
  emaillog.delete("/deleteAll", _emailLogs.deleteAllEmail);
});

/**csv upload and property add api's */
router.group("/property", (property) => {
  property.get("/propertyList",_property.list); 
   property.delete("/delete/:id", _property.deleteProperty);

});

router.group("/category", (category) => {
  category.post("/addCategory", upload().single("image"), _category.add);
  category.get("/categoryList", _category.list);
  category.get("/categoryDetails/:id", _category.detail);
  category.put("/editCategory/:id", upload().single("image"), _category.update);
  category.put("/updateCategoryState/:id", _category.updateState);
  category.delete("/deleteCategory/:id", _category.softDelete);
});

/**DAHBOARD Management*/
router.group("/dashboard", (dashboard) => {
  dashboard.get("/count", _user.dashboardCount);
  dashboard.get("/graphData/:year", _user.graphData);
});

/**
 * Order Api's
 */
router.group("/order", (order) => {
  order.get("/orderList", _order.adminOrderList);
  order.get("/orderView/:id", _order.orderView);
});

/**
 * Payment Api's
 */
router.group("/payment", (payment) => {
  payment.get("/paymentList", _payment.transactionList);
  payment.get("/transactionView/:id", _payment.transactionView);
});

/**
 * CSV Api's
 */
router.group("/csv", (csv) => {
  csv.post("/imoprtPropertyCsv", _csv.importCsv);
});

router.group("/product", (product) => {
  product.post("/add", upload().fields([{name: "productImg"}, {name: "productFile"}]),PRODUCT.addProduct);
  product.put("/edit/:id", upload().fields([{name: "productImg"}, {name: "productFile"}]),PRODUCT.editProduct);
  product.get("/details/:id", PRODUCT.viewProduct);
  product.delete("/delete/:id", PRODUCT.deleteProduct);
  product.get("/list", PRODUCT.allProdcutList);
  product.put("/updateState/:id", PRODUCT.updateState);
});

router.group("/place", (place) => {
  place.post("/addPlace", places.importCsv);
  place.get("/list", places.placeList);
});

router.group("/municiplity", (municiplity) => {
  municiplity.post("/addMuniciplity", municiplities.importCsv);
});

router.group("/district", (district) => {
});


module.exports = router;
