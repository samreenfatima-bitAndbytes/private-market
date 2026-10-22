/** 
@copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const { setResponseObject } = require("../../../middleware/commonFunction");
const dotenv = require("dotenv");
const { Payment } = require("../model/payment.model");
const mongoose = require("mongoose");
const { USER } = require("../../userService/model/userModel");
const {
  isDummyStripe,
  DEMO_CARD,
  demoCustomerId,
  buildDemoCard,
} = require("../../../helpers/stripeMode");
dotenv.config();

const secret_key = process.env.STRIPE_API_KEY;
const stripe = require("stripe")(secret_key || "sk_test_dummy");

module.exports = class payment_ {
  /**
   * Create card
   * @param {customerId} req.body
   * @param {token} req.body // Get by client
   * @param {*}
   */
  async addCard(req, res, next) {
    try {
      // Local demo — no real Stripe keys required
      if (isDummyStripe()) {
        const cusId = demoCustomerId(req.user);
        const card = buildDemoCard(req.body, cusId);
        const user = await USER.findById(req.userId || req.user._id);
        if (!user) {
          await setResponseObject(req, false, "User not found", "");
          return next();
        }
        if (!user.customerId) user.customerId = cusId;
        if (!Array.isArray(user.demoCards)) user.demoCards = [];
        // Avoid duplicate last4+brand+expiry spam — replace same last4
        user.demoCards = user.demoCards.filter(
          (c) => !(c.last4 === card.last4 && c.brand === card.brand)
        );
        user.demoCards.push(card);
        await user.save();
        req.user.customerId = user.customerId;
        req.user.demoCards = user.demoCards;
        await setResponseObject(req, true, "Card added successfully", card);
        return next();
      }

      let { cardTokenId } = req.body;

      // Ensure Stripe customer exists
      let customerId = req.user.customerId;
      if (!customerId) {
        const created = await stripe.customers.create({
          email: req.user.email,
          name: req.user.fullName || req.user.firstName || "Customer",
        });
        customerId = created.id;
        await USER.findByIdAndUpdate(req.userId || req.user._id, {
          customerId,
        });
        req.user.customerId = customerId;
      }

      const paymentMethod = await stripe.paymentMethods.create({
        type: "card",
        card: {
          token: cardTokenId,
        },
      });

      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      });
      if (paymentMethod) {
        await setResponseObject(
          req,
          true,
          "Card added successfully",
          paymentMethod
        );
        return next();
      } else {
        await setResponseObject(req, false, "Fail to add card", "");
        return next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * List of all cards
   * @param {customerId} req.body
   * @param {*}
   * @param {*}
   */
  async cardList(req, res, next) {
    try {
      if (isDummyStripe()) {
        const user = await USER.findById(req.userId || req.user._id).lean();
        const cards = Array.isArray(user?.demoCards) ? user.demoCards : [];
        await setResponseObject(
          req,
          true,
          cards.length ? "Cards found successfully" : "Cards not found",
          cards
        );
        return next();
      }

      if (!req.user.customerId) {
        await setResponseObject(req, true, "Cards not found", []);
        return next();
      }

      const paymentMethods = await stripe.customers.listPaymentMethods(
        req.user.customerId,
        {
          limit: 5,
        }
      );
      let response = [];
      for (let index = 0; index < paymentMethods.data.length; index++) {
        const element = paymentMethods.data[index];
        var obj = {};
        (obj.id = element.id),
          (obj.object = element.object),
          (obj.customer = element.customer),
          (obj.type = element.type),
          (obj.brand = element.card.brand),
          (obj.country = element.card.country),
          (obj.exp_month = element.card.exp_month),
          (obj.exp_year = element.card.exp_year),
          (obj.last4 = element.card.last4),
          (obj.created = element.created),
          response.push(obj);
      }

      if (response) {
        await setResponseObject(
          req,
          true,
          "Cards found successfully",
          response
        );
        return next();
      } else {
        await setResponseObject(req, true, "Cards not found", []);
        return next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * single Card details
   * @param {customerId} req.body
   * @param {cardId} req.body
   * @param {*}
   */
  async cardDetails(req, res, next) {
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(req.params.id);

      let response = {};
      (response.id = paymentMethod.id),
        (response.responseect = paymentMethod.responseect),
        (response.customer = paymentMethod.customer),
        (response.type = paymentMethod.type),
        (response.brand = paymentMethod.card.brand),
        (response.country = paymentMethod.card.country),
        (response.exp_month = paymentMethod.card.exp_month),
        (response.exp_year = paymentMethod.card.exp_year),
        (response.last4 = paymentMethod.card.last4),
        (response.created = paymentMethod.created);

      if (response) {
        await setResponseObject(
          req,
          true,
          "Card details found successfully",
          response
        );
        return next();
      } else {
        await setResponseObject(req, true, "Card details not found", []);
        return next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * Delete card
   * @param {customerId} req.body
   * @param {cardId} req.body
   * @param {*} next
   */
  async cardUpdate(req, res, next) {
    try {
      let { order_id } = req.body;

      const paymentMethod = await stripe.paymentMethods.update(req.params.id, {
        metadata: {
          order_id: req.body.order_id,
        },
      });
      if (paymentMethod) {
        await setResponseObject(
          req,
          true,
          "Card updated successfully",
          paymentMethod
        );
        return next();
      } else {
        await setResponseObject(req, false, "Card not updated", []);
        return next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * Delete card
   * @param {customerId} req.body
   * @param {cardId} req.body
   * @param {*} next
   */
  async cardDelete(req, res, next) {
    try {
      if (isDummyStripe()) {
        const user = await USER.findById(req.userId || req.user._id);
        if (!user) {
          await setResponseObject(req, false, "User not found", []);
          return next();
        }
        const before = (user.demoCards || []).length;
        user.demoCards = (user.demoCards || []).filter(
          (c) => c.id !== req.params.id
        );
        await user.save();
        await setResponseObject(
          req,
          true,
          before !== user.demoCards.length
            ? "Card deleted successfully"
            : "Card not found",
          { id: req.params.id }
        );
        return next();
      }

      const paymentMethod = await stripe.paymentMethods.detach(req.params.id);
      if (paymentMethod) {
        await setResponseObject(
          req,
          true,
          "Card deleted successfully",
          paymentMethod
        );
        return next();
      } else {
        await setResponseObject(req, false, "Card not deleted", []);
        return next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * Transaction list api
   */
  async transactionList(req, res, next) {
    try {
 

      let pageLimit = parseInt(req.query.pageLimit) || 10;
      let pageNo = parseInt(req.query.pageNo) || 1;

      const transactionList = await Payment.aggregate([
        {
          $lookup: {
            from: "users",
            let: { id: "$paidBy" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
              {
                $project: {
                  _id: 1,
                  firstName: 1,
                  lastName: 1,
                  profileImgId: 1,
                  companyName: 1,
                  state: 1,
                  createdAt: 1,
                },
              },
            ],
            as: "userDetails",
          },
        },
        {
          $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "products",
            let: { id: "$productId" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$id"] },
                },
              },
            ],
            as: "productDetails",
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
      if (transactionList && transactionList[0].data.length) {
        await setResponseObject(
          req,
          true,
          "Payment list found successfully",
          transactionList[0].data,
          transactionList[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Payment list not found");
        next();
      }
    } catch (error) {
      log("error", error);
      await setResponseObject(req, false, error.message);
      next();
    }
  }

  /**
   * View transaction details api
   */
  async transactionView(req, res, next) {
    try {
      const details = await Payment.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $lookup: {
            from: "users",
            let: { id: "$paidBy" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
            ],
            as: "userDetails",
          },
        },
        {
          $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
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
      ]);

      if (details) {
        await setResponseObject(
          req,
          true,
          "Transaction details found successfully",
          details[0]
        );
        next();
      } else {
        await setResponseObject(req, true, "Transaction details not found");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  }
};
