/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

var fs = require("fs");
const mongoose = require("mongoose");
const { setResponseObject } = require("../../../middleware/commonFunction");
const csvtojson = require("csvtojson");

// /**connecting to mongodb GridFSBucket */
let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();

const multer = require("multer");
const { CART } = require("../../cart/model/cart.model");
const { PLACE } = require("../models.js/place");
const { CONST } = require("../../../helpers/constant");
const { FOUND_SUCCESS } = require("../../../middleware/responseMessages");
const { DISTRICT } = require("../models.js/district.model");
const { MUNICIPLITY } = require("../models.js/municiplity");
const dir = "./uploads/import";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).fields([{ name: "csvFile" }]);

let places = {};

places.importCsv = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err.message, "");
        next();
      } else {
        var property = [];
        csvtojson()
          .fromFile(req.files.csvFile[0].path)
          .then(async (jsonObj) => {
            for (const record of jsonObj) {
              // Find or create district document
              let districtId = null;
              let districtData = {
                title: record.District,
                createdBy: req.userId,
              };

              let districtDocument = await DISTRICT.findOne({
                title: record.District,
              });
              if (!districtDocument) {
                districtDocument = await DISTRICT.create(districtData);
                districtId = districtDocument._id;
              } else {
                districtId = districtDocument._id;
              }
              // Find or create municipality document
              let municipalityId = null;
              let municipalityDocument = await MUNICIPLITY.findOne({
                title: record.Municipality,
              });
              let municipalityData = {
                title: record.Municipality,
                createdBy: req.userId,
                districtId: districtId,
              };
              if (!municipalityDocument) {
                municipalityDocument = await MUNICIPLITY.create(
                  municipalityData
                );
                municipalityId = municipalityDocument._id;
              } else {
                municipalityId = municipalityDocument._id;
              }

              // Find or create place document
              let placeDocument = await PLACE.findOne({ title: record.Place });
              let placeData = {
                title: record.Place,
                createdBy: req.userId,
                municipalityId: municipalityId,
              };
              if (!placeDocument) {
                placeDocument = await PLACE.create(placeData);
              }
            }

            // Delete the CSV file after data creation
            fs.unlink(req.files.csvFile[0].path, (err) => {
              if (err) {
                console.error("Error deleting CSV file:", err);
              } else {
                console.log("CSV file deleted successfully");
              }
            });
            await setResponseObject(
              req,
              true,
              "Csv file imported successfully"
            );
            next();
          });
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

places.placeList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
    let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        title: {
          $regex: req.query.search ? req.query.search : "",
          $options: "i",
        },
      };
    }

    let filter = [];
    if (req.query.municipalityId) {
      filter.push({
        $match: {
          municipalityId: new mongoose.Types.ObjectId(req.query.municipalityId),
        },
      });
    }

    let list = await PLACE.aggregate([
      {
        $match: { stateId: { $ne: CONST.DELETED } },
      },
      {
        $match: searchFilter,
      },
      ...filter,
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          data: [
            { $skip: pageLimit * (pageNo - CONST.PAGE_NO) },
            { $limit: pageLimit },
          ],
          count: [{ $count: "count" }],
        },
      },
    ]);
    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports.places = places;
