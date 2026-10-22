/*
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { FAVOURITE } = require("../model/favourite.model");

module.exports = class favourite {
  /**
   * Add property in wishlist
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  addFavourite = async (req, res, next) => {
    try {
      const data = req.body;

      data.createdBy = req.userId;
      const resp =
        data.isFavourite == CONST.TRUE
          ? "Property add in favourite list"
          : "Property remove from favourite list";

      const isExist = await FAVOURITE.findOne({
        $and: [
          { createdBy: req.userId },
          { propertyId: data.propertyId },
          { isFavourite: 1 },
        ],
      });

      if (!isExist) {
        const addFavourite = await FAVOURITE.create(data);
        if (addFavourite) {
          await setResponseObject(req, true, resp, addFavourite);
          next();
        } else {
          await setResponseObject(
            req,
            true,
            "Property not added in favourite list",
            addFavourite
          );
          next();
        }
      } else {
        const updateData = await FAVOURITE.findByIdAndDelete({
          _id: isExist._id,
        });
        if (updateData) {
          await setResponseObject(req, true, resp);
          next();
        } else {
          await setResponseObject(
            req,
            false,
            "Property not removed from favourite list"
          );
          next();
        }
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /**
   * MY WISHLIST
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  myFavouriteList = async (req, res, next) => {
    try {
      let pageNo = parseInt(req.query.pageNo) || 1;
      let pageLimit = parseInt(req.query.pageLimit) || 10;

      let sortFilter = {};
      switch (req.query.sort) {
        case "1":
          sortFilter = {
            "propertyDetails.updatedAt": -1, // Recent updated property
          };
          break;

        case "2":
          sortFilter = {
            "propertyDetails.updatedAt": 1, // Least updated property
          };
          break;

        case "3":
          sortFilter = {
            "propertyDetails.price": -1, // Higest price
          };
          break;

        case "4":
          sortFilter = {
            "propertyDetails.price": 1, // Lowest price
          };
          break;

        case "5":
          sortFilter = {
            "propertyDetails.floor": -1, // Higest floor
          };
          break;

        case "6":
          sortFilter = {
            "propertyDetails.floor": 1, // Lowest floor
          };
          break;
        
        case "11":
          sortFilter = {
            "propertyDetails.priceEstimation": -1, // Higest priceEstimation
          };
          break;

        case "12":
          sortFilter = {
            "propertyDetails.priceEstimation": 1, // Lowest priceEstimation
          };
          break;
        
        case "13":
          sortFilter = {
            "propertyDetails.expectedRentalYield": -1, // Higest expectedRentalYield
          };
          break;

        case "14":
          sortFilter = {
            "propertyDetails.expectedRentalYield": 1, // Lowest expectedRentalYield
          };
          break;

        case "15":
          sortFilter = {
            "propertyDetails.daysToSale": -1, // Higest daysToSale
          };
          break;

        case "16":
          sortFilter = {
            "propertyDetails.daysToSale": 1, // Lowest daysToSale
          };
          break;

        case "17":
          sortFilter = {
            "propertyDetails.priceDelta": -1, // Higest priceDelta
          };
          break;

        case "18":
          sortFilter = {
            "propertyDetails.priceDelta": 1, // Lowest priceDelta
          };
          break;

        default:
          sortFilter = {
            createdAt: -1,
          };
      }

      const favouriteList = await FAVOURITE.aggregate([
        {
          $match: {
            $and: [
              { createdBy: new mongoose.Types.ObjectId(req.userId) },
              { isFavourite: CONST.TRUE },
            ],
          },
        },
        {
          $lookup: {
            from: "properties",
            let: { id: "$propertyId" }, // LOCAL FIELD
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                  state: CONST.ACTIVE,
                },
              },
              {
                $lookup: {
                  from: "categories",
                  let: { id: "$categoryId" }, // LOCAL FIELD
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
            ],
            as: "propertyDetails",
          },
        },
        {
          $unwind: {
            path: "$propertyDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            propertyDetails: { $exists: true, $ne: [] },
          },
        },
        {
          $sort: sortFilter,
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
      if (favouriteList && favouriteList[0].data.length) {
        await setResponseObject(
          req,
          true,
          "Favourite list found successfully",
          favouriteList[0].data,
          favouriteList[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Favourite list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };
};
