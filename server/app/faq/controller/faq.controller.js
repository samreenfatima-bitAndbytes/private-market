/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { FAQ_MODEL } = require("../model/faq.model");
const {
  ALREADY_EXISTS,
  ADD_SUCCESS,
  ADD_FAILED,
  FOUND_SUCCESS,
  NOT_FOUND,
  UPDATE_SUCCESS,
  UPDATE_FAILED,
} = require("../../../middleware/responseMessages");
const { CONST } = require("../../../helpers/constant");
const { setResponseObject } = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const faq = {};

/**
 * Add faq api
 */
faq.addFaq = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.userId;
    const isExist = await FAQ_MODEL.findOne({ question: data.question });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "This Question is already in existence."
      );
      next();
    } else {
      const saveFaq = await FAQ_MODEL.create(data);

      if (saveFaq) {
        await setResponseObject(req, true, ADD_SUCCESS("FAQ"), saveFaq);
        next();
      } else {
        await setResponseObject(req, false, ADD_FAILED("FAQ"));
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Edit faq api
 */
faq.editFaq = async (req, res, next) => {
  try {
    const data = req.body;
    const isExist = await FAQ_MODEL.findOne({
      $and: [{ _id: { $ne: req.params.id } }, { question: data.question }],
    });
    if (isExist) {
      await setResponseObject(req, false, ALREADY_EXISTS("FAQ"));
      next();
    }
    const updateFaq = await FAQ_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    if (updateFaq) {
      await setResponseObject(req, true, UPDATE_SUCCESS("FAQ"), updateFaq);
      next();
    } else {
      await setResponseObject(req, false, UPDATE_FAILED("FAQ"));
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Get faq list api
 */
faq.faqList = async (req, res, next) => {
  try {
    let filter = {};
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let pageNo = parseInt(req.query.pageNo) || 1;

    switch (req.query.state) {
      case "1": // ACTIVE
        filter = {
          stateId: CONST.ACTIVE,
        };
        break;

      case "2": // INACTIVE
        filter = {
          stateId: CONST.INACTIVE,
        };
        break;

      case "3": // DELETED
        filter = {
          stateId: CONST.DELETED,
        };
        break;

      default:
        break;
    }

    const list = await FAQ_MODEL.aggregate([
      {
        $match: filter,
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
    if (list && list[0]?.data.length) {
      await setResponseObject(
        req,
        true,
        FOUND_SUCCESS,
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, NOT_FOUND("FAQ"), []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Faq view api
 */
faq.faqDetails = async (req, res, next) => {
  try {
    const details = await FAQ_MODEL.findById({ _id: req.params.id });
    if (details) {
      await setResponseObject(req, true, FOUND_SUCCESS("FAQ"), details);
      next();
    } else {
      await setResponseObject(req, true, NOT_FOUND("FAQ"));
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Update faq state id
 */
faq.updateFaqState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.body.state) {
      case 1:
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Faq active successfully";
        break;

      case 2:
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Faq inactive successfully";
        break;

      case 3:
        filter = {
          stateId: 3, // 3 => DELETED
        };
        resp = "Faq deleted successfully";
        break;
      default:
    }

    let updateState;
 
      updateState = await FAQ_MODEL.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        {
          $set: filter,
        }
      );
    // }
    if (updateState) {
      await setResponseObject(req, true, resp, updateState);
      next();
    } else {
      await setResponseObject(req, false, "Faq state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Update faq state id
 */
faq.delete = async (req, res, next) => {
  try {
    let deleteRes = await FAQ_MODEL.findByIdAndDelete({ _id: req.params.id });
    if (deleteRes) {
      await setResponseObject(
        req,
        true,
        "Data deleted successfully",
        deleteRes
      );
      next();
    } else {
      await setResponseObject(req, false, "Something went wrong");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Get faq list api
 */
faq.List = async (req, res, next) => {
  try {
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let pageNo = parseInt(req.query.pageNo) || 1;

    let criteria = {};

    const list = await FAQ_MODEL.aggregate([
      {
        $match: criteria,
      },
      {
        $match: {
          stateId: CONST.ACTIVE,
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
    if (list && list[0]?.data.length) {
      await setResponseObject(
        req,
        true,
        FOUND_SUCCESS,
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, NOT_FOUND("FAQ"), []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

module.exports = faq;
