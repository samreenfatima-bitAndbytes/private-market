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
const favourite = new Schema(
  {
    propertyId: {
      type: mongoose.Types.ObjectId,
      ref: "property",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    isFavourite: {
      type: Number,
      enum: [CONST.TRUE, CONST.FALSE], // TRUE =>1,  FALSE =>2,
      default: CONST.TRUE,
    },
  },
  { timestamps: true }
);

module.exports.FAVOURITE = mongoose.model("favourite", favourite);
