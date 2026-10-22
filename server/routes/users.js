var express = require("express");
var router = express.Router();
require("express-group-routes");
const mongoose = require("mongoose");
const { upload } = require("../middleware/upload");

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

const handleResponse = require("../middleware/handleResponse");
const _tokenManager = require("../middleware/auth");
const payment = require("../app/payment/controller/payment.controller");
const _payment = new payment();
const _cart = require("../app/cart/controller/cart.controller");
const property = require("../app/property/controller/property.controller");
const _property = new property();
const category = require("../app/category/controller/category.controller");
const _category = new category();
const { _csv } = require("../app/property/controller/csv.controller");
const favourite = require("../app/favourite/controller/favourite.controller");
const _favourite = new favourite();
const order = require("../app/order/controller/order.controller");
const _order = new order();
const search = require("../app/search/controller/search.controller");
const _search = new search();
const notification = require("../app/notification/controller/notification.controller");
const notification_ = new notification();
const PRODUCT = require("../app/product/controller/product.controller");
const  {places}  = require("../app/uploadData/controllers/place.controller");
const { municiplities } = require("../app/uploadData/controllers/municiplity.controller");
const { districts } = require("../app/uploadData/controllers/district.controller");

/**
 * Payment Api's
 */
router.group("/payment", (payment) => {
  payment.post("/addCard", _payment.addCard);
  payment.get("/cardList", _payment.cardList);
  payment.get("/cardDetails/:id", _payment.cardDetails);
  payment.put("/cardUpdate/:id", _payment.cardUpdate);
  payment.delete("/deleteCard/:id", _payment.cardDelete);
});

/**
 * Category Api's
 */
router.group("/category", (category) => {
  category.get("/activeCategory", _category.list);
});

/**
 * Property Api's
 */
router.group("/property", (property) => {
  property.post("/addProperty", upload().array("propertyImgId"), _property.add);
  property.get("/propertyListAuth", _property.list); // With authentication for user
  property.get("/propertyDetails/:id", _property.detail);
  property.put("/updateProperty",upload().array("propertyImgId"),_property.update);
  property.put("/updateState/:id", _property.updateState);
  property.delete("/deleteProperty/:id", _property.deleteProperty);
  property.get("/myProperty", _property.myProperty);
  // property.post("/sendQuery", _property.sendQuery);
  property.get("/downloadFull", _property.downloadFull);
  property.post("/sendPropertyQuery", _property.sendQuery);
});

/**
 * Cart Api's
 */
router.group("/cart", (cart) => {
  cart.post("/addCart", _cart.addCart);
  cart.get("/mycarts", _cart.myCart);
  cart.delete("/removeCart/:id", _cart.removeCart);
  cart.delete("/clearCart", _cart.clearCart);
});

/**
 * CSV Api's
 */
router.group("/csv", (csv) => {
  csv.get("/exportPropertyCsv/:id", _csv.exportPropertyList);
  csv.post("/imoprtPropertyCsv", _csv.importCsv);
});

/**
 * Favourite Api's
 */
router.group("/favourite", (favourite) => {
  favourite.post("/addFavourite", _favourite.addFavourite);
  favourite.get("/favouriteList", _favourite.myFavouriteList);
});

/**
 * Order Api's
 */
router.group("/order", (order) => {
  order.post("/createOrder", _order.createOrder);
  order.get("/myOrderList", _order.orderList);
  order.get("/downloadFiles/:id", _order.downloadOrderFiles);
  order.delete("/deleteOrder/:id", _order.deleteOrder);
});

/**
 * Search Api's
 */
router.group("/search", (search) => {
  search.post("/saveSearch", _search.saveSearch);
  search.get("/mySearchList", _search.mySearchList);
  search.put("/updateSearch", _search.updateSearch);
  search.delete("/deleteSearch/:id", _search.deleteSearch);
  search.put("/enableDisable", _search.enableSearch);
});

/* Notification Management */
router.group("/notification", (notification) => {
  notification.get("/myNotification", notification_.myNotification);
  notification.delete("/deleteNotification", notification_.deleteNotification);
});

router.group("/product", (product) => {
  product.get("/details/:id", PRODUCT.viewProduct);
  product.get("/list", PRODUCT.productList);
});

router.group("/place", (place) => {
  place.get("/list", places.placeList);
});

router.group("/municiplity", (municiplity) => {
  municiplity.get("/list", municiplities.municiplityList);
});

router.group("/district", (district) => {
  district.get("/list", districts.districtList);
});

module.exports = router;
