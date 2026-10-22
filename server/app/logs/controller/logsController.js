let { CONST } = require("../../../helpers/constant");
const { Error_Logs, EMAIL_LOGS } = require("../model/logModal");
const { HTTP } = require("../../../helpers/http-status-code");
const LOGIN_HISTORY_MODEL = require("../../userService/model/userLogModel");
const {
  NOT_FOUND,
  FOUND,
  FOUND_SUCCESS,
} = require("../../../middleware/responseMessages");
let { setResponseObject } = require("../../../middleware/commonFunction");

module.exports.errorLogs_ = {
  /**
   * Get all error logs
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  getLogs: async (req, res, next) => {
    try {
      let filter = {};
      let page = parseInt(req.query.pageNo) || CONST.PAGE_NO;
      let limit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;
      if (req.query.filter && req.query.filter !== "undefined") {
        filter = {
          $or: [
            {
              errorCode: {
                $regex: req.query.filter ? req.query.filter : "",
                $options: "i",
              },
            },
            {
              ip: {
                $regex: req.query.filter ? req.query.filter : "",
                $options: "i",
              },
            },
            {
              errorName: {
                $regex: req.query.filter ? req.query.filter : "",
                $options: "i",
              },
            },
          ],
        };
      }

      let getErrorLogs = await Error_Logs.find(filter)
        .skip(limit * (page - CONST.PAGE_NO))
        .limit(limit)
        .sort({ createdAt: -1 });

      let totalErrorLogs = await Error_Logs.countDocuments(filter);

      if (getErrorLogs) {
        await setResponseObject(
          req,
          true,
          FOUND("Error logs list"),
          getErrorLogs,
          totalErrorLogs,
          page,
          limit
        );
        next();
      } else {
        return res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: NOT_FOUND("Error logs list"),
        });
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },

  /**
   * View error details
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  logDetails: async (req, res, next) => {
    try {
      const details = await Error_Logs.findById({ _id: req.params.id });
      if (details) {
        await setResponseObject(
          req,
          true,
          FOUND_SUCCESS("Error log details"),
          details
        );
        next();
      } else {
        await setResponseObject(req, true, NOT_FOUND("Error logs details"));
        next();
      }
    } catch (err) {
      await setResponseObject(req, false, err.message, "");
      next();
    }
  },

  /**
   * Delete error logs
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteLog: async (req, res, next) => {
    try {
      let deleteErrorLog = await Error_Logs.findOneAndDelete({
        _id: req.params.id,
      });

      if (deleteErrorLog) {
        return res.status(HTTP.SUCCESS).send({
          success: true,
          message: "Error log deleted successfully",
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: "Error log not deleted",
        });
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },

  /**
   * Delete all error logs
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteAllErrorLog: async (req, res, next) => {
    try {
      let deleteErrorLog = await Error_Logs.deleteMany({});

      if (deleteErrorLog) {
        return res.status(HTTP.SUCCESS).send({
          success: true,
          message: "All error logs deleted successfully",
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: "All error logs not deleted",
        });
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },
};

module.exports._emailLogs = {
  /**
   * Get all email list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  emailList: async (req, res, next) => {
    try {
      let search = req.query.search;
      let state = req.query.state;
      let typeId = req.query.typeId;
      let page = parseInt(req.query.pageNo || req.body.pageNo) || 1;
      let limit = parseInt(req.query.pageLimit || req.body.pageLimit) || 10;

      let filter = {};
      switch (state) {
        case "1": // SUCCESS
          filter = {
            stateId: CONST.SUCCESS,
          };
          break;

        case "2": // FAILED
          filter = {
            stateId: CONST.FAILED,
          };
          break;
        default:
          break;
      }

      let typeFilter = {};
      switch (typeId) {
        case "1": // SUCCESS
          typeFilter = {
            typeId: CONST.QUERY,
          };
          break;
      }

      let searchFilter = {};
      if (search && search !== "undefined") {
        searchFilter = {
          $or: [
            {
              to: {
                $regex: search
                  ? search
                  : "".replace(new RegExp("\\\\", "g"), "\\\\"),
                $options: "i",
              },
            },
            {
              from: {
                $regex: search
                  ? search
                  : "".replace(new RegExp("\\\\", "g"), "\\\\"),
                $options: "i",
              },
            },
          ],
        };
      }

      const list = await EMAIL_LOGS.aggregate([
        {
          $match: searchFilter,
        },
        {
          $match: typeFilter,
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
            data: [{ $skip: limit * (page - 1) }, { $limit: limit }],
            count: [{ $count: "count" }],
          },
        },
      ]);

      if (list && list[0].data.length) {
        await setResponseObject(
          req,
          true,
          "Email queue list found successfully",
          list[0].data,
          list[0].count[0].count,
          page,
          limit
        );
        next();
      } else {
        await setResponseObject(req, true, "Email queue list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Get email details
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  emailDetails: async (req, res, next) => {
    try {
      const emailDetails = await EMAIL_LOGS.findOne({
        _id: req.params.id,
      });
      if (emailDetails) {
        await setResponseObject(
          req,
          true,
          "Email queue details found",
          emailDetails
        );
        next();
      } else {
        await setResponseObject(req, true, "Email queue details not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Delete email list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteEmail: async (req, res, next) => {
    try {
      var result = await EMAIL_LOGS.findByIdAndDelete({
        _id: req.params.id,
      });

      if (result) {
        await setResponseObject(req, true, "Email queue deleted successfully");
        next();
      } else {
        await setResponseObject(req, false, "Email queue not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },

  /**
   * Delete all email list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteAllEmail: async (req, res, next) => {
    try {
      var result = await EMAIL_LOGS.deleteMany({});
      if (result) {
        await setResponseObject(
          req,
          true,
          "All email queue deleted successfully"
        );
        next();
      } else {
        await setResponseObject(req, false, "Email queue not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },
};

module.exports._loginActivity = {
  /**
   * Get all login history list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  loginHistoryList: async (req, res, next) => {
    try {
      let pageNo = parseInt(req.query.pageNo || req.body.pageNo) || 1;
      let pageLimit = parseInt(req.query.pageLimit || req.body.pageLimit) || 10;

      const list = await LOGIN_HISTORY_MODEL.aggregate([
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
          "Login history list found successfully",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Login history list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Delete Login History
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteAllLoginHistory: async (req, res, next) => {
    try {
      var result = await LOGIN_HISTORY_MODEL.deleteMany({});

      if (result) {
        await setResponseObject(
          req,
          true,
          "Login activity deleted successfully"
        );
        next();
      } else {
        await setResponseObject(req, false, "Login activity not deleted");
        next();
      }
    } catch (error) {
      res;
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },

  /**
   * View login details api
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  viewLoginDetails: async (req, res, next) => {
    try {
      const details = await LOGIN_HISTORY_MODEL.findOne({
        _id: req.params.id,
      });
      if (details) {
        await setResponseObject(
          req,
          true,
          "Login history details found successfully",
          details
        );
        next();
      } else {
        await setResponseObject(req, false, "Login history details not found");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },
};
