/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const SCHEMA = mongoose.Schema;

const paymentSchema = new SCHEMA(
  {
    paymentIntentId: {
      type: String,
    },
    chargeId: {
      type: String,
    },
    customerId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
    },
    paymentMethodId: {
      type: String,
    },
    paidBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    paidTo: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    propertyId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "property",
      },
    ],
    productId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
      },
    ],
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.Payment = mongoose.model("payment", paymentSchema);
