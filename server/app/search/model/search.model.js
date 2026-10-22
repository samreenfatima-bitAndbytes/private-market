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
let search = new SCHEMA(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    rooms: [
      {
        type: String,
      },
    ],

    baths: [
      {
        type: String,
      },
    ],

    other_features_real_estate: [
      {
        type: String,
      },
    ],

    other_features_building: [
      {
        type: String,
      },
    ],

    floor: [
      {
        type: String,
      },
    ],

    elevator: {
      type: String,
    },

    minPrice: {
      type: Number,
    },

    maxPrice: {
      type: Number,
    },

    minSize: {
      type: Number,
    },

    maxSize: {
      type: Number,
    },

    propertyType: {
      type: String,
    },

    condition: [String],

    search: {
      type: String,
    },

    date: {
      type: String,
    },

    typeId: {
      type: Number,
      enum: [CONST.ENABLE, CONST.DISABLE],
      default: CONST.DISABLE,
    },

    state: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
    maxNet: {
      type: Number,
    },
    minNet: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports.SEARCH = mongoose.model("search", search);
