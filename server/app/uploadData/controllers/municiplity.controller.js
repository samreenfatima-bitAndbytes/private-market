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
const { MUNICIPLITY } = require("../models.js/municiplity");
const { CONST } = require("../../../helpers/constant");
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

let municiplities = {};

municiplities.importCsv = async (req, res, next) => {
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
            for (var i = 0; i < jsonObj.length; i++) {
              var obj = {};
              obj.title = jsonObj[i]["TITLE"] || "";
              obj.createdBy = req.userId;
              property.push(obj);
            }
            for (let i in property) {
              let ifExist = await MUNICIPLITY.findOne({
                title: property[i]["title"],
              });
              if (!ifExist) {
                await MUNICIPLITY.create(property[i]);
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

municiplities.municiplityList = async (req, res, next) => {
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
    if (req.query.districtId) {
      filter.push({
        $match: {
          districtId: new mongoose.Types.ObjectId(req.query.districtId),
        },
      });
    }


    let list = await MUNICIPLITY.aggregate([
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

module.exports.municiplities = municiplities;
