/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const SCHEMA = mongoose.Schema;

let PAGE_MODEL_SCHEMA = new SCHEMA(
  {
    title: {
      type: String,
    },

    description: {
      type: String,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "filesBucket.files",
    },
    typeId: {
      type: Number,
      enum: [CONST.ABOUT, CONST.TERMS, CONST.PRIVACY, CONST.CANCEL_POLICY, CONST.COOKIES_POLICY],
    },

    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports.PAGE_MODEL = mongoose.model("page", PAGE_MODEL_SCHEMA);
