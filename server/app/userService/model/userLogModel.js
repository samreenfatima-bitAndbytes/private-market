let mongoose = require("mongoose");
let SCHEMA = mongoose.Schema;
let {CONST} = require("../../../helpers/constant");

let userLoginLog = new SCHEMA(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    userIP: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    failedReason: {
      type: String,
      default: "",
    },

    loginAt: {
      type: Date,
      default: Date.now,
    },

    loginAt: {
      type: Date,
      default: Date.now,
    },

    deviceType: {
      type: Number,
      enum: [
        CONST.WEB,
        CONST.ANDROID,
        CONST.IOS,
      ],
      default: CONST.WEB,
    },

    state: {
      type: String,
      enum: [CONST.FAILED, CONST.SUCCESS],
      default: CONST.NONE,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userLoginLog", userLoginLog);
