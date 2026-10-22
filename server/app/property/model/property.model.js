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
let property = new SCHEMA(
  {
    name: {
      type: String,
    },

    description: {
      type: String,
    },

    image: [String],

    fileType: [
      {
        type: String,
      },
    ],
    propertyImgId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "filesBucket.files",
      },
    ],

    propertyfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "filesBucket.files",
    },

    place: {
      type: String,
    },

    postalCode: {
      type: String,
    },

    price: {
      type: Number,
      default: 0,
    },

    building_fee: {
      type: Number,
    },

    year_of_construction: {
      type: Number,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    gross_area: {
      type: Number,
    },

    net_area: {
      type: Number,
    },

    baths: {
      type: Number,
    },

    floor: {
      type: Number,
      default: 0,
    },

    state: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED, CONST.BAN],
      default: CONST.ACTIVE,
    },

    energy_class: {
      type: String,
    },
    district: {
      type: String,
    },
    parish: {
      type: String,
    },
    rooms: {
      type: Number,
    },
    link: {
      type: String,
    },
    reference: {
      type: String,
    },
    street: {
      type: String,
    },
    building_no: {
      type: String,
    },
    municipality: {
      type: String,
    },
    elevator: {
      type: String,
    },
    categoryId: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },

    type_of_real_estate: {
      type: String,
    },
    position: {
      type: String,
    },
    condition: [String],
    other_features_real_estate: [String],
    other_features_building: [String],
    propertyFile: {
      type: String,
    },
    csvPrice: {
      type: Number,
      default: 50,
    },
    priceEstimation: {
      type: Number,
    },
    expectedRentalYield: {
      type: Number,
    },
    daysToSale: {
      type: Number,
    },
    priceDelta: {
      type: Number,
    },
  },
  { timestamps: true }
);
property.index({ location: "2dsphere" });
module.exports.PROPERTY = mongoose.model("property", property);
