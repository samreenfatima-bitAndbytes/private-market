/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { PAGE_MODEL } = require("../model/page.model");
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
const { default: mongoose } = require("mongoose");
const { CONST } = require("../../../helpers/constant");

module.exports = class cms_ {
  /*ADD CMS*/
  add = async (req, res, next) => {
    try {
      const data = req.body;
      data.createdBy = req.userId;
      if (req.file) {
        data.image = req.file.id
      }
      const isExists = await PAGE_MODEL.findOne({
        $or: [{ title: data.title }, { typeId: data.typeId }],
      });
      if (isExists) {
        await setResponseObject(req, false, ALREADY_EXISTS("Page"), "");
        next();
      } else {
        const result = await PAGE_MODEL.create(data);
        if (result) {
          await setResponseObject(req, true, ADD_SUCCESS("Page"), result);
          next();
        } else {
          await setResponseObject(req, false, ADD_FAILED("Page"), "");
          next();
        }
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET ALL CMS*/
  list = async (req, res, next) => {
    try {
      let getList;
      let title = req.query.title || ""
      getList = await PAGE_MODEL.find({ "title": { $regex: title, $options: 'i' } })
        .populate({
          path: "createdBy",
          select: "_id fullName",
        })
        .sort({ createdAt: -1 });
      if (getList) {
        await setResponseObject(req, true, FOUND_SUCCESS("Pages"), getList);
        next();
      } else {
        await setResponseObject(req, false, NOT_FOUND("Pages"), []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET SINGLE CMS*/
  detail = async (req, res, next) => {
    try {
      const getSingle = await PAGE_MODEL.findOne({ _id: req.params.id });
      if (getSingle) {
        await setResponseObject(req, true, FOUND_SUCCESS("Page"), getSingle);
        next();
      } else {
        await setResponseObject(req, false, NOT_FOUND("Page"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*UPDATE CMS*/
  update = async (req, res, next) => {
    try {
      const data = req.body;
      if (req.file) {
        data.image = req.file.id
      }
      const isExists = await PAGE_MODEL.findOne({
        _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
        typeId: data.typeId
      },);

      if (isExists) {
        await setResponseObject(req, false, ALREADY_EXISTS("Page"), "");
        next();
      } else {
        const updateData = await PAGE_MODEL.findByIdAndUpdate(
          { _id: req.params.id },
          data,
          { new: true }
        );
        if (updateData) {
          await setResponseObject(req, true, UPDATE_SUCCESS("Page"), updateData, "");
          next();
        } else {
          await setResponseObject(req, false, UPDATE_FAILED("Page"), "");
          next();
        }
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*UPDATE CMS STATE*/
  updateState = async (req, res, next) => {
    try {
      let payload = req.body;
      const findData = await PAGE_MODEL.findById(req.params.id);
      if (!findData) {
        await setResponseObject(req, true, NOT_FOUND("Page"), "");
        next();
      } else {
        if (payload.stateId == CONST.ACTIVE) {
          let updateState = await PAGE_MODEL.findOneAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true }
          );
          if (updateState) {
            await setResponseObject(
              req,
              true,
              "Page active successfully",
              updateState
            );
            next();
          }
          return;
        }
        if (payload.stateId == CONST.INACTIVE) {
          let updateState = await PAGE_MODEL.findOneAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true }
          );
          if (updateState) {
            await setResponseObject(
              req,
              true,
              "Page inactive successfully",
              updateState
            );
            next();
          }
          return;
        }
        if (payload.stateId == CONST.DELETED) {
          let updateState = await PAGE_MODEL.findOneAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true }
          );
          if (updateState) {
            await setResponseObject(
              req,
              true,
              "Page deleted successfully",
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

  /*GET BY TYPE CMS WITH ACTIVE STATE USER END API*/
  getByType = async (req, res, next) => {
    try {
      const getSingle = await PAGE_MODEL.findOne({
        typeId: req.params.typeId,
        stateId: CONST.ACTIVE,
      }).exec();
      if (getSingle) {
        await setResponseObject(req, true, FOUND_SUCCESS("Page"), getSingle);
        next();
      } else {
        await setResponseObject(req, true, NOT_FOUND("Page"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*DELETE CMS*/
  delete = async (req, res, next) => {
    try {
      const deleteData = await PAGE_MODEL.findByIdAndDelete({
        _id: req.params.id,
      });
      if (deleteData) {
        await setResponseObject(req, true, DELETE_SUCCESS("Data"), "");
        next();
      } else {
        await setResponseObject(req, false, UPDATE_FAILED("Data"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*SOFT DELETE CMS*/
  softDelete = async (req, res, next) => {
    try {
      const deleteData = await PAGE_MODEL.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        { stateId: CONST.DELETED },
        { new: true }
      );
      if (deleteData) {
        await setResponseObject(req, true, DELETE_SUCCESS("Data"), "");
        next();
      } else {
        await setResponseObject(req, false, UPDATE_FAILED("Data"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };
}


