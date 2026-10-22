/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { setResponseObject } = require("../../../middleware/commonFunction");
const {
  ALREADY_EXISTS,
  ADD_SUCCESS,
  ADD_FAILED,
  UPDATE_SUCCESS,
  UPDATE_FAILED,
  FOUND_SUCCESS,
  NOT_FOUND,
  DELETE_SUCCESS,
} = require("../../../middleware/responseMessages");
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { CATEGORY } = require("../model/category.model");

module.exports = class category_ {
  /*ADD CATEGORY*/
  add = async (req, res, next) => {
    try {
      const data = req.body;
      const isExists = await CATEGORY.findOne({
        name: { $regex: new RegExp(`^${data.name}$`), $options: "i" },
        stateId: { $ne: CONST.DELETED },
      });
      if (isExists) {
        await setResponseObject(
          req,
          false,
          ALREADY_EXISTS("Property type"),
          ""
        );
        next();
      } else {
        data.createdBy = req.userId;
        if (req.file) {
          (data.image = `/getImg/${req.file.id}`), (data.imageId = req.file.id);
        }
        const result = await CATEGORY.create(data);
        if (result) {
          await setResponseObject(
            req,
            true,
            ADD_SUCCESS("Property type"),
            result
          );
          next();
        } else {
          await setResponseObject(req, false, ADD_FAILED("Property type"), "");
          next();
        }
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET ALL CATEGORY LIST*/
  list = async (req, res, next) => {
    try {
      let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
      let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

      let criteria = {};
      if (req.query.search && req.query.search !== "undefined") {
        criteria.$or = [
          {
            name: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
        ];
      }
      let stateId = {};
      switch (req.query.stateId) {
        case "1":
          stateId = {
            stateId: CONST.ACTIVE,
          };
          break;
        case "2":
          stateId = {
            stateId: CONST.INACTIVE,
          };
          break;
        default:
      }

      if (req.roleId == CONST.USER || req.roleId == CONST.AGENT) {
        stateId = {
          stateId: CONST.ACTIVE,
        };
      }

      let list = await CATEGORY.aggregate([
        {
          $match: {
            stateId: { $ne: CONST.DELETED },
          },
        },
        {
          $match: stateId,
        },
        {
          $match: criteria,
        },
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            image: 1,
            imageId: 1,
            createdAt: 1,
            updatedAt: 1,
            stateId: 1,
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
          FOUND_SUCCESS("Property type list"),
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, NOT_FOUND("Property type list"), []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET SINGLE CATEGORY*/
  detail = async (req, res, next) => {
    try {
      const getSingle = await CATEGORY.findOne({ _id: req.params.id });
      if (getSingle) {
        await setResponseObject(
          req,
          true,
          FOUND_SUCCESS("Property type details"),
          getSingle
        );
        next();
      } else {
        await setResponseObject(
          req,
          true,
          NOT_FOUND("Property type details"),
          ""
        );
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*UPDATE CATEGORY*/
  update = async (req, res, next) => {
    try {
      const data = req.body;
      const isExists = await CATEGORY.findOne({
        $and: [
          { _id: { $ne: new mongoose.Types.ObjectId(req.params.id) } },
          {
            name: { $regex: new RegExp(`^${data.name}$`), $options: "i" },
          },
          { stateId: { $ne: CONST.DELETED } },
        ],
      });

      if (isExists) {
        await setResponseObject(
          req,
          false,
          ALREADY_EXISTS("Property type"),
          ""
        );
        next();
      } else {
        const findCategory = await CATEGORY.findById({
          _id: new mongoose.Types.ObjectId(req.params.id),
        });

        if (req.file) {
          (data.image = `/getImg/${req.file.id}`), (data.imageId = req.file.id);

          //has to delete previous image also
          if (req.file && findCategory?.imageId) {
            // Check if the file exists
            const file = await bucket
              .find({
                _id: new mongoose.Types.ObjectId(findCategory?.imageId),
              })
              .toArray();
            if (file.length === 0) {
              await setResponseObject(
                req,
                false,
                `File with id ${findCategory?.imageId} not found.`
              );
              next();
            }
            //deleting previous image from bucker and chunks
            await bucket.delete(
              new mongoose.Types.ObjectId(findCategory?.imageId)
            );
          }
        }
        const updateData = await CATEGORY.findByIdAndUpdate(
          { _id: req.params.id },
          data,
          { new: true }
        );

        if (updateData) {
          await setResponseObject(
            req,
            true,
            UPDATE_SUCCESS("Property type"),
            updateData
          );
          next();
        } else {
          await setResponseObject(
            req,
            false,
            UPDATE_FAILED("Property type"),
            ""
          );
          next();
        }
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*UPDATE CATEGORY STATE*/
  updateState = async (req, res, next) => {
    try {
      let payload = req.body;
      const findData = await CATEGORY.findById(req.params.id);
      if (!findData) {
        await setResponseObject(req, true, NOT_FOUND("Property type"), "");
        next();
      } else {
        if (payload.stateId == CONST.ACTIVE) {
          let updateState = await CATEGORY.findByIdAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true }
          );
          if (updateState) {
            await setResponseObject(
              req,
              true,
              "Property type active successfully",
              updateState
            );
            next();
          }
          return;
        }
        if (payload.stateId == CONST.INACTIVE) {
          let updateState = await CATEGORY.findOneAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true }
          );
          if (updateState) {
            await setResponseObject(
              req,
              true,
              "Property type inactive successfully",
              updateState
            );
            next();
          }
          return;
        }
      }
      await setResponseObject(req, true, "Invalid requested state!", "");
      next();
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*SOFT DELETE CATEGORY*/
  softDelete = async (req, res, next) => {
    try {
      const deleteData = await CATEGORY.findByIdAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
        { stateId: CONST.DELETED },
        { new: true }
      );
      if (deleteData) {
        await setResponseObject(req, true, DELETE_SUCCESS("Property type"), "");
        next();
      } else {
        await setResponseObject(req, false, UPDATE_FAILED("Property type"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET ALL CATEGORY LIST*/
  activeCategory = async (req, res, next) => {
    try {
      
      let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
      let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

      let list = await CATEGORY.aggregate([
        {
          $match: {
            stateId: { $eq: CONST.ACTIVE },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            image: 1,
            imageId: 1,
            createdAt: 1,
            updatedAt: 1,
            stateId: 1,
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
          FOUND_SUCCESS("Property type list"),
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, NOT_FOUND("Property type list"), []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };
};
