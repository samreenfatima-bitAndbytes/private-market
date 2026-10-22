/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

var Parse = require("csv-parse");
var fs = require("fs");
const mongoose = require("mongoose");
const { PROPERTY } = require("../model/property.model");
const { setResponseObject } = require("../../../middleware/commonFunction");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csv-parser");
const archiver = require("archiver");
const csvtojson = require("csvtojson");
const { parse } = require("json2csv");
const { GridFSBucket } = require("mongodb");
const { MongoClient } = require("mongodb");

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
let { CONST } = require("../../../helpers/constant");
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

let _csv = {};

/**
 * Update Api
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
_csv.importCsv = async (req, res, next) => {
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
              obj.state = jsonObj[i]["state"]
                ? jsonObj[i]["state"].toLowerCase().trim() === "deleted"
                  ? CONST.DELETED
                  : jsonObj[i]["state"].toLowerCase().trim() === "inactive"
                    ? CONST.INACTIVE
                    : jsonObj[i]["state"].toLowerCase().trim() === "ban" || jsonObj[i]["state"].toLowerCase().trim() === "blocked"
                      ? CONST.BAN
                      : CONST.ACTIVE
                : CONST.ACTIVE;
              obj.place = jsonObj[i]["place"] || "";
              obj.postalCode = jsonObj[i]["postalCode"] || "";
              obj.description = jsonObj[i]["description"] || "";
              obj.price = jsonObj[i]["price"] || "";
              obj.building_fee = jsonObj[i]["building_fee"] || "";
              obj.gross_area = jsonObj[i]["gross_area"] || "";
              obj.net_area = jsonObj[i]["net_area"] || "";
              obj.baths = jsonObj[i]["baths"] || "";
              obj.energy_class = jsonObj[i]["energy_class"] || "";
              obj.district = jsonObj[i]["district"] || "";
              obj.parish = jsonObj[i]["parish"] || "";
              obj.rooms = jsonObj[i]["rooms"] || "";
              obj.floor = jsonObj[i]["floor"] || "";
              obj.link = jsonObj[i]["link"] || "";
              obj.reference = jsonObj[i]["reference"] || "";
              obj.street = jsonObj[i]["street"] || "";
              obj.building_no = jsonObj[i]["building_no"] || "";
              obj.municipality = jsonObj[i]["municipality"] || "";
              obj.elevator = jsonObj[i]["elevator"] || "";
              obj.type_of_real_estate = jsonObj[i]["type_of_real_estate"]
                ? jsonObj[i]["type_of_real_estate"] : "";
              obj.position = jsonObj[i]["position"] || "";
              // obj.categoryId = jsonObj[i]["categoryId"] || "House";
              obj.condition = jsonObj[i]["condition"] || "";
              obj.year_of_construction =
                jsonObj[i]["year_of_construction"] || "";
              obj.other_features_real_estate = jsonObj[i][
                "other_features_real_estate"
              ]
                ? jsonObj[i]["other_features_real_estate"]
                  ?.split(",")

                : [] || "";
              obj.other_features_building = jsonObj[i][
                "other_features_building"
              ]
                ? jsonObj[i]["other_features_building"]
                  ?.split(",")

                : [] || "";
              obj.image = jsonObj[i]["image"]
                ? jsonObj[i]["image"]?.split(",")
                : [] || "";

              obj.createdBy = req.userId;
              obj.priceEstimation = parseFloat(jsonObj[i]["price_estimation"]) || ""
              obj.expectedRentalYield = parseFloat(jsonObj[i]["expected_rental_yield"]) || ""
              obj.daysToSale = parseInt(jsonObj[i]["days_to_sale"]) || ""
              obj.priceDelta = jsonObj[i]["price_delta"] && parseFloat(jsonObj[i]["price_delta"].replace("%", "")) || ""
              property.push(obj);
            }
            for (let i in property) {
              await PROPERTY.create(property[i]);
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

/*Function to generate CSV file for each ID*/
async function generateCSV(id) {
  const propertyData = await PROPERTY.find({ _id: id });

  const headerArray = [
    { id: "name", title: "name" },
    { id: "description", title: "description" },
    { id: "place", title: "place" },
    { id: "postalCode", title: "postalCode" },
    { id: "price", title: "price" },
    { id: "building_fee", title: "building_fee" },
    { id: "year_of_construction", title: "year_of_construction" },
    { id: "gross_area", title: "gross_area" },
    { id: "net_area", title: "net_area" },
    { id: "baths", title: "baths" },
    { id: "floor", title: "baths" },
    { id: "energy_class", title: "energy_class" },
    { id: "district", title: "district" },
    { id: "rooms", title: "rooms" },
    { id: "link", title: "link" },
    { id: "image", title: "image" },
    { id: "reference", title: "reference" },
    { id: "street", title: "street" },
    { id: "building_no", title: "building_no" },
    { id: "municipality", title: "municipality" },
    { id: "elevator", title: "elevator" },
    { id: "type_of_real_estate", title: "type_of_real_estate" },
    { id: "position", title: "position" },
    { id: "other_features_real_estate", title: "other_features_real_estate" },
    { id: "other_features_building", title: "other_features_building" },
    { id: "categoryId", title: "categoryId" },
    { id: "parish", title: "parish" },
    { id: "state", title: "state" },
    { id: "priceEstimation", title: "price_estimation" },
    { id: "expectedRentalYield", title: "expected_rental_yield" },
    { id: "daysToSale", title: "days_to_sale" },
    { id: "priceDelta", title: "price_delta" },
  ];

  const csvFilePath = `uploads/property/${id}-property.csv`;

  const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: headerArray,
  });

  await csvWriter.writeRecords(propertyData);

  return csvFilePath;
}

