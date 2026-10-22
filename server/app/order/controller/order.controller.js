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
const { CART } = require("../../cart/model/cart.model");
const { ORDER } = require("../model/order.model");
const { USER } = require("../../userService/model/userModel");
const { Payment } = require("../../payment/model/payment.model");
const PRODUCT = require("../../product/model/product.model");
const {
  DELETE_SUCCESS,
  UPDATE_FAILED,
} = require("../../../middleware/responseMessages");
const {
  paymentIntent,
  confirmPaymentIntent,
} = require("../../../helpers/stripe");
const {
  isDummyStripe,
  DEMO_CARD,
  demoCustomerId,
} = require("../../../helpers/stripeMode");
const stripe = require("stripe")(
  process.env.STRIPE_API_KEY || "sk_test_dummy"
);
const product = require("../../product/controller/product.controller");
module.exports = class order {
  /**
   * Create order of property
   */
  // createOrder = async (req, res, next) => {
  //   try {
  //     const data = req.body;
  //     data.createdBy = req.userId;
  //     const cartData = await CART.find({ createdBy: req.userId });

  //     const idArr = cartData.map((property) => {
  //       return property.propertyId;
  //     });

  //     data.propertyId = idArr;

  //     const findOrder = await ORDER.findOne({ createdBy: req.userId })
  //       .sort({ createdAt: -1 })
  //       .limit(1);

  //     if (findOrder) {
  //       data.orderId = findOrder.orderId + 1;
  //     } else {
  //       data.orderId = Math.floor(1000 + Math.random() * 9000);
  //     }

  //     data.orderTotal = data.orderTotal;
  //     data.total = data.total;

  //     const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
  //     let findUser = await USER.findOne({ _id: req.userId });

  //     if (req?.body?.cardTokenId) {
  //       const paymentMethod = await stripe.paymentMethods.create({
  //         type: "card",
  //         card: {
  //           token: req?.body?.cardTokenId,
  //         },
  //       });
  //       const paymentMethodData = await stripe.paymentMethods.attach(
  //         paymentMethod.id,
  //         {
  //           customer: findUser.customerId,
  //         }
  //       );
  //       req.body.paymentMethodId = paymentMethodData.id;
  //     }

  //     const payment_intent = await paymentIntent(
  //       data.orderTotal,
  //       req.body.paymentMethodId,
  //       findUser.customerId
  //     );

  //     let confirm_payment_intent = await confirmPaymentIntent(
  //       payment_intent?.data?.id,
  //       "https://private-markets.toxsl.in/"
  //     );

  //     if (confirm_payment_intent?.data) {
  //       const payload = {
  //         paymentIntentId: confirm_payment_intent.data.id,
  //         chargeId: confirm_payment_intent.data.latest_charge,
  //         customerId: req?.user?.customerId,
  //         amount: data.orderTotal,
  //         currency: confirm_payment_intent.data.currency,
  //         paymentMethodId: confirm_payment_intent.data.payment_method,
  //         paidBy: req.userId,
  //         paidTo: findAdmin._id,
  //         propertyId: idArr,
  //         amount: data.orderTotal,
  //         status: confirm_payment_intent.data.status,
  //         insertDate: confirm_payment_intent.data.created,
  //       };

  //       await Payment.create(payload);
  //     }

  //     if (confirm_payment_intent?.data.status == "succeeded") {
  //       const createOrder = await ORDER.create(data);
  //       await setResponseObject(
  //         req,
  //         true,
  //         "Order created successfully",
  //         createOrder
  //       );
  //       next();
  //     } else if (!confirm_payment_intent?.data.status == "succeeded") {
  //       res.status(400).send({
  //         success: false,
  //         message: "Something went wrong while doing payment",
  //       });
  //       next();
  //     }
  //   } catch (error) {
  //     await setResponseObject(req, false, error.message);
  //     next();
  //   }
  // };

  createOrder = async (req, res, next) => {
    try {
      const data = req.body;
      data.createdBy = req.userId;
      const cartData = await CART.find({ createdBy: req.userId });

      let idArr = cartData
        .map((product) => product.productId)
        .filter(Boolean);

      // Fallback: product ids from checkout navigation state
      if (!idArr.length && Array.isArray(req.body.productIds)) {
        idArr = req.body.productIds.filter(Boolean);
      }

      if (!idArr.length) {
        await setResponseObject(
          req,
          false,
          "Your cart is empty. Go back to cart and add a data pack before paying."
        );
        return next();
      }

      data.productId = idArr;
      delete data.productIds;
      delete data.paymentMethodId;
      delete data.cardTokenId;

      const findOrder = await ORDER.findOne({ createdBy: req.userId })
        .sort({ createdAt: -1 })
        .limit(1);

      if (findOrder) {
        data.orderId = findOrder.orderId + 1;
      } else {
        data.orderId = Math.floor(1000 + Math.random() * 9000);
      }

      data.orderTotal = data.orderTotal;
      data.total = data.total;

      const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
      let findUser = await USER.findOne({ _id: req.userId });

      // —— Local demo Stripe (no real keys) ——
      if (isDummyStripe()) {
        const cusId = demoCustomerId(findUser);
        if (!findUser.customerId) {
          findUser.customerId = cusId;
          await findUser.save();
        }
        const paymentMethodId =
          req.body.paymentMethodId || DEMO_CARD.id;
        const now = Math.floor(Date.now() / 1000);
        await Payment.create({
          paymentIntentId: `pi_demo_${now}`,
          chargeId: `ch_demo_${now}`,
          customerId: cusId,
          amount: data.orderTotal,
          currency: "eur",
          paymentMethodId,
          paidBy: req.userId,
          paidTo: findAdmin._id,
          propertyId: [],
          productId: idArr,
          status: "succeeded",
          insertDate: now,
        });
        const createOrder = await ORDER.create(data);
        await CART.deleteMany({ createdBy: req.userId });
        const order = await ORDER.findById({ _id: createOrder._id }).populate({
          path: "productId",
          select: "productName productFile price productImg",
        });
        await setResponseObject(req, true, "Order created successfully", order);
        return next();
      }

      if (!findUser.customerId) {
        await setResponseObject(
          req,
          false,
          "Stripe customer missing. Add a card first or configure STRIPE_API_KEY."
        );
        return next();
      }

      if (req?.body?.cardTokenId) {
        const paymentMethod = await stripe.paymentMethods.create({
          type: "card",
          card: {
            token: req?.body?.cardTokenId,
          },
        });
        const paymentMethodData = await stripe.paymentMethods.attach(
          paymentMethod.id,
          {
            customer: findUser.customerId,
          }
        );
        req.body.paymentMethodId = paymentMethodData.id;
      }

      const payment_intent = await paymentIntent(
        data.orderTotal,
        req.body.paymentMethodId,
        findUser.customerId
      );

      let confirm_payment_intent = await confirmPaymentIntent(
        payment_intent?.data?.id,
        "https://private-markets.toxsl.in/"
      );

      if (confirm_payment_intent?.data) {
        const payload = {
          paymentIntentId: confirm_payment_intent.data.id,
          chargeId: confirm_payment_intent.data.latest_charge,
          customerId: req?.user?.customerId || findUser.customerId,
          amount: data.orderTotal,
          currency: confirm_payment_intent.data.currency,
          paymentMethodId: confirm_payment_intent.data.payment_method,
          paidBy: req.userId,
          paidTo: findAdmin._id,
          propertyId: idArr,
          productId: idArr,
          amount: data.orderTotal,
          status: confirm_payment_intent.data.status,
          insertDate: confirm_payment_intent.data.created,
        };

        await Payment.create(payload);
      }

      if (confirm_payment_intent?.data?.status == "succeeded") {
        const createOrder = await ORDER.create(data);
        await CART.deleteMany({ createdBy: req.userId });
        const order = await ORDER.findById({ _id: createOrder._id }).populate(
          "productId"
        );
        await setResponseObject(req, true, "Order created successfully", order);
        next();
      } else {
        res.status(400).send({
          success: false,
          message:
            confirm_payment_intent?.message ||
            "Something went wrong while doing payment",
        });
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  };

  /**
   * My order list
   */
  orderList = async (req, res, next) => {
    try {
      let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
      let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

      const orderList = await ORDER.aggregate([
        {
          $match: {
            $and: [
              { createdBy: new mongoose.Types.ObjectId(req.userId) },
              { stateId: CONST.ACTIVE },
            ],
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "products",
            let: {
              product_Ids: "$productId", // Assuming productId is an array of ObjectId
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$product_Ids"], // Corrected reference to _id
                  },
                },
              },
            ],
            as: "productDetails",
          },
        },

        {
          $facet: {
            data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
            count: [{ $count: "count" }],
          },
        },
      ]);
      if (orderList && orderList[0].data.length) {
        await setResponseObject(
          req,
          true,
          "Order list found successfully",
          orderList[0].data,
          orderList[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Order list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  };

  /**
   * Order delete
   */
  deleteOrder = async (req, res, next) => {
    try {
      const deleteOrder = await ORDER.findByIdAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
        { stateId: CONST.DELETED },
        { new: true }
      );
      if (deleteOrder) {
        await setResponseObject(req, true, DELETE_SUCCESS("Order"), "");
        next();
      } else {
        await setResponseObject(req, false, UPDATE_FAILED("Order"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /**
   * Admin get all order list
   */
  adminOrderList = async (req, res, next) => {
    try {
      const pageNo = req.query.pageNo || 1;
      const pageLimit = req.query.pageLimit || 10;

      const list = await ORDER.aggregate([
        {
          $match: {
            stateId: { $ne: CONST.DELETED },
          },
        },
        {
          $lookup: {
            from: "products",
            let: { id: "$productId" }, // primary key
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$id"] }, // foriegn key
                },
              },
            ],
            as: "productDetails",
          },
        },
        {
          $lookup: {
            from: "products",
            let: { id: "$productId" }, // primary key
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$id"] }, // foriegn key
                },
              },
            ],
            as: "productDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            let: { id: "$createdBy" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] }, // primary key
                },
              },
            ],
            as: "userDetails",
          },
        },
        {
          $unwind: {
            path: "$userDetails",
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
              { $skip: pageLimit * (pageNo - 1) },
              { $limit: parseInt(pageLimit) },
            ],
            count: [{ $count: "count" }],
          },
        },
      ]);
      if (list && list[0].data.length) {
        await setResponseObject(
          req,
          true,
          "Order list found successfully",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Order list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  };

  /**
   * Order view
   */
  orderView = async (req, res, next) => {
    try {
      const details = await ORDER.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $lookup: {
            from: "properties",
            let: { id: "$propertyId" }, // primary key
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$id"] }, // foriegn key
                },
              },
            ],
            as: "propertyDetails",
          },
        },
        {
          $lookup: {
            from: "products",
            let: { id: "$productId" }, // primary key
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$id"] }, // foriegn key
                },
              },
            ],
            as: "productDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            let: { id: "$createdBy" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] }, // primary key
                },
              },
            ],
            as: "userDetails",
          },
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      if (details) {
        await setResponseObject(
          req,
          true,
          "Order details found successfully",
          details[0]
        );
        next();
      } else {
        await setResponseObject(req, true, "Order details not found");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  };

  /**
   * Download spreadsheet(s) for a paid order
   */
  downloadOrderFiles = async (req, res, next) => {
    try {
      const { downloadProductFiles } = require("../../property/controller/csv.controller");
      const PRODUCT = require("../../product/model/product.model");
      const fs = require("fs");
      const path = require("path");

      const order = await ORDER.findOne({
        _id: req.params.id,
        createdBy: req.userId,
      }).populate({
        path: "productId",
        select: "productName productFile price",
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      let fileIds = (order.productId || [])
        .map((p) => p?.productFile)
        .filter(Boolean)
        .map((id) => String(id));

      // Recover empty orders (cart cleared before pay) — match pack by price
      if (!fileIds.length && order.orderTotal != null) {
        const match = await PRODUCT.findOne({
          price: order.orderTotal,
          productFile: { $ne: null },
          stateId: CONST.ACTIVE,
        }).sort({ updatedAt: -1 });
        if (match?.productFile) {
          fileIds = [String(match.productFile)];
          if (!order.productId?.length) {
            order.productId = [match._id];
            await order.save();
          }
        }
      }

      if (!fileIds.length) {
        // Last-resort Loom demo file from disk
        const sample = path.join(
          __dirname,
          "../../../../client/public/sample-product-data.xlsx"
        );
        if (fs.existsSync(sample)) {
          const outDir = path.join("uploads", "product");
          if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
          const dest = path.join(
            outDir,
            `market-pack-${Date.now()}.xlsx`
          );
          fs.copyFileSync(sample, dest);
          return res.status(200).json({
            success: true,
            message: "File downloaded successfully",
            data: dest.replace(/\\/g, "/"),
          });
        }
        return res.status(404).json({
          success: false,
          message: "No spreadsheet file on this order",
        });
      }

      const mongoose = require("mongoose");
      await downloadProductFiles(fileIds, res, mongoose.connection.db);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message || "Download failed",
      });
    }
  };
};
