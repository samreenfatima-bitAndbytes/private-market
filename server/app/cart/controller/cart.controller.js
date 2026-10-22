/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const { CART } = require("../model/cart.model");
const { setResponseObject } = require("../../../middleware/commonFunction");
const PRODUCT = require("../../product/model/product.model");
const { USER } = require("../../userService/model/userModel");
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { Notification } = require("../../notification/model/notification.model");
const product_ = require("../../property/controller/property.controller");
const cart = {
  /**
   * Add property in cart
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  addCart: async (req, res, next) => {
    try {
      const data = req.body;
      data.createdBy = req.userId;

      const findProduct = await PRODUCT.findById({ _id: data.productId });
      data.price = findProduct.price;
      data.productId = findProduct._id;
      const createCart = await CART.create(data);
      if (createCart) {
        await setResponseObject(
          req,
          true,
          "Product added in cart successfully",
          createCart
        );
        next();
      } else {
        await setResponseObject(req, false, "Product not added in cart");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * My cart list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  myCart: async (req, res, next) => {
    try {
      const list = await CART.aggregate([
        {
          $match: {
            createdBy: new mongoose.Types.ObjectId(req.userId),
          },
        },
        {
          $lookup: {
            from: "products",
            let: { id: "$productId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                  stateId: CONST.ACTIVE,
                },
              },
            ],
            as: "productDetails",
          },
        },
        {
          $unwind: {
            path: "$productDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            productDetails: { $exists: true, $ne: [] },
          },
        },
      ]);

      let total = 0;
      list.map((e) => {
        total = total + e?.productDetails?.price;
      });

      if (list) {
        await setResponseObject(req, true, "Cart list found successfully", {
          list,
          total,
        });
        next();
      } else {
        await setResponseObject(req, true, "Cart list not found");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Remove property from cart
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  removeCart: async (req, res, next) => {
    try {
      const removeProperty = await CART.findByIdAndDelete({
        _id: req.params.id,
      });
      const myCart = await CART.find({ createdBy: req.userId });
      if (removeProperty) {
        await setResponseObject(req, true, "Product remove from cart", myCart);
        next();
      } else {
        await setResponseObject(req, false, "Product not remove from cart");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Clear cart
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  clearCart: async (req, res, next) => {
    try {
      const clearCart = await CART.deleteMany({ createdBy: req.userId });
      if (clearCart) {
        await setResponseObject(req, true, "Cart clear successfully");
        next();
      } else {
        await setResponseObject(req, false, "Cart not clear");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },
};

module.exports = cart;