function getFilesBucket(db) {
  if (bucket) return bucket;
  return new GridFSBucket(db, { bucketName: "filesBucket" });
}

function writeGridFsFileToDisk(gfsBucket, fileId, destPath) {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(destPath);
    gfsBucket
      .openDownloadStream(fileId)
      .on("error", reject)
      .pipe(ws)
      .on("error", reject)
      .on("finish", resolve);
  });
}

/**
 * Export purchased product data files for download.
 * Single file → direct .xlsx/.csv under uploads/product (opens in Excel).
 * Multiple → zip of those sheets.
 * Client expects JSON { data: "uploads/product/..." } then GETs /api/<path>.
 */
async function downloadCSVs(ids, res, db) {
  try {
    const gfsBucket = getFilesBucket(db);
    const outDir = path.join("uploads", "product");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const prepared = [];
    for (const rawId of ids) {
      const id = String(rawId || "").trim();
      if (!id || !mongoose.Types.ObjectId.isValid(id)) continue;
      const oid = new mongoose.Types.ObjectId(id);
      const meta = await gfsBucket.find({ _id: oid }).next();
      if (!meta) {
        console.error(`File with ID ${id} not found.`);
        continue;
      }
      const original =
        meta.filename ||
        `${id}-product.xlsx`;
      const safeName = path.basename(original).replace(/[^\w.\-]+/g, "_");
      const stamp = `${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
      const localName = `${stamp}-${safeName}`;
      const localPath = path.join(outDir, localName);
      await writeGridFsFileToDisk(gfsBucket, oid, localPath);
      prepared.push({ localPath, archiveName: safeName });
    }

    if (!prepared.length) {
      return res.status(404).json({
        success: false,
        message: "No product files found for download",
      });
    }

    // One spreadsheet → download Excel/CSV directly (no zip)
    if (prepared.length === 1) {
      const rel = prepared[0].localPath.replace(/\\/g, "/");
      return res.status(200).json({
        success: true,
        message: "File downloaded successfully",
        data: rel,
      });
    }

    const zipFilePath = path.join(
      outDir,
      `market-data-${Date.now()}.zip`
    );
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver("zip", { zlib: { level: 9 } });
      output.on("close", resolve);
      archive.on("error", reject);
      archive.pipe(output);
      for (const file of prepared) {
        archive.file(file.localPath, { name: file.archiveName });
      }
      archive.finalize();
    });

    return res.status(200).json({
      success: true,
      message: "File downloaded successfully",
      data: zipFilePath.replace(/\\/g, "/"),
    });
  } catch (error) {
    console.error("Error occurred during product file export:", error);
    throw error;
  }
}

/**
 * Export property in csv file
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
_csv.exportPropertyList = async function (req, res, next) {
  try {
    const data = req?.params?.id;
    const ids = data?.split(",");

    const filePath = path.join("uploads", "product");

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No product IDs provided" });
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db(); // Get the database object

    // Call downloadCSVs with the database object
    await downloadCSVs(ids, res, db);

    // Close the MongoDB connection
    await client.close();
    // Do not clear cart here — checkout / createOrder owns the cart lifecycle
    return;
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_csv.downloadProductFiles = downloadCSVs;

module.exports._csv = _csv;
module.exports.downloadProductFiles = downloadCSVs;
