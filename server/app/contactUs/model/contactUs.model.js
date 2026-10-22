/** 
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const schema = mongoose.Schema;

const contactus = new schema(
  {
    fullName: {
      type: String,
    },
    firstName:{
      type: String,
    },
    lastName:{
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    countryCode: {
      type: String,
    },
    message: {
      type: String,
    },
    stateId: {
      type: Number,
      enum: [CONST.NEW, CONST.REPLIED], // 0 => New, 1 => Requested, 2 => Replied, 3 => Deleted
      default: CONST.NEW,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);


module.exports.CONTACTUS = mongoose.model("contactus", contactus);


