//upload.js — GridFS storage + normalize ObjectIds for Mongoose 8 (bson 6)
const multer = require("multer");
const mongoose = require("mongoose");
let dotenv = require("dotenv");
const { GridFsStorage } = require("multer-gridfs-storage");
dotenv.config();

/**
 * multer-gridfs-storage uses mongodb@5 (bson 5). Mongoose 8 expects bson 6.
 * Convert GridFS ids to mongoose ObjectIds before controllers save them.
 */
function normalizeGridFsIds(req, _res, next) {
  const fix = (file) => {
    if (!file) return;
    if (file.id != null) {
      file.id = new mongoose.Types.ObjectId(String(file.id));
    }
    if (file._id != null) {
      file._id = new mongoose.Types.ObjectId(String(file._id));
    }
  };

  if (req.file) fix(req.file);
  if (req.files) {
    if (Array.isArray(req.files)) {
      req.files.forEach(fix);
    } else {
      Object.values(req.files).forEach((entry) => {
        (Array.isArray(entry) ? entry : [entry]).forEach(fix);
      });
    }
  }
  next();
}

function upload() {
  const mongodbUrl = process.env.DB_URL;
  const storage = new GridFsStorage({
    url: mongodbUrl,
    file: (req, file) => {
      return new Promise((resolve, _reject) => {
        const fileInfo = {
          filename: file.originalname,
          bucketName: "filesBucket",
        };
        resolve(fileInfo);
      });
    },
  });

  const uploader = multer({ storage });

  return {
    single: (field) => [uploader.single(field), normalizeGridFsIds],
    array: (field, maxCount) => [
      uploader.array(field, maxCount),
      normalizeGridFsIds,
    ],
    fields: (fields) => [uploader.fields(fields), normalizeGridFsIds],
  };
}

module.exports = { upload, normalizeGridFsIds };
