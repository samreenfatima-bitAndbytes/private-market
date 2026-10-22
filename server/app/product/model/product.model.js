/*
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { CONST } = require("../../../helpers/constant");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const product = new Schema(
  {
    productName: {
      type: String,
    },

    productImg: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "filesBucket.files",
      },
    ],

    productFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "filesBucket.files",
    },

    price: {
      type: Number,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", product);
