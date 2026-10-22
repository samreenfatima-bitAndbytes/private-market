/*
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const PRODUCT = require("../model/product.model");
const { USER } = require("../../userService/model/userModel");
const { CONST } = require("../../../helpers/constant");
const { setResponseObject } = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");

const product = {};

let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();

/**
 * ADD PRODUCT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.addProduct = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.userId;
    const isExist = await PRODUCT.findOne({ productName: data.productName });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "Property already in existence with this name."
      );
      next();
    } else {
      if (req.files?.productFile?.length) {
        data.productFile = req.files.productFile[0].id;
      }

      if (req.files?.productImg?.length) {
        data.productImg = [];
        req.files.productImg?.forEach((file) => {
          data.productImg.push(file.id);
        });
      }

      const saveProduct = await PRODUCT.create(data);

      if (saveProduct) {
        await setResponseObject(
          req,
          true,
          "Product added successfully",
          saveProduct
        );
        next();
      } else {
        await setResponseObject(req, false, "Product not added");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * EDIT PRODUCT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.editProduct = async (req, res, next) => {
  try {
    const data = req.body;

    let findProduct = await PRODUCT.findById({
      _id: new mongoose.Types.ObjectId(req.params.id),
    });

    if (req.files?.productFile?.length) {
      data.productFile = req.files.productFile[0].id;
      if (req.files && findProduct.productFile) {
        //deleting previous image from bucket and chunks
        await bucket.delete(findProduct.productFile);
      }
    }

    if (req.files?.productImg?.length) {
      data.productImg = [];
      req.files.productImg?.forEach((file) => {
        data.productImg.push(file.id);
      });
      //has to delete previous image also
      if (req.files && findProduct?.productImg.length > 0) {
        // Check if the file exists
        const file = await bucket
          .find({
            _id: new mongoose.Types.ObjectId(findProduct?.productImg[0]),
          })
          .toArray();
        if (file.length === 0) {
          await setResponseObject(
            req,
            false,
            `File with id ${findProduct?.documentId} not found.`
          );
          next();
        }
        //deleting previous image from bucker and chunks
        await bucket.delete(
          new mongoose.Types.ObjectId(findProduct?.productImg[0])
        );
      }
    }

    const updateProduct = await PRODUCT.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    if (updateProduct) {
      await setResponseObject(
        req,
        true,
        "Product edit successfully",
        updateProduct
      );
      next();
    } else {
      await setResponseObject(req, false, "Product not edit");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * ALL PRODUCT LIST FOR ADMIN
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.allProdcutList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        productName: {
          $regex: req.query.search
            ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
            : "",
          $options: "i",
        },
      };
    }
    const productList = await PRODUCT.aggregate([
      {
        $match: {
          stateId: { $ne: CONST.DELETED },
        },
      },
      {
        $match: searchFilter,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);
    if (productList && productList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        productList[0].data,
        productList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Product list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * VIEW PRODUCT DETAILS
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.viewProduct = async (req, res, next) => {
  try {
    const viewProduct = await PRODUCT.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
    ]);

    if (viewProduct.length > 0) {
      await setResponseObject(
        req,
        true,
        "Product details found successfully",
        viewProduct[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Product details not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * DELETE PRODUCT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.deleteProduct = async (req, res, next) => {
  try {
    const deleteProduct = await PRODUCT.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        stateId: CONST.DELETED,
      }
    );

    if (deleteProduct) {
      await setResponseObject(req, true, "Product deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Product not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * PRODUCT LIST FOR USER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.productList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        productName: {
          $regex: req.query.search
            ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
            : "",
          $options: "i",
        },
      };
    }

    const productList = await PRODUCT.aggregate([
      {
        $match: {
          stateId: CONST.ACTIVE,
        },
      },
      {
        $match: searchFilter,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);
    if (productList && productList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        productList[0].data,
        productList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Product list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * UPDATE PRODUCT STATE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.body.stateId) {
      case 1:
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Product active successfully";
        break;

      case 2:
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Product inactive successfully";
        break;
      default:
    }

    let updateState = await PRODUCT.findByIdAndUpdate(
      { _id: req.params.id },
      filter,
      {
        new: true,
      }
    );
    if (updateState) {
      await setResponseObject(req, true, resp, updateState);
      next();
    } else {
      await setResponseObject(req, false, "Product state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

module.exports = product;
