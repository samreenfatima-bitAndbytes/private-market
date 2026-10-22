const mongoose = require("mongoose");
const {
  CHAT_CONSTANT_MODEL,
  CHAT_MODEL,
  MESSAGE_MODEL,
} = require("../model/chat.model");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { CONST } = require("../../../helpers/constant");
const fs = require("fs");
const multer = require("multer");
const dir = "./uploads/chatFiles";
const { USER } = require("../../userService/model/userModel");
const { sendNotification } = require("../../../helpers/fcmPushNotification");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).fields([{ name: "file" }]);

const _chat = {
  /**
   * Send message api
   * @param {senderId,receiverId,message} req.body
   * @param {*} res
   * @param {*} next
   */
  sendMessage: async (req, res, next) => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true,
        });
      }
      upload(req, res, async (error) => {
        if (error) {
          await setResponseObject(req, false, error.message, "");
          next();
        } else {
          let data = req.body;
          data.senderId = req.userId;
          if (req.files) {
            // Multiple documents
            let image = [];
            if (req.files.file) {
              data.isFile = true;
              req.files.file.map((e) => {
                image.push({ url: e.path.replace(/\s+/g, "") });
              });
            }
            data.file = image;
          }

          let constantResult = await CHAT_CONSTANT_MODEL.findOneAndUpdate(
            {
              $or: [
                {
                  $and: [
                    {
                      senderId: new mongoose.Types.ObjectId(data.senderId),
                    },
                    {
                      receiverId: new mongoose.Types.ObjectId(data.receiverId),
                    },
                  ],
                },
                {
                  $and: [
                    {
                      senderId: new mongoose.Types.ObjectId(data.receiverId),
                    },
                    {
                      receiverId: new mongoose.Types.ObjectId(data.senderId),
                    },
                  ],
                },
              ],
            },
            {
              senderId: new mongoose.Types.ObjectId(data.senderId),
              receiverId: new mongoose.Types.ObjectId(data.receiverId),
            },
            {
              new: true,
              upsert: true,
            }
          );
          let senderDetail =  await USER.findById({_id : new mongoose.Types.ObjectId(data.senderId)});

          let chatObj = {
            senderId :data.senderId,
            receiverId:data.receiverId,
            chatId    : constantResult._id,
            username  : senderDetail?.fullName
          }
          let userDetail =  await USER.findById({_id : new mongoose.Types.ObjectId(data.receiverId)});
          sendNotification(userDetail?.deviceToken,'New Message',data.message,data.message,'MESSAGE',chatObj);
          data.chatId = constantResult._id;
          let chatResult = await CHAT_MODEL(data).save();
          await CHAT_CONSTANT_MODEL.findByIdAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(constantResult._id),
            },
            {
              lastMsgId: chatResult,
              updatedAt: Date.now(),
            },
            {
              new: true,
              upsert: true,
            }
          );

          let finalResult = await CHAT_MODEL.find({
            chatId: new mongoose.Types.ObjectId(constantResult._id),
          });
          if (finalResult) {
            await setResponseObject(
              req,
              true,
              "Message send successfully",
              finalResult
            );
            next();
          } else {
            await setResponseObject(req, false, "Message not send");
            next();
          }
        }
      });
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },

  /**
   * Send message api
   * @param {senderId,receiverId,message} req.body
   * @param {*} res
   * @param {*} next
   */
  sendRescheduleMessage: async (data) => {
    try {
      let constantResult = await CHAT_CONSTANT_MODEL.findOneAndUpdate(
        {
          $or: [
            {
              $and: [
                {
                  senderId: new mongoose.Types.ObjectId(data.senderId),
                },
                {
                  receiverId: new mongoose.Types.ObjectId(data.receiverId),
                },
              ],
            },
            {
              $and: [
                {
                  senderId: new mongoose.Types.ObjectId(data.receiverId),
                },
                {
                  receiverId: new mongoose.Types.ObjectId(data.senderId),
                },
              ],
            },
          ],
        },
        {
          senderId: new mongoose.Types.ObjectId(data.senderId),
          receiverId: new mongoose.Types.ObjectId(data.receiverId),
        },
        {
          new: true,
          upsert: true,
        }
      );
      data.chatId = constantResult._id;
      data.isReschedule = true;
      let senderDetail =  await USER.findById({_id : new mongoose.Types.ObjectId(data.senderId)});

      let chatObj = {
        senderId :data.senderId,
        receiverId:data.receiverId,
        chatId    : constantResult._id,
        username  : senderDetail?.fullName
      }
      let userDetail =  await USER.findById({_id : new mongoose.Types.ObjectId(data.receiverId)});
      sendNotification(userDetail?.deviceToken,'Reschedule Appointment',data.message,data.message,'MESSAGE',chatObj);
      let chatResult = await CHAT_MODEL(data).save();
      await CHAT_CONSTANT_MODEL.findByIdAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(constantResult._id),
        },
        {
          lastMsgId: chatResult,
          updatedAt: Date.now(),
        },
        {
          new: true,
          upsert: true,
        }
      );

      let finalResult = await CHAT_MODEL.find({
        chatId: new mongoose.Types.ObjectId(constantResult._id),
      });
      if (finalResult) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },

  /**
   * Chat List api
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  getUserList: async (req, res, next) => {
    try {
      let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
      let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

      const chatList = await CHAT_CONSTANT_MODEL.aggregate([
        {
          $match: {
            $or: [
              {
                senderId: new mongoose.Types.ObjectId(req.userId),
              },
              {
                receiverId: new mongoose.Types.ObjectId(req.userId),
              },
            ],
          },
        },
        {
          $match: {
            deletedBy: { $ne: new mongoose.Types.ObjectId(req.userId) },
          },
        },
        {
          $lookup: {
            from: "chats",
            let: { chatId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$chatId", "$chatId"] },
                  isSeen: false,
                  receiverId: new mongoose.Types.ObjectId(req.userId),
                },
              },
            ],
            as: "msgsCount",
          },
        },
        {
          $addFields: {
            unseenCount: { $size: "$msgsCount" },
          },
        },
        {
          $lookup: {
            from: "chats",
            localField: "lastMsgId",
            foreignField: "_id",
            as: "lastMsgId",
          },
        },
        { $unwind: { path: "$lastMsgId", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            receiverId: {
              $cond: {
                if: {
                  $eq: [
                    new mongoose.Types.ObjectId(req.userId),
                    "$lastMsgId.receiverId",
                  ],
                },
                then: "$lastMsgId.senderId",
                else: "$lastMsgId.receiverId",
              },
            },
          },
        },

        {
          $addFields: {
            senderId: {
              $cond: {
                if: {
                  $eq: [
                    new mongoose.Types.ObjectId(req.userId),
                    "$lastMsgId.senderId",
                  ],
                },
                then: "$lastMsgId.senderId",
                else: "$lastMsgId.receiverId",
              },
            },
          },
        },

        {
          $lookup: {
            from: "users",
            let: { id: "$receiverId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$id"] },
                },
              },
            ],
            as: "receiverId",
          },
        },
        { $unwind: { path: "$receiverId", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "users",
            let: { id: "$senderId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$id"] },
                },
              },
            ],
            as: "senderId",
          },
        },
        { $unwind: { path: "$senderId", preserveNullAndEmptyArrays: true } },

        {
          $project: {
            _id: 1,
            createdAt: 1,
            updatedAt: 1,
            lastMsgId: "$lastMsgId._id",
            sentAt: "$lastMsgId.createdAt",
            message: "$lastMsgId.message",
            receiverId: "$receiverId._id",
            receiverName: "$receiverId.fullName",
            receiverImage: "$receiverId.profileImg",
            senderId: "$senderId._id",
            senderName: "$senderId.fullName",
            senderImage: "$senderId.profileImg",
            unseenCount: 1,
          },
        },
        {
          $sort: { updatedAt: -1 },
        },
        {
          $facet: {
            data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
            count: [
              {
                $count: "count",
              },
            ],
          },
        },
      ]);
      if (chatList && chatList[0].data.length) {
        await setResponseObject(
          req,
          true,
          "Chat list found successfully",
          chatList[0].data,
          chatList[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Chat list not found ", []);
        next();
      }
    } catch (err) {
      await setResponseObject(req, false, err.message, "");
      next();
    }
  },

  /**
   * Chat delete api
   * @param {*} req
   * @param {*} res
   */
  deleteChat: async (req, res, next) => {
    try {
      let data = req.body;
      let chatId = data.chatId;
      let senderId = data.senderId;
      var deletedByIds;

      /**Find Chat RoomId */
      var getSingleChat = await CHAT_CONSTANT_MODEL.findOne({
        _id: new mongoose.Types.ObjectId(chatId),
      });

      if (getSingleChat) {
        /**Push SenderId In deletedBy Array */
        getSingleChat.deletedBy.push(new mongoose.Types.ObjectId(senderId));

        deletedByIds = getSingleChat.deletedBy;

        isUpdated = await CHAT_CONSTANT_MODEL.findOneAndUpdate(
          { _id: data.chatId },
          { deletedBy: deletedByIds },
          { new: true }
        );

        /**
         * Delete Chat
         */

        isUpdateOnChat = await CHAT_MODEL.updateMany(
          { chatId: data.chatId },
          { deletedBy: deletedByIds },
          { new: true, multi: true }
        );

        if (isUpdated) {
          await setResponseObject(
            req,
            true,
            "Chat is successfully deleted",
            ""
          );
          next();
        }
      } else {
        await setResponseObject(req, false, "Chat is not deleted", "");
        next();
      }
    } catch (err) {
      await setResponseObject(req, false, err.message, "");
      next();
    }
  },

  /**
   * Chat details api
   * @param {*} req
   * @param {*} res
   */
  chatDetails: async (req, res, next) => {
    try {
      let chatDetails = await CHAT_MODEL.find({
        chatId: new mongoose.Types.ObjectId(req.query.chatId),
        deletedBy: {
          $ne: new mongoose.Types.ObjectId(req.userId),
        },
      })
        .populate({
          path: "senderId",
          select: "_id fullName profileImg",
        })
        .populate({
          path: "receiverId",
          select: "_id fullName profileImg",
        });

      let updateChat = await CHAT_MODEL.updateMany(
        {
          chatId: new mongoose.Types.ObjectId(req.query.chatId),
          receiverId: new mongoose.Types.ObjectId(req.userId),
        },
        {
          $set: {
            isSeen: true,
          },
        },
        {
          multi: true,
          new: true,
        }
      );
      if (chatDetails) {
        await setResponseObject(
          req,
          true,
          "Chat details found successfully",
          chatDetails
        );
        next();
      } else {
        await setResponseObject(req, false, "Chat details not found", "");
        next();
      }
    } catch (err) {
      await setResponseObject(req, false, err.message, "");
      next();
    }
  },
};

module.exports = _chat;
