/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { default: mongoose } = require("mongoose");
const { CONST } = require("../../../helpers/constant")
/*Error log schema*/
const errorLogs = new mongoose.Schema(
  {
    errorCode: {
      type: String,
    },
    ip: {
      type: String,
    },
    errorName: {
      type: String,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const EmailLogsSchema = new mongoose.Schema(
    {
        from: {
            type: String,
        },
        to: {
            type: String,
        },
        subject: {
            type: String,
        },
        description: {
            type: String,
        },
        stateId: {
            type: Number,
            enum: [CONST.SUCCESS, CONST.PENDING, CONST.FAILED],
        },
        typeId: {
          type: Number,
          enum: [CONST.QUERY],
      },
    },
    {
        timestamps: true,
    }
);

module.exports.EMAIL_LOGS = mongoose.model("email", EmailLogsSchema);
module.exports.Error_Logs = mongoose.model("errorLogs", errorLogs)
