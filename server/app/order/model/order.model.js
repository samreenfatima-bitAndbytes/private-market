/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const schema = mongoose.Schema;
const order = new schema(
  {
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

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    orderId: {
      type: Number,
    },

    orderTotal: {
      type: Number,
    },

    total: {
      type: Number,
    },

    paymentStatus: {
      type: Number,
      enum: [CONST.PENDING, CONST.SUCCESS], // PENDING => 3, SUCCESS => 4
      default: CONST.PENDING,
    },
    
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED], // ACTIVE => 1, INACTIVE => 2, INACTIVE => 3
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports.ORDER = mongoose.model("order", order);
