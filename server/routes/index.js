var express = require('express');
var router = express.Router();
require("express-group-routes");
const user_ = require('../app/userService/controller/userController')
const handleResponse = require('../middleware/handleResponse')
const _tokenManager = require('../middleware/auth')
const faq_ = require('../app/faq/controller/faq.controller');
const _contact = require('../app/contactUs/controller/contactUs.controller');
const cms = require('../app/cms/controller/page.controller');
const notification = require('../app/notification/controller/notification.controller');
const { upload } = require('../middleware/upload');
const { default: mongoose } = require('mongoose');
const notification_ = new notification()
const cms_ = new cms()
const property = require("../app/property/controller/property.controller");
const _property = new property()
const category = require("../app/category/controller/category.controller");
const _category = new category()
const PRODUCT = require("../app/product/controller/product.controller");


/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ message: `Welcome to ${process.env.PROJECT_NAME} Server` });
});

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
router.get('/getImg/:fileId', async function (req, res, next) {
  try {
    const { fileId } = req.params;
    // Check if file exists
    const file = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    if (file.length === 0) {
      return res.status(404).json({ error: { text: "File not found" } });
    }
    // set the headers
    res.set("Content-Type", file[0].contentType);
    res.set("Content-Disposition", `inline; filename=${file[0].filename}`);
    // res.set("Access-Control-Allow-Origin", "*");
    // create a stream to read from the bucket
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    // pipe the stream to the response
    downloadStream.pipe(res);
  } catch (error) {
    res.status(400).json({ error: { text: `Unable to download file`, error } });
  }
});
/**
 * common routes for all roles
 */

/**AUTHENTICATION */

router.group("/auth", (auth) => {
  auth.post("/signin", user_.signin, handleResponse.RESPONSE);
  auth.post("/signup", user_.signup, handleResponse.RESPONSE);
  auth.put("/verifyOtp", user_.verifyOtp, handleResponse.RESPONSE);
  auth.put("/resendOtp", user_.resendOtp, handleResponse.RESPONSE);
  auth.post("/forgotPassword", user_.forgotPassword, handleResponse.RESPONSE);
  auth.get("/profile", _tokenManager.authenticate, user_.profile, handleResponse.RESPONSE);
  auth.put("/editProfile", _tokenManager.authenticate, upload().single("profileImg"), user_.editOwnProfile, handleResponse.RESPONSE);
  auth.put("/changePassword", _tokenManager.authenticate, user_.changePassword, handleResponse.RESPONSE);
  auth.post('/logout', _tokenManager.authenticate, user_.logout, handleResponse.RESPONSE);
  auth.put('/deleteAccount', _tokenManager.authenticate, user_.deleteUser, handleResponse.RESPONSE);
  auth.put('/notifyMe', _tokenManager.authenticate, user_.notifyMe, handleResponse.RESPONSE);
});

/**CONTENT MANAGEMENT */
router.group("/pages", (auth) => {
  auth.get("/cms/:typeId", cms_.getByType, handleResponse.RESPONSE);
  auth.get("/faq", faq_.List, handleResponse.RESPONSE);
});


/**CONTACT-US */
router.group("/contactUs", (contact) => {
  contact.post("/add", _contact.add, handleResponse.RESPONSE);
});


/**CONTACT-US */
router.group("/contactUs", (contact) => {
  contact.post("/add", _contact.add, handleResponse.RESPONSE);
});

/**
 * Geo search for home autocomplete — derived from live properties
 * (avoids empty GEOSEARCH collection / missing CSV import).
 */
router.get("/geosearch", async function (req, res) {
  try {
    const q = String(req.query.query || "").trim();
    const propertyType = req.query.propertyType;
    if (q.length < 2) {
      return res.json({ districts: [], municipalities: [], addresses: [] });
    }
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const match = {
      state: 1,
      $or: [
        { district: re },
        { municipality: re },
        { parish: re },
        { place: re },
        { street: re },
      ],
    };
    if (propertyType && propertyType !== "undefined" && propertyType !== "") {
      match.type_of_real_estate = propertyType;
    }
    const { PROPERTY } = require("../app/property/model/property.model");
    const rows = await PROPERTY.find(match)
      .select("district municipality parish place")
      .limit(40)
      .lean();

    const districtMap = new Map();
    const municipalityMap = new Map();
    const addresses = [];

    for (const row of rows) {
      if (row.district) {
        const key = row.district;
        districtMap.set(key, (districtMap.get(key) || 0) + 1);
      }
      if (row.municipality && row.district) {
        const key = `${row.municipality}|${row.district}`;
        municipalityMap.set(key, (municipalityMap.get(key) || 0) + 1);
      }
      if (row.parish || row.municipality || row.district) {
        addresses.push({
          parish: row.parish || row.place || "",
          municipality: row.municipality || "",
          district: row.district || "",
          propertyCount: 1,
        });
      }
    }

    const districts = [...districtMap.entries()].map(([district, propertyCount]) => ({
      district,
      propertyCount,
    }));
    const municipalities = [...municipalityMap.entries()].map(([key, propertyCount]) => {
      const [municipality, district] = key.split("|");
      return { municipality, district, propertyCount };
    });

    // Dedupe addresses by parish+municipality+district
    const seen = new Set();
    const uniqueAddresses = [];
    for (const a of addresses) {
      const k = `${a.parish}|${a.municipality}|${a.district}`;
      if (seen.has(k)) continue;
      seen.add(k);
      uniqueAddresses.push(a);
    }

    return res.json({
      districts: districts.slice(0, 8),
      municipalities: municipalities.slice(0, 8),
      addresses: uniqueAddresses.slice(0, 8),
    });
  } catch (error) {
    console.error("geosearch error", error);
    return res.status(500).json({
      districts: [],
      municipalities: [],
      addresses: [],
      error: error.message,
    });
  }
});

/**
 * Property Api's
 */
router.group("/property", (property) => {
  property.get("/propertyList",_property.list,handleResponse.RESPONSE); // Without authentication for user
  property.get("/details/:id",_property.detail,handleResponse.RESPONSE); // Without authentication for user
  property.post("/sendPropertyQuery",_property.sendQuery,handleResponse.RESPONSE);
 });


 /**
 * Category Api's
 */
router.group("/category", (category) => {
  category.get("/activeCategory",_category.activeCategory,handleResponse.RESPONSE);
});

router.group("/product", (product) => {
  product.get("/list", PRODUCT.productList,handleResponse.RESPONSE);
});




module.exports = router;
