/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let mongoose = require("mongoose");
let SCHEMA = mongoose.Schema;
let { CONST } = require("../../../helpers/constant");
let cart = new SCHEMA(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "property",
    },

    link: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    price: {
      type: Number,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },

    productPrice: {
      type: Number,
    },

    typeId: {
      type: Number,
      enum: [CONST.CSV, CONST.PRODUCT],
    },

    state: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE],
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports.CART = mongoose.model("cart", cart);
