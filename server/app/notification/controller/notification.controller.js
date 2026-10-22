/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const { default: mongoose } = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { Notification } = require("../model/notification.model");
const moment = require("moment");
const responseMessages = require("../../../middleware/responseMessages");

module.exports = class notification_ {
  /**
   * My notification list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async myNotification(req, res, next) {
    try {
      
      let pageNo = parseInt(req.query.pageNo) || 1;
      let pageLimit = parseInt(req.query.pageLimit) || 10;

      const notificationList = await Notification.aggregate([
        {
          $match: {
            $and: [
              { to: new mongoose.Types.ObjectId(req.userId) },
              { stateId: { $ne: CONST.DELETED } },
            ],
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },

        {
          $facet: {
            data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
            count: [{ $count: "count" }],
          },
        },
      ]);

      let update = await Notification.updateMany(
        {
          to: new mongoose.Types.ObjectId(req.userId),
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

      if (notificationList && notificationList[0].data.length) {
        await setResponseObject(
          req,
          true,
          "Notifications found successfully",
          notificationList[0].data,
          notificationList[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Notifications not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

   /**
   * Delete all notification
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
   async deleteNotification (req, res, next){
    try {
      
      let notification = await Notification.deleteMany({
        to: new mongoose.Types.ObjectId(req.userId),
      });

      if (notification) {
        await setResponseObject(req, true, "Notification deleted successfully");
        next();
      } else {
        await setResponseObject(req, false, "Notification not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * get admin notification list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAdminNotificationList(req, res, next) {
    try {
      let page = parseInt(req.query.pageNo) || PAGE_ONE;
      let pageLimit = parseInt(req.query.pageLimit) || PAGE_LIMIT;

      const myAllNotification = await Notification.aggregate([
        {
          $sort: { _id: -1 },
        },
        {
          $lookup: {
            from: "users",
            let: { id: "$from" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
            ],
            as: "sendFrom",
          },
        },
        {
          $unwind: {
            path: "$sendFrom",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            let: { id: "$to" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
            ],
            as: "sendTo",
          },
        },
        {
          $unwind: {
            path: "$sendTo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "properties",
            let: { propertyId: "$propertyId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$propertyId"] },
                },
              },
            ],
            as: "property",
          },
        },
        {
          $unwind: {
            path: "$property",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: true,
            title: true,
            description: true,
            stateId: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            productId: true,
            amount: true,
            isSeen: true,
            sendFrom: {
              _id: true,
              fullName: true,
              phoneNumber: true,
            },
            sendTo: {
              _id: true,
              fullName: true,
              phoneNumber: true,
            },
            property: {
              _id: true,
              title: true,
              keyFeature: true,
              description: true,
            },
          },
        },
        {
          $facet: {
            data: [
              { $skip: pageLimit * (page - PAGE_ONE) },
              { $limit: pageLimit },
            ],
            count: [
              {
                $count: "count",
              },
            ],
          },
        },
      ]);

      if (myAllNotification && myAllNotification[0].data.length) {
        await setResponseObject(
          req,
          true,
          responseMessage.FOUND_SUCCESS("Notification"),
          myAllNotification[0].data,
          myAllNotification[0].count[0].count,
          page,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, NOT_FOUND("Notification"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, error.stack);
      next();
    }
  }
};
