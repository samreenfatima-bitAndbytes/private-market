/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
let { SEARCH } = require("../model/search.model");
let { CONST } = require("../../../helpers/constant");
const mongoose = require("mongoose");
const { Notification } = require("../../notification/model/notification.model");
const { USER } = require("../../userService/model/userModel");
const { PROPERTY } = require("../../property/model/property.model");
let setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;
module.exports = class search {
  /**
   * Save user search
   */
  saveSearch = async (req, res, next) => {
    try {
      const data = req.body;
      data.createdBy = req.userId;

      const condition = data.condition
        ?.split(",")
        .map((condition) => condition.trim());
      data.condition = condition;

      const saveSearch = await SEARCH.create(data);
      if (saveSearch) {
        const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
        const findProperty = await PROPERTY.findOne({
          _id: saveSearch.propertyId,
        });
        //send notification
        var notificationBody = {
          from: findAdmin._id,
          to: req.userId,
          title: `New search filter is saved`,
          description: `Your all search filter is saved successfully`,
        };
        await Notification.create(notificationBody);
        await setResponseObject(req, true, "", saveSearch);
        next();
      } else {
        await setResponseObject(req, false, "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /**
   * My search list
   */
  mySearchList = async (req, res, next) => {
    try {
      const pageNo = parseInt(req.query.pageNo) || 1;
      const pageLimit = parseInt(req.query.pageLimit) || 10;
      const list = await SEARCH.aggregate([
        {
          $match: {
            createdBy: new mongoose.Types.ObjectId(req.userId),
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $facet: {
            data: [
              { $skip: pageLimit * (pageNo - CONST.PAGE_NO) },
              { $limit: pageLimit },
            ],
            count: [{ $count: "count" }],
          },
        },
      ]);

      if (list && list[0].data.length) {
        await setResponseObject(
          req,
          true,
          "Search list found successfully",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Search list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /**
   * Update save search
   */
  updateSearch = async (req, res, next) => {
    try {
      const data = req.body;
      const updateSearch = await SEARCH.findByIdAndUpdate(
        { _id: data.id },
        data,
        { new: true }
      );
      if (updateSearch) {
        await setResponseObject(
          req,
          true,
          "Search data updated successfully",
          updateSearch
        );
        next();
      } else {
        await setResponseObject(req, true, "Search data not updated", "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /**
   * Update save search
   */
  deleteSearch = async (req, res, next) => {
    try {
      const deleteSearch = await SEARCH.findByIdAndDelete({
        _id: req.params.id,
      });
      if (deleteSearch) {
        await setResponseObject(req, true, "Saved search deleted successfully");
        next();
      } else {
        await setResponseObject(req, false, "Saved search not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /**
   * Enable and disable save search
   */
  enableSearch = async (req, res, next) => {
    try {
      const data = req.body;

      var respMsg =
        data.typeId == 1
          ? " You will receive the daily email"
          : "You will not receive the daily email";

      const updateData = await SEARCH.findByIdAndUpdate(
        { _id: data.id },
        { typeId: data.typeId },
        { new: true }
      );
      await setResponseObject(req, true, respMsg);
      next();
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };
};
