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
const { CATEGORY } = require("../../category/model/category.model");
const { PROPERTY } = require("../model/property.model");
const nodemailer = require("../../../helpers/nodemailer");
const moment = require("moment");
const { CART } = require("../../cart/model/cart.model");
const { USER } = require("../../userService/model/userModel");
const { SEARCH } = require("../../search/model/search.model");
const { Notification } = require("../../notification/model/notification.model");

/**connecting to mongodb GridFSBucket */
let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();

module.exports = class product_ {
  /*ADD PROPERTY*/
  add = async (req, res, next) => {
    try {
      const data = req.body;

      data.createdBy = req.userId;

      if (req.files) {
        data.propertyImgId = [];
        req.files.forEach((file) => {
          data.propertyImgId.push(file.id);
        });
      }
      //save location if provided
      if (data.longitude && data.latitude) {
        data.location = {
          type: "Point",
          coordinates: [data.longitude, data.latitude],
        };
      }

      const other_features_real_estate = data.other_features_real_estate
        ?.split(",")
        .map((other_features_real_estate) => other_features_real_estate.trim());
      data.other_features_real_estate = other_features_real_estate;

      const other_features_building = data.other_features_building
        ?.split(",")
        .map((other_features_building) => other_features_building.trim());

      data.other_features_building = other_features_building;

      const condition = data.condition
        ?.split(",")
        .map((condition) => condition.trim());
      data.condition = condition;

      const result = await PROPERTY.create(data);
      if (result) {
        const allSearch = await SEARCH.find();
        allSearch.map(async (data) => {
          if (result.categoryId == data.propertyType) {
            const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
            const findUser = await USER.findOne({
              _id: new mongoose.Types.ObjectId(data.createdBy),
            });
            //send notification
            var notificationBody = {
              from: findAdmin._id,
              to: findUser._id,
              title: `New property added`,
              description: `New property added for ${data.propertyType}`,
            };
            await Notification.create(notificationBody);
            //send mail
            const sendMail = await nodemailer.addProperty(findUser.email);
          } else {
            return;
          }
        });

        await setResponseObject(req, true, ADD_SUCCESS("Property"), result);
        next();
      } else {
        await setResponseObject(req, false, ADD_FAILED("Property"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /* GET ALL PROPERTY */
  list = async (req, res, next) => {
    try {
      const pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
      const pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

      const role = req.roleId == CONST.ADMIN
        ? { state: { $ne: CONST.DELETED } }
        : {
            $and: [
              { state: CONST.ACTIVE },
              { createdBy: { $ne: new mongoose.Types.ObjectId(req.userId) } },
            ],
          };

      const escapeRegex = (value = "") =>
        String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Match "FLAT / APARTMENT" and legacy "FLAT_APARTMENT" / "FLAT APARTMENT"
      let searchFilter = {};
      if (req.query.propertyType && req.query.propertyType !== "undefined") {
        const rawType = String(req.query.propertyType).trim();
        const typePattern = escapeRegex(rawType).replace(
          /[_\s/]+/g,
          "[\\s_/]*"
        );
        searchFilter = {
          type_of_real_estate: { $regex: typePattern, $options: "i" },
        };
      }

      let propertySearch = {};
      const searchRaw =
        req.query.search && req.query.search !== "undefined"
          ? String(req.query.search).trim()
          : "";
      const queryParish =
        req.query.parish && req.query.parish !== "undefined"
          ? String(req.query.parish).trim()
          : "";
      const queryMunicipality =
        req.query.municipality && req.query.municipality !== "undefined"
          ? String(req.query.municipality).trim()
          : "";
      const queryDistrict =
        req.query.district && req.query.district !== "undefined"
          ? String(req.query.district).trim()
          : "";

      if (searchRaw || queryParish || queryMunicipality || queryDistrict) {
        const orClauses = [];

        if (searchRaw) {
          const escaped = escapeRegex(searchRaw);
          if (!searchRaw.includes(",")) {
            // Free-text / district chip: match location fields, street, or name
            orClauses.push(
              { district: { $regex: escaped, $options: "i" } },
              { municipality: { $regex: escaped, $options: "i" } },
              { parish: { $regex: escaped, $options: "i" } },
              { place: { $regex: escaped, $options: "i" } },
              { street: { $regex: escaped, $options: "i" } },
              { name: { $regex: escaped, $options: "i" } }
            );
          } else {
            const [parishPart = "", municipalityPart = "", districtPart = ""] =
              searchRaw.split(",").map((part) => part.trim());
            const placeQuery = escapeRegex(
              `${parishPart.split(" ").slice(-4).join(" ")}, ${municipalityPart}, ${districtPart}`
            ).replace(/\s*,\s*/g, "\\s*,\\s*");

            orClauses.push(
              { street: { $regex: escaped, $options: "i" } },
              { place: { $regex: placeQuery, $options: "i" } },
              { name: { $regex: escaped, $options: "i" } }
            );

            if (parishPart) {
              orClauses.push({ parish: { $regex: escapeRegex(parishPart), $options: "i" } });
            }
            if (municipalityPart) {
              orClauses.push({
                municipality: { $regex: escapeRegex(municipalityPart), $options: "i" },
              });
            }
            if (districtPart) {
              orClauses.push({
                district: { $regex: escapeRegex(districtPart), $options: "i" },
              });
            }
          }
        }

        // Explicit geo params (never use empty $regex — it matches everything)
        const geoAnd = [];
        if (queryParish) {
          geoAnd.push({ parish: { $regex: escapeRegex(queryParish), $options: "i" } });
        }
        if (queryMunicipality) {
          geoAnd.push({
            municipality: { $regex: escapeRegex(queryMunicipality), $options: "i" },
          });
        }
        if (queryDistrict) {
          geoAnd.push({
            district: { $regex: escapeRegex(queryDistrict), $options: "i" },
          });
        }
        if (geoAnd.length === 1) {
          orClauses.push(geoAnd[0]);
        } else if (geoAnd.length > 1) {
          orClauses.push({ $and: geoAnd });
        }

        if (orClauses.length) {
          propertySearch = { $or: orClauses };
        }
      }

      const filters = [];

      if (req.query.minPrice || req.query.maxPrice) {
        filters.push({
          price: {
            ...(req.query.minPrice && { $gte: Number(req.query.minPrice) }),
            ...(req.query.maxPrice && { $lte: Number(req.query.maxPrice) }),
          },
        });
      }
      
      if (req.query.minPriceEstimation || req.query.maxPriceEstimation) {
        filters.push({
          priceEstimation: {
            ...(req.query.minPriceEstimation && { $gte: Number(req.query.minPriceEstimation) }),
            ...(req.query.maxPriceEstimation && { $lte: Number(req.query.maxPriceEstimation) }),
          },
        });
      }
      
      if (req.query.minExpectedRentalYield || req.query.maxExpectedRentalYield) {
        filters.push({
          expectedRentalYield: {
            ...(req.query.minExpectedRentalYield && { $gte: Number(req.query.minExpectedRentalYield) }),
            ...(req.query.maxExpectedRentalYield && { $lte: Number(req.query.maxExpectedRentalYield) }),
          },
        });
      }
      
      if (req.query.minDaysToSale || req.query.maxDaysToSale) {
        filters.push({
          daysToSale: {
            ...(req.query.minDaysToSale && { $gte: Number(req.query.minDaysToSale) }),
            ...(req.query.maxDaysToSale && { $lte: Number(req.query.maxDaysToSale) }),
          },
        });
      }
      
      if (req.query.minPriceDelta || req.query.maxPriceDelta) {
        filters.push({
          priceDelta: {
            ...(req.query.minPriceDelta && { $gte: Number(req.query.minPriceDelta) }),
            ...(req.query.maxPriceDelta && { $lte: Number(req.query.maxPriceDelta) }),
          },
        });
      }

      const addMatch = (field, value) => value && filters.push({ [field]: value });

      addMatch("elevator", req.query.elevator);
      // Condition is stored as string[] — match case-insensitively
      if (req.query.condition && req.query.condition !== "undefined") {
        const parts = String(req.query.condition)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (parts.length) {
          filters.push({
            $or: parts.map((part) => ({
              condition: {
                $regex: `^${escapeRegex(part)}$`,
                $options: "i",
              },
            })),
          });
        }
      }
      
      const addRangeMatch = (field, min, max) => {
        if (min || max) {
          filters.push({
            [field]: {
              ...(min && { $gte: parseInt(min) }),
              ...(max && { $lte: parseInt(max) }),
            },
          });
        }
      };

      addRangeMatch("gross_area", req.query.minSize, req.query.maxSize);
      addRangeMatch("net_area", req.query.minNet, req.query.maxNet);

      ["rooms", "baths", "floor"].forEach(field => {
        if (req.query[field]) {
          const value = parseInt(req.query[field]);
          filters.push({
            [field]: value < 4 ? { $eq: value } : { $gte: 4 },
          });
        }
      });

      ["other_features_real_estate", "other_features_building"].forEach(field => {
        if (req.query[field]) {
          filters.push({
            [field]: { $in: req.query[field].split(",") },
          });
        }
      });

      const sortOptions = {
        "1": { updatedAt: -1 },
        "2": { updatedAt: 1 },
        "3": { price: -1 },
        "4": { price: 1 },
        "5": { floor: -1 },
        "6": { floor: 1 },
        "7": { gross_area: -1 },
        "8": { gross_area: 1 },
        "9": { net_area: -1 },
        "10": { net_area: 1 },
        "11": { priceEstimation: -1 },
        "12": { priceEstimation: 1 },
        "13": { expectedRentalYield: -1 },
        "14": { expectedRentalYield: 1 },
        "15": { daysToSale: -1 },
        "16": { daysToSale: 1 },
        "17": { priceDelta: -1 },
        "18": { priceDelta: 1 },
        default: { createdAt: -1 },
      };

      const sortFilter = sortOptions[req.query.sort] || sortOptions.default;

      const stateFilter = {
        "1": { state: CONST.ACTIVE },
        "2": { state: CONST.INACTIVE },
      }[req.query.state] || {};

      const dateOptions = {
        "1": moment().subtract(48, "hours").toDate(),
        "2": moment().subtract(1, "weeks").toDate(),
        "3": moment().subtract(1, "months").toDate(),
      };

      const dateFilter = req.query.date && { createdAt: { $gte: dateOptions[req.query.date] } } || {};

      let list;
      if(req.roleId == CONST.ADMIN){
        list = await PROPERTY.aggregate([
          { $facet: { data: [{ $skip: pageLimit * (pageNo - CONST.PAGE_NO) }, { $limit: pageLimit }], count: [{ $count: "count" }] } },
        ]);
      }else{
        list = await PROPERTY.aggregate([
          { $match: role },
          { $match: { ...searchFilter, ...propertySearch, ...stateFilter, ...dateFilter, ...filters.length && { $and: filters } } },
          { $lookup: { from: "categories", let: { id: "$categoryId" }, pipeline: [{ $match: { $expr: { $eq: ["$$id", "$_id"] } } }], as: "categoryDetails" } },
          { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
          { $lookup: { from: "favourites", let: { id: "$_id" }, pipeline: [{ $match: { $expr: { $eq: ["$$id", "$propertyId"] }, isFavourite: CONST.TRUE, createdBy: new mongoose.Types.ObjectId(req.userId) } }], as: "favouriteDetails" } },
          { $addFields: { isFavourite: { $cond: { if: { $size: "$favouriteDetails" }, then: 1, else: 0 } } } },
          { $sort: sortFilter },
          { $facet: { data: [{ $skip: pageLimit * (pageNo - CONST.PAGE_NO) }, { $limit: pageLimit }], count: [{ $count: "count" }] } },
        ], {allowDiskUse : true});
      }
      

      if (list && list[0].data.length) {
        await setResponseObject(req, true, FOUND_SUCCESS("Property list"), list[0].data, list[0].count[0].count, pageNo, pageLimit);
      } else {
        await setResponseObject(req, true, NOT_FOUND("Property list"), []);
      }
      next();
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET SINGLE PROPERTY DETAILS*/
  detail = async (req, res, next) => {
    try {
      const details = await PROPERTY.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $lookup: {
            from: "categories",
            let: { id: "$categoryId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
            ],
            as: "categoryDetails",
          },
        },
        {
          $unwind: {
            path: "$categoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "favourites",
            let: { id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$propertyId"] },
                },
              },
            ],
            as: "favouriteDetails",
          },
        },
        {
          $addFields: {
            isFavourite: {
              $cond: {
                if: { $size: "$favouriteDetails" },
                then: 1,
                else: 0,
              },
            },
          },
        },
      ]);
      if (details) {
        await setResponseObject(
          req,
          true,
          FOUND_SUCCESS("Property details"),
          details[0]
        );
        next();
      } else {
        await setResponseObject(req, false, NOT_FOUND("Property details"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*UPDATE PROPERTY*/
  update = async (req, res, next) => {
    try {
      const data = req.body;

      //save location if provided
      if (data.longitude && data.latitude) {
        data.location = {
          type: "Point",
          coordinates: [data.longitude, data.latitude],
        };
      }

      const other_features_real_estate = data.other_features_real_estate
        ?.split(",")
        .map((other_features_real_estate) => other_features_real_estate.trim());
      data.other_features_real_estate = other_features_real_estate;

      const other_features_building = data.other_features_building
        ?.split(",")
        .map((other_features_building) => other_features_building.trim());

      data.other_features_building = other_features_building;

      const condition = data.condition
        ?.split(",")
        .map((condition) => condition.trim());
      data.condition = condition;

      let findProperty = await PROPERTY.findById({
        _id: new mongoose.Types.ObjectId(data.id),
      });

      if (req.files && req.files.length > 0) {
        data.propertyImgId = [];
        req.files.forEach((file) => {
          data.propertyImgId.push(file.id);
        });
        //has to delete previous image also
        if (req.file && findProperty?.propertyImgId) {
          // Check if the file exists
          const file = await bucket
            .find({
              _id: new mongoose.Types.ObjectId(findProperty?.propertyImgId),
            })
            .toArray();
          if (file.length === 0) {
            await setResponseObject(
              req,
              false,
              `File with id ${findProperty?.propertyImgId} not found.`
            );
            next();
          }
          //deleting previous image from bucker and chunks
          await bucket.delete(
            new mongoose.Types.ObjectId(findProperty?.propertyImgId)
          );
        }
      }

      const updateData = await PROPERTY.findByIdAndUpdate(
        { _id: data.id },
        data,
        { new: true }
      );
      if (updateData) {
        await setResponseObject(
          req,
          true,
          UPDATE_SUCCESS("Property"),
          updateData,
          ""
        );
        next();
      } else {
        await setResponseObject(req, false, UPDATE_FAILED("Property"), "");
        next();
      }
    } catch (error) {
      console.log("error", error);
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*UPDATE PROPERTY BY STATE*/
  updateState = async (req, res, next) => {
    try {
      let payload = req.body;
      const findData = await PROPERTY.findById({ _id: req.params.id });
      if (!findData) {
        await setResponseObject(req, true, NOT_FOUND("Property"), "");
        next();
      } else {
        if (payload.state == CONST.ACTIVE) {
          let updateState = await PROPERTY.findByIdAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true }
          );
          if (updateState) {
            await setResponseObject(
              req,
              true,
              "Property active successfully",
              updateState
            );
            next();
          }
          return;
        }
        if (payload.state == CONST.INACTIVE) {
          let updateState = await PROPERTY.findByIdAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true }
          );
          if (updateState) {
            await setResponseObject(
              req,
              true,
              "Property inactive successfully",
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

  /*SOFT DELETE PROPERTY*/
  deleteProperty = async (req, res, next) => {
    try {
      const deleteData = await PROPERTY.findByIdAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
        { state: CONST.DELETED },
        { new: true }
      );
      if (deleteData) {
        await setResponseObject(req, true, DELETE_SUCCESS("Property"), "");
        next();
      } else {
        await setResponseObject(req, false, UPDATE_FAILED("Property"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET MY ALL PROPERTY*/
  myProperty = async (req, res, next) => {
    try {
      let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
      let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

      let list = await PROPERTY.aggregate([
        {
          $match: {
            $and: [
              { createdBy: new mongoose.Types.ObjectId(req.userId) },
              { state: { $ne: CONST.DELETED } },
            ],
          },
        },
        {
          $lookup: {
            from: "categories",
            let: { id: "$categoryId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
            ],
            as: "categoryDetails",
          },
        },
        {
          $unwind: {
            path: "$categoryDetails",
            preserveNullAndEmptyArrays: true,
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
          FOUND_SUCCESS("Property list"),
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, NOT_FOUND("Property list"), []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*SEND QUERY TO PROPERTY OWNER*/
  sendQuery = async (req, res, next) => {
    try {
      const data = req.body;

      const findProperty = await PROPERTY.findById({
        _id: data.id,
      });

      const findAgent = await USER.findById({
        _id: findProperty.createdBy,
      });

      const fullName =
        data.firstName + " ";
      const agentName =
        findAgent.firstName + " " + findAgent.lastName
          ? findAgent.lastName
          : "";

      const sendMail = nodemailer.sendQuery(
        data.email,
        fullName,
        agentName,
        findAgent.email,
        data.mobile,
        data.message,
        findProperty._id
      );
      if (sendMail) {
        await setResponseObject(
          req,
          true,
          "We have received your query. We appreciate you for your interest in our services. Our team will get back to you soon."
        );
        next();
      } else {
        await setResponseObject(req, false, "Query not send");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*Download full property*/
  downloadFull = async (req, res, next) => {
    try {
      let role = {};

      if (req.roleId == CONST.ADMIN) {
        role = {
          state: { $ne: CONST.DELETED },
        };
      } else {
        role = {
          $and: [
            { state: CONST.ACTIVE },
            { createdBy: { $ne: new mongoose.Types.ObjectId(req.userId) } },
          ],
        };
      }

      let searchFilter = {};
      if (req.query.propertyType && req.query.propertyType !== "undefined") {
        searchFilter = {
          categoryId: {
            $regex: req.query.propertyType ? req.query.propertyType : "",
            $options: "i",
          },
        };
      }

      let propertySearch = {};
      if (req.query.search && req.query.search !== "undefined") {
        propertySearch = {
          street: {
            $regex: req.query.search ? req.query.search : "",
            $options: "i",
          },
        };
      }

      let filter = [];

      if (req.query.minPrice && req.query.maxPrice) {
        filter.push({
          $match: {
            $and: [
              {
                price: {
                  $gte: Number(req.query.minPrice),
                },
              },
              {
                price: {
                  $lte: Number(req.query.maxPrice),
                },
              },
            ],
          },
        });
      } else if (req.query.maxPrice) {
        filter.push({
          $match: {
            price: {
              $lte: Number(req.query.maxPrice),
            },
          },
        });
      } else if (req.query.minPrice) {
        filter.push({
          $match: {
            price: {
              $gte: Number(req.query.minPrice),
            },
          },
        });
      }

      if (req.query.elevator) {
        filter.push({
          $match: {
            elevator: req.query.elevator,
          },
        });
      }

      if (req.query.condition) {
        filter.push({
          $match: {
            condition: { $in: req.query.condition.split(",") },
          },
        });
      }

      if (req.query.rooms) {
        let roomsValue = parseInt(req.query.rooms);
        if (roomsValue < 4) {
          filter.push({
            $match: {
              rooms: { $eq: roomsValue },
            },
          });
        } else if (roomsValue == 4) {
          filter.push({
            $match: {
              rooms: { $gte: 4 },
            },
          });
        }
      }

      if (req.query.baths) {
        let bathValue = parseInt(req.query.baths);
        if (bathValue < 4) {
          filter.push({
            $match: {
              baths: { $eq: bathValue },
            },
          });
        } else if (bathValue == 4) {
          filter.push({
            $match: {
              baths: { $gte: 4 },
            },
          });
        }
      }

      if (req.query.floor) {
        let floorValue = parseInt(req.query.floor);
        if (floorValue < 4) {
          filter.push({
            $match: {
              floor: { $eq: floorValue },
            },
          });
        } else if (floorValue == 4) {
          filter.push({
            $match: {
              floor: { $gte: 4 },
            },
          });
        }
      }

      if (req.query.other_features_real_estate) {
        filter.push({
          $match: {
            other_features_real_estate: {
              $in: req.query.other_features_real_estate.split(","),
            },
          },
        });
      }

      if (req.query.other_features_building) {
        filter.push({
          $match: {
            other_features_building: {
              $in: req.query.other_features_building.split(","),
            },
          },
        });
      }

      if (req.query.minSize && req.query.maxSize) {
        filter.push({
          $match: {
            $and: [
              {
                gross_area: {
                  $gte: parseInt(req.query.minSize),
                },
              },
              {
                gross_area: {
                  $lte: parseInt(req.query.maxSize),
                },
              },
            ],
          },
        });
      } else if (req.query.minSize) {
        filter.push({
          $match: {
            gross_area: {
              $gte: parseInt(req.query.minSize),
            },
          },
        });
      } else if (req.query.maxSize) {
        filter.push({
          $match: {
            gross_area: {
              $lte: parseInt(req.query.maxSize),
            },
          },
        });
      }

      if (req.query.minNet && req.query.maxNet) {
        filter.push({
          $match: {
            $and: [
              {
                net_area: {
                  $gte: parseInt(req.query.minNet),
                },
              },
              {
                net_area: {
                  $lte: parseInt(req.query.maxNet),
                },
              },
            ],
          },
        });
      } else if (req.query.minNet) {
        filter.push({
          $match: {
            net_area: {
              $gte: parseInt(req.query.minNet),
            },
          },
        });
      } else if (req.query.maxNet) {
        filter.push({
          $match: {
            net_area: {
              $lte: parseInt(req.query.maxNet),
            },
          },
        });
      }

      let sortFilter = {};
      switch (req.query.sort) {
        case "1":
          sortFilter = {
            updatedAt: -1, // Recent updated property
          };
          break;

        case "2":
          sortFilter = {
            updatedAt: 1, // Least updated property
          };
          break;

        case "3":
          sortFilter = {
            price: -1, // Higest price
          };
          break;

        case "4":
          sortFilter = {
            price: 1, // Lowest price
          };
          break;

        case "5":
          sortFilter = {
            floor: -1, // Higest floor
          };
          break;

        case "6":
          sortFilter = {
            floor: 1, // Lowest floor
          };
          break;

        case "7":
          sortFilter = {
            gross_area: -1, // Higest gross area
          };
          break;

        case "8":
          sortFilter = {
            gross_area: 1, // Lowest gross area
          };
          break;

        case "9":
          sortFilter = {
            net_area: -1, // Higest net area
          };
          break;

        case "10":
          sortFilter = {
            net_area: 1, // Lowest net area
          };
          break;

        default:
          sortFilter = {
            createdAt: -1,
          };
      }

      let stateFilter = {};
      switch (req.query.state) {
        case "1":
          stateFilter = {
            state: CONST.ACTIVE,
          };
          break;
        case "2":
          stateFilter = {
            state: CONST.INACTIVE,
          };
          break;
        default:
      }

      let dateFilter = {};
      switch (req.query.date) {
        case "1":
          const last48Hours = moment().subtract(48, "hours").toDate();
          dateFilter = {
            createdAt: { $gte: last48Hours }, // Find documents created in the last 48 hours
          };
          break;
        case "2":
          const lastWeek = moment().subtract(1, "weeks").toDate();
          dateFilter = {
            createdAt: { $gte: lastWeek }, // Find documents created in the last week
          };
          break;
        case "3":
          const lastMonth = moment().subtract(1, "months").toDate();
          dateFilter = {
            createdAt: { $gte: lastMonth }, // Find documents created in the last month
          };
          break;
        default:
      }

      let list = await PROPERTY.aggregate([
        {
          $match: role,
        },
        {
          $match: dateFilter,
        },
        {
          $match: stateFilter,
        },
        {
          $match: searchFilter,
        },
        {
          $match: propertySearch,
        },
        {
          $lookup: {
            from: "categories",
            let: { id: "$categoryId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
            ],
            as: "categoryDetails",
          },
        },
        {
          $unwind: {
            path: "$categoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "favourites",
            let: { id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$propertyId"] },
                  isFavourite: CONST.TRUE,
                  createdBy: new mongoose.Types.ObjectId(req.userId),
                },
              },
            ],
            as: "favouriteDetails",
          },
        },
        {
          $addFields: {
            isFavourite: {
              $cond: {
                if: { $size: "$favouriteDetails" },
                then: 1,
                else: 0,
              },
            },
          },
        },
        ...filter,
        {
          $sort: sortFilter,
        },
      ]);

      if (list && list.length > 0) {
        const propertyIds = list.map((property) => property._id);

        const properties = await PROPERTY.find({ _id: { $in: propertyIds } });

        properties.forEach((e) => {
          const createCart = CART.create({
            csvPrice: e.csvPrice,
            propertyId: e._id,
            createdBy: req.userId,
          });
        });
      }

      if (list.length) {
        await setResponseObject(req, true, "", list);
        next();
      } else {
        await setResponseObject(req, true, "", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  };

  /*Send email*/
  sendEmailQuery = async (req, res, next) => {
    try {
      const data = req.body;
      const findProperty = await PROPERTY.findById({ _id: data.id });
      const findAgent = await USER.findById({ _id: findProperty.createdBy });

      const fullName = data.firstName + data.lastName;

      const sendMail = await nodemailer.sendQuery(
        fullName,
        findAgent.firstName,
        findAgent.email,
        data.email,
        data.mobile,
        data.message
      );

      await setResponseObject(
        req,
        true,
        "We appreciate you for your interest in our property. We will get back to you soon."
      );
      next();
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*Delete product*/
  deleteProperty = async (req, res, next) => {
    try {
      const deleteProperty = await PROPERTY.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          state: CONST.DELETED,
        }
      );

      if (deleteProperty) {
        await setResponseObject(req, true, "Property deleted successfully");
        next();
      } else {
        await setResponseObject(req, false, "Property not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };
};
