/*
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
let SCHEMA = mongoose.Schema;

/**
 * Declear the schema for faq model
 */
const faq = new SCHEMA(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED], // ACTIVE => 1, INACTIVE => 2, DELETED => 3
      default: CONST.ACTIVE,
    }
  },
  { timestamps: true }
);

module.exports.FAQ_MODEL = mongoose.model("faq", faq);
