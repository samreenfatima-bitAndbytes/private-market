/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { DISTRICT } = require("../models.js/district.model");
const { CONST } = require("../../../helpers/constant");

let districts = {};

districts.districtList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
    let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        title: {
          $regex: req.query.search ? req.query.search : "",
          $options: "i",
        },
      };
    }

    let list = await DISTRICT.aggregate([
      {
        $match: { stateId: { $ne: CONST.DELETED } },
      },
      {
        $match: searchFilter,
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
        "",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports.districts = districts;
