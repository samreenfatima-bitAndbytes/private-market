// /**
// @copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
// @author     : Shiv Charan Panjeta < shiv@toxsl.com >

// All Rights Reserved.
// Proprietary and confidential :  All information contained herein is, and remains
// the property of Hotopics Unipessoal Lda. and its partners.
// Unauthorized copying of this file, via any medium is strictly prohibited.
// */

// const mongoose = require("mongoose");
// let { CONST } = require("../../../helpers/constant");


// const MessageSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Types.ObjectId,
//       ref: "user",
//     },

//     receiverId: {
//       type: mongoose.Types.ObjectId,
//       ref: "user",
//     },

//     message: {
//       type: String,
//       default: "",
//     },
//     isSeen: {
//       type: Boolean,
//       default: false,
//     },
//     lastSeen: {
//       type: Number,
//     },
//     isFile:{
//       type: Boolean,
//       default: false,
//     },
//     file: [
//       {
//         url: {
//           type: String,
//         },
//       },
//     ],
//     media: [
//       {
//         mediaUrl: {
//           type: String,
//           default: false,
//         },
//         mediaThumbnail: {
//           type: String,
//         },
//       },
//     ],
//     deletedBy: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "user",
//       },
//     ],
//     stateId: {
//       type: Number,
//       enum: [
//         CONST.ACTIVE,
//         CONST.INACTIVE,
//         CONST.DELETED,
//       ],
//       default: CONST.ACTIVE,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
// module.exports.MESSAGE_MODEL = mongoose.model("message", MessageSchema);


/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const mongoose = require("mongoose");
const {CONST} = require("../../../helpers/constant");

// Declare the Schema of the chat module model
const ChatSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    chatId: {
      type: mongoose.Types.ObjectId,
      ref: "chatConstant",
    },
    deletedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    isSeen: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "",
    },
    isReschedule:{
      type: Boolean,
      default: false,
    },
    isFile: {
      type: Boolean,
      default: false,
    },
    file: [
      {
        url: {
          type: String,
        },
        type: {
          type: String,
        },
      },
    ],
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
  {
    timestamps: true,
  }
);

// Declare the Schema of the chat constant module model
const ChatConstantSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    lastMsgId: {
      type: mongoose.Types.ObjectId,
      ref: "chat",
    },
    deletedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    isTyping: {
      type: Boolean,
      default: false,
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
  {
    timestamps: true,
  }
);

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    message: {
      type: String,
      default: "",
    },

    isSeen: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Number,
    },
    media: [
      {
        mediaUrl: {
          type: String,
          default: false,
        },
        mediaThumbnail: {
          type: String,
        },
      },
    ],
    deletedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

module.exports.CHAT_MODEL = mongoose.model("chat", ChatSchema);
module.exports.CHAT_CONSTANT_MODEL = mongoose.model(
  "chatConstant",
  ChatConstantSchema
);
module.exports.MESSAGE_MODEL = mongoose.model("message", MessageSchema);

