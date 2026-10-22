/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const { setResponseObject } = require("../../../middleware/commonFunction");
const { CONST } = require("../../../helpers/constant");
const { CONTACTUS, shipmentFeedback } = require("../model/contactUs.model");
const mongoose = require("mongoose");
const responseMessages = require("../../../middleware/responseMessages");

const contact = {
  /**
   * Add contact
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  add: async (req, res, next) => {
    try {
      const data = req.body;

      const saveContactUs = await CONTACTUS.create(data);
      if (saveContactUs) {
        await setResponseObject(
          req,
          true,
          "We have received your inquiry. We appreciate you for your interest in our services. Our team will get back to you soon."
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
  },

  /**
   * Get all contactus List
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  list: async (req, res, next) => {
    try {
      let search = req.query.search;
      let state = req.query.state;
      let pageNo = parseInt(req.query.pageNo) || 1;
      let pageLimit = parseInt(req.query.pageLimit) || 10;

      let filter = {};
      switch (state) {
        case "1": // ACTIVE
          filter = {
            stateId: CONST.NEW,
          };
          break;

        case "2": // INACTIVE
          filter = {
            stateId: CONST.REPLIED,
          };
          break;

        default:
      }
      let searchFilter = {};
      if (search && search !== "undefined") {
        searchFilter = {
          $or: [
            {
              fullName: {
                $regex: search
                  ? search
                  : "".replace(new RegExp("\\\\", "g"), "\\\\"),
                $options: "i",
              },
            },
            {
              email: {
                $regex: search
                  ? search
                  : "".replace(new RegExp("\\\\", "g"), "\\\\"),
                $options: "i",
              },
            },
          ],
        };
      }

      const list = await CONTACTUS.aggregate([
        {
          $match: searchFilter,
        },
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
      if (list && list[0].data.length) {
        await setResponseObject(
          req,
          true,
          "Contactus list found successfully",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Contactus list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Get contactus details
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  view: async (req, res, next) => {
    try {
      const contactusDetails = await CONTACTUS.findOne({
        _id: req.params.id,
      });
      if (contactusDetails) {
        await setResponseObject(
          req,
          true,
          "Contactus details found successfully",
          contactusDetails
        );
        next();
      } else {
        await setResponseObject(req, false, "Contactus details not found");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Delete contactus api
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  delete: async (req, res, next) => {
    try {
      let objectIds = req.body.id.map((i) => new mongoose.Types.ObjectId(i));
      var result = await CONTACTUS.deleteMany({ _id: { $in: objectIds } });
      if (result) {
        await setResponseObject(req, true, "Contact us deleted");
        next();
      } else {
        await setResponseObject(req, false, "Contact us not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },
};

module.exports = contact;
