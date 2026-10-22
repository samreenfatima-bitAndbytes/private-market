/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

// import user model
let { USER } = require("../model/userModel");
let USERLOGINLOG = require("../model/userLogModel");
let { CONST } = require("../../../helpers/constant");
let nodemailer = require("../../../helpers/nodemailer");
let setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
// import multer for file uploads
let dotenv = require("dotenv");
const {
  NOT_AUTHORISED,
  INCORRECT_PWD,
  ERROR_UPDATE,
  ACTIVE_SUCCESS,
  DELETED_SUCCESS,
  DELETE_SUCCESS,
  SELECT_USERS_ACTIVATE,
  ACTIVATE_SUCCESS,
  NOT_FOUND,
  FOUND,
  INVALID,
  NOTACTIVE,
  ERROR_TOKEN,
  LOGIN_SUCCESS,
  UNVERIFIED,
  INACTIVE_SUCCESS,
  FOUND_SUCCESS,
  ERROR_LOGIN,
  PASSWORD_CHANGED,
  SUCCESS,
  SAVE_FAILED,
  SELECT_USERS_DELETE,
  DELETE_FAIL,
  NOT_EXISTS,
  PASSWORD_CANNNOT_SAME,
  GENERAL_MESSAGE,
} = require("../../../middleware/responseMessages");
const {
  getHashPassword,
  generateOTP,
  comparePasswords,
} = require("../../../middleware/commonFunction");
const { HTTP } = require("../../../helpers/http-status-code");
const { default: mongoose } = require("mongoose");
const responseMessages = require("../../../middleware/responseMessages");
const { Notification } = require("../../notification/model/notification.model");
const { customer, paymentIntent } = require("../../../helpers/stripe");
const { CATEGORY } = require("../../category/model/category.model");
const { cms, PAGE_MODEL } = require("../../cms/model/page.model");
const { Payment } = require("../../payment/model/payment.model");
const { ORDER } = require("../../order/model/order.model");
const { CART } = require("../../cart/model/cart.model");

dotenv.config();

let _user = {};
/**connecting to mongodb GridFSBucket */
let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();

/*
USER SIGNUP/ REGISTRATION
*/
_user.signup = async (req, res, next) => {
  try {
    let data = req.body;
    data.email = data.email.toLowerCase();
    if (!data.email || !data.password) {
      await setResponseObject(req, false, "Field cannot be empty");
      next();
    } else {
      // check if user already exists with same email
      let userExists = await USER.findOne({ email: data.email });
      let mobileExists = null;
      if (data.mobile) {
        mobileExists = await USER.findOne({ mobile: data.mobile });
      }
      if (userExists) {
        await setResponseObject(
          req,
          false,
          "This Email has already been taken."
        );
        next();
      } else if (mobileExists) {
        await setResponseObject(
          req,
          false,
          "This Number has  already been taken."
        );
        next();
      } else {
        // store hashed password in user model key
        data.password = await getHashPassword(data.password);
        var randomNumber = generateOTP();
        data.email = data.email.toLowerCase();
        data.otp = randomNumber;
        //creating customer id for stripe for user
        let fullName = data?.firstName + " " + data?.lastName;
        let stripeRes = await customer(fullName, data.email);
        if (stripeRes?.statusCode == 200) {
          data.customerId = stripeRes?.data?.id;
        }
        //save data in user model
        let saveData = await new USER(data).save();

        let signupUser = await USER.findById({ _id: saveData._id }).select(
          "-password -token -otp"
        );
        if (!signupUser) {
          await setResponseObject(req, false, SAVE_FAILED);
          next();
        } else {
          signupUser.password = undefined;
          await nodemailer.signUp(
            signupUser.email,
            signupUser.fullName || "user",
            randomNumber
          );
          await setResponseObject(
            req,
            true,
            "User registered successfully",
            signupUser
          );
          next();
        }
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
USER LOGIN 
*/
_user.signin = async (req, res, next) => {
  try {
    let data = req.body;
    data.email = data.email.toLowerCase();
    let findUser = await USER.findOne({ email: data.email });
    if (!findUser) {
      // !WHEN FAILED
      // ?Logging Login data
      data.loginAt = Date.now();
      data.failedReason = INVALID("Email");
      data.state = CONST.FAILED;
      let ip = req.socket.localAddress;
      data.userIP = ip.split(":")[3];
      await USERLOGINLOG.create(data);
      await setResponseObject(
        req,
        false,
        "User not registered with this email account"
      );
      next();
    } else if (
      (await comparePasswords(req.body.password, findUser.password)) === false
    ) {
      await setResponseObject(
        req,
        false,
        "You have entered incorrect password",
        findUser
      );
      next();
    } else if (findUser.isVerified == CONST.UNVERIFIED) {
      data.user = findUser._id;
      data.loginAt = Date.now();
      data.failedReason = UNVERIFIED;
      data.state = CONST.FAILED;
      let ip = req.socket.localAddress;
      data.userIP = ip.split(":")[3];
      await USERLOGINLOG.create(data);
      await setResponseObject(req, true, UNVERIFIED, findUser);
      next();
    } else if (
      findUser.state == CONST.INACTIVE ||
      findUser.state == CONST.DELETED ||
      findUser.state == CONST.BAN
    ) {
      // !WHEN FAILED
      // ?Logging Login data
      data.user = findUser._id;
      data.loginAt = Date.now();
      data.failedReason = NOTACTIVE;
      data.state = CONST.FAILED;

      let ip = req.socket.localAddress;
      data.userIP = ip.split(":")[3];
      await USERLOGINLOG.create(data);
      await setResponseObject(req, false, NOT_AUTHORISED);
      next();
    } else {
      let passwordMatch = await bcrypt.compare(
        data.password,
        findUser.password
      );
      if (!passwordMatch) {
        // !WHEN FAILED
        // ?Logging Login data
        data.user = findUser._id;
        data.loginAt = Date.now();
        data.failedReason = INCORRECT_PWD;
        data.state = CONST.FAILED;

        let ip = req.socket.localAddress;
        data.userIP = ip.split(":")[3];

        await USERLOGINLOG.create(data);

        await setResponseObject(req, false, "Invalid login credentials.");

        next();
      } else {
        let token_Data = {
          email: findUser.email,
          userId: findUser._id,
          roleId: findUser.roleId,
        };

        // create token from token data passed
        let token = jwt.sign(token_Data, process.env.JWT_SECRET);

        // ??WHEN SUCCESS
        // ??Logging Login data

        data.user = findUser._id;
        data.loginAt = Date.now();
        data.state = CONST.SUCCESS;

        let ip = req.ip;
        data.userIP = ip.split(":")[3];

        await USERLOGINLOG.create(data);
        //update last Visit Time
        await USER.findOneAndUpdate(
          { _id: findUser._id },
          { lastVisitTime: Date.now(), token: token },
          { new: true }
        );

        if (!token) {
          data.user = findUser._id;
          data.loginAt = Date.now();
          data.failedReason = ERROR_TOKEN;
          data.state = CONST.FAILED;

          let ip = req.socket.localAddress;
          data.userIP = ip.split(":")[3];

          await USERLOGINLOG.create(data);

          await setResponseObject(req, false, ERROR_LOGIN);
          next();
        } else {
          findUser = await USER.findOne({ email: data.email }).select(
            "-password  -otp"
          );
          const cartList = await CART.deleteMany({ createdBy: findUser._id });
          await setResponseObject(req, true, LOGIN_SUCCESS, findUser);
          next();
        }
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * users logout api
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
_user.logout = async (req, res, next) => {
  try {
    await USER.updateOne(
      { _id: req.userId },
      {
        $set: {
          token: "",
        },
      }
    );
    return res.status(HTTP.SUCCESS).send({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/* 
ADD USER BY Admin and Company
*/
_user.addUser = async (req, res, next) => {
  try {
    let data = req.body;
    data.password = process.env.DEFAULT_PWD;
    // store hashed password in user model key
    data.password = await getHashPassword(data.password);
    let userExists = await USER.findOne({
      email: data.email.toLowerCase(),
    });

    if (userExists) {
      await setResponseObject(
        req,
        false,
        "User is already registered with this email address"
      );
      next();
    } else {
      if (req.file) {
        data.profileImgId = req.file.id;
      }
      data.email = req.body.email.toLowerCase();
      data.createdBy = req.userId;
      let saveUser = await USER.create(data);
      if (!saveUser) {
        await setResponseObject(req, false, SAVE_FAILED);
        next();
      } else {
        await setResponseObject(
          req,
          true,
          "User saved successfully, default password is user@123",
          saveUser
        );
        await nodemailer.addUser(saveUser.email, process.env.DEFAULT_PWD);
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
EDIT USER'S OWN PROFILE
*/
_user.profile = async (req, res, next) => {
  try {
    const findUser = await USER.findById({ _id: req.userId });

    let notificationCount = await Notification.find({
      to: req.userId,
      isSeen: false,
    }).countDocuments();
    findUser.unReadNotificationCount = notificationCount;
    findUser.password = undefined;
    if (findUser) {
      await setResponseObject(req, true, FOUND_SUCCESS("Profile"), findUser);
      next();
    } else {
      await setResponseObject(req, false, "No Data found", "");
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
EDIT USER'S OWN PROFILE
*/
_user.editOwnProfile = async (req, res, next) => {
  try {
    let data = req.body;
    if (req.file) {
      data.profileImgId = req.file.id;
    }
    //save location if provided
    if (data.longitude && data.latitude) {
      data.location = {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      };
    }
    let findUser = await USER.findOne({ _id: req.userId });

    if (req.file && findUser.profileImgId) {
      //deleting previous image from bucket and chunks
      await bucket.delete(findUser.profileImgId);
    }
    data.isProfileCompleted = true;
    let updateProfile = await USER.findOneAndUpdate({ _id: req.userId }, data, {
      new: true,
    });

    if (!updateProfile) {
      await setResponseObject(req, false, ERROR_UPDATE);
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "Profile updated successfully",
        updateProfile
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/* 
SOFT DELETE USER 
*/
_user.updateState = async (req, res, next) => {
  try {
    let data = req.body;

    if (data.state == CONST.ACTIVE) {
      let updateState = await USER.findOneAndUpdate(
        { _id: req.params.id },
        { state: CONST.ACTIVE },
        { new: true }
      );

      if (!updateState) {
        await setResponseObject(req, false, "User state update fail");
        next();
      } else {
        await setResponseObject(req, true, ACTIVE_SUCCESS, updateState);
        next();
      }
    } else if (data.state == CONST.DELETED) {
      let updateState = await USER.findOneAndUpdate(
        { _id: req.params.id },
        { state: CONST.DELETED },
        { new: true }
      );

      if (!updateState) {
        await setResponseObject(req, false, "User state update fail");
        next();
      } else {
        await setResponseObject(req, true, DELETED_SUCCESS, updateState);
        next();
      }
    } else if (data.state == CONST.INACTIVE) {
      let updateState = await USER.findOneAndUpdate(
        { _id: req.params.id },
        { state: CONST.INACTIVE },
        { new: true }
      );

      if (!updateState) {
        await setResponseObject(req, false, "User state update fail");
        next();
      } else {
        await setResponseObject(req, true, INACTIVE_SUCCESS, updateState);
        next();
      }
    } else if (data.state == CONST.BAN) {
      let updateState = await USER.findOneAndUpdate(
        { _id: req.params.id },
        { state: CONST.BAN },
        { new: true }
      );

      if (!updateState) {
        await setResponseObject(req, false, "User state update fail");
        next();
      } else {
        await setResponseObject(
          req,
          true,
          "User blocked successfully",
          updateState
        );
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
SOFT DELETE MULTIPLE USERS -body:{arr:[]}
*/

_user.deleteMultipleUsers = async (req, res, next) => {
  try {
    let data = req.body;
    if (data.arr.length == 0) {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: SELECT_USERS_DELETE,
      });
    } else {
      let deleteUsers = await USER.updateMany(
        { _id: { $in: data.arr } },
        { state: CONST.DELETED },
        { new: true }
      );

      if (deleteUsers) {
        await setResponseObject(req, true, DELETE_SUCCESS("User"));
        next();
      } else {
        await setResponseObject(req, false, ERROR_UPDATE);
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
ACTIVATE MULTIPLE USERS
*/

_user.activateMultipleUsers = async (req, res, next) => {
  try {
    let data = req.body;
    if (data.arr.length == 0) {
      await setResponseObject(req, false, SELECT_USERS_ACTIVATE);
      next();
    } else {
      let activateUsers = await USER.updateMany(
        { _id: { $in: data.arr } },
        { state: CONST.ACTIVE },
        { new: true }
      );

      if (activateUsers) {
        await setResponseObject(req, true, ACTIVATE_SUCCESS("User"));
        next();
      } else {
        await setResponseObject(req, false, ERROR_UPDATE);
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
GET ALL USERS
*/
_user.getUsers = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
    let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

    let filter = {};

    switch (req.query.state) {
      case "1":
        filter = {
          state: CONST.ACTIVE, // 1 => ACTIVE
        };
        break;

      case "2":
        filter = {
          state: CONST.INACTIVE, // 2 => INACTIVE
        };
        break;

      case "3":
        filter = {
          state: CONST.DELETED, // 3 => DELETED
        };
        break;
      case "4":
        filter = {
          state: CONST.BAN, // 4 => DELETED
        };
        break;
      default:
        filter = {};
    }

    let criteria = {};

    switch (req.query.roleId) {
      case "2":
        criteria = {
          roleId: CONST.SENDER,
        };
        break;

      case "3":
        criteria = {
          roleId: CONST.COMPANY,
        };
        break;

      case "4":
        criteria = {
          roleId: CONST.DRIVER,
        };
        break;

      default:
        criteria = {};
    }

    let searchFilter = {};

    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.$or = [
        {
          fullName: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
              : "",
            $options: "i",
          },
        },
        {
          email: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
              : "",
            $options: "i",
          },
        },
      ];
    }

    let getUsers = await USER.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $match: {
          roleId: { $ne: CONST.ADMIN },
        },
      },
      {
        $match: filter,
      },
      {
        $match: criteria,
      },
      {
        $match: searchFilter,
      },
      {
        $project: {
          password: 0,
          token: 0,
          __v: 0,
        },
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [{ $count: "count" }],
        },
      },
    ]);

    if (getUsers && getUsers[0]?.data?.length) {
      await setResponseObject(
        req,
        true,
        FOUND("User list"),
        getUsers[0].data,
        getUsers[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, NOT_FOUND("Users"), []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
GET SINGLE USER DETAIL
*/

_user.getUserById = async (req, res, next) => {
  try {
    let getUser = await USER.findById({ _id: req.params.id }).select(
      "-password"
    );

    if (getUser) {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: FOUND("Record"),
        data: getUser,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: NOT_FOUND("Record"),
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
EDIT USER'S PROFILE
*/

_user.editUserProfile = async (req, res, next) => {
  try {
    let payload = req.body;
    payload.isProfileCompleted = true;
    if (req.file) {
      payload.profileImgId = req.file.id;
    }
    let findUser = await USER.findOne({ _id: req.params.id });
    if (req.file && findUser.profileImgId) {
      //deleting previous image from bucket and chunks
      await bucket.delete(findUser.profileImgId);
    }

    let updateProfile = await USER.findOneAndUpdate(
      { _id: req.params.id },
      payload,
      {
        new: true,
      }
    );

    if (!updateProfile) {
      return res.status(CONST.failureStatus).send({
        success: false,
        message: ERROR_UPDATE,
      });
    } else {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: "Profile updated successfully",
        data: updateProfile,
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
GET USERS BASED ON STATE 
*/

_user.getUsersByState = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || CONST.page;
    let limit = parseInt(req.query.limit) || CONST.PAGE_LIMIT;

    if (req.params.state == "All") {
      var getUsers = await USER.find()
        .skip(limit * (page - CONST.page))
        .limit(limit)
        .sort({ createdAt: CONST.MINUS_ONE });
    } else {
      var getUsers = await USER.find({ state: req.params.state })
        .skip(limit * (page - CONST.page))
        .limit(limit)
        .sort({ createdAt: CONST.MINUS_ONE });
    }

    if (!getUsers) {
      return res.status(CONST.failureStatus).send({
        success: true,
        message: NOT_FOUND("User"),
      });
    } else {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: FOUND("User"),
        data: getUsers,
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
FORGOT PASSWORD
*/
_user.forgotPassword = async (req, res, next) => {
  try {
    let data = req.body;
    let findUser = await USER.findOne({ email: req.body.email });
    if (!findUser) {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: NOT_EXISTS("Email"),
      });
    } else {
      const otp = generateOTP();

      const updateOtp = await USER.findOneAndUpdate(
        { email: data.email },
        { otp: otp },
        { new: true }
      ).select("-password -otp -token");

      if (updateOtp) {
        await nodemailer.forgotPassword(findUser.email, findUser.fullName, otp);
        return res.status(HTTP.SUCCESS).send({
          success: true,
          message: "For reset password otp send on your email",
          data: updateOtp,
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: "Error occur when send otp",
        });
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
VERIFY OTP
*/
_user.verifyOtp = async (req, res, next) => {
  try {
    const data = req.body;
    const findUser = await USER.findOne({ email: data.email.toLowerCase() });

    if (findUser?.otp == parseInt(data.otp)) {
      const payload = {
        userId: findUser._id,
        email: findUser.email,
        roleId: findUser.roleId,
      };
      const token = await jwt.sign(payload, process.env.JWT_SECRET);
      const updateObj = {
        isVerified: 1,
        state: 1,
        token,
      };
      const updateUser = await USER.findOneAndUpdate(
        { email: data.email.toLowerCase() },
        updateObj,
        { new: true }
      ).select("-password -otp");
      if (updateUser) {
        if (token) {
          return res.status(HTTP.SUCCESS).send({
            success: true,
            message: "OTP verified successfully",
            data: updateUser,
            token: token,
          });
        } else {
          return res.status(HTTP.BAD_REQUEST).send({
            success: false,
            message: "Something went wrong",
          });
        }
      } else {
        return res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: "Invalid otp",
        });
      }
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "Invalid otp",
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
RESEND OTP
*/
_user.resendOtp = async (req, res, next) => {
  try {
    const data = req.body;
    let email = data?.email?.toLowerCase();
    const findUser = await USER.findOne({ email: email });

    if (!findUser) {
      await setResponseObject(req, false, "User not found");
      next();
    } else {
      const otp = generateOTP();
      data.otp = otp;

      const updateOtp = await USER.findOneAndUpdate({ email: email }, data, {
        new: true,
      }).select("-password -otp -token");

      if (updateOtp) {
        const sendMail = await nodemailer.resendOtp(
          findUser.email,
          findUser.fullName,
          otp
        );

        return res.status(HTTP.SUCCESS).send({
          success: true,
          message: "The OTP has been send to your email",
          data: updateOtp,
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: "Error occur when send resend otp",
        });
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
RESTORE PASSWORD
*/
_user.restorePassword = async (req, res, next) => {
  try {
    const data = req.body;

    const hash = await bcrypt.hash(
      data.password,
      parseInt(process.env.SALT_ROUNDS)
    );
    data.password = hash;
    const restorePassword = await USER.findByIdAndUpdate(
      { _id: req.userId },
      data,
      { new: true }
    );
    if (restorePassword) {
      await nodemailer.forgotPassword(findUser.email, findUser.username, otp);
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: "Password restore successfully",
        data: restorePassword,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "Password restore failed",
        data: restorePassword,
      });
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
CHANGE PASSWORD
*/

_user.changePassword = async (req, res, next) => {
  try {
    let data = req.body;
    let findUser = await USER.findOne({ _id: req.userId });

    if (req.body.oldPassword) {
      let validOldPassword = await bcrypt.compare(
        data.oldPassword,
        findUser.password
      );
      if (validOldPassword) {
        console.log("validated");
      } else {
        return res.status(400).send({ message: "Old password doesn't match" });
      }
    }

    let comparePassword = await bcrypt.compare(
      data.password,
      findUser.password
    );

    if (comparePassword) {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: PASSWORD_CANNNOT_SAME,
      });
    } else {
      let hash = await bcrypt.hash(
        data.password,
        parseInt(process.env.SALT_ROUNDS)
      );

      data.password = hash;

      let updatePassword = await USER.findOneAndUpdate(
        { _id: req.userId },
        { password: data.password },
        { new: true }
      );

      if (updatePassword) {
        return res.status(HTTP.SUCCESS).send({
          success: true,
          message: req.body.oldPassword
            ? "Password changed successfully"
            : PASSWORD_CHANGED,
          data: updatePassword,
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: ERROR_UPDATE,
        });
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
CHANGE USER STATUS
*/

_user.changeUserStatus = async (req, res, next) => {
  try {
    let users = await USER.findOne({ _id: req.params.id });
    if (!users) {
      return res.status(400).send({
        statusCode: 400,
        success: false,
        message: "User account is not exit",
      });
    }

    let record = await USER.findOneAndUpdate(
      { _id: req.params.id },
      { state: CONST.ACTIVE, isVerified: CONST.VERIFIED },
      { new: true }
    );

    if (record) {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: responseMessages.UPDATE_SUCCESS("User profile"),
        data: record,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: ERROR_UPDATE,
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
CHANGE USER PASSWORD
*/

_user.changePasswordUser = async (req, res, next) => {
  try {
    let data = req.body;

    let findUser = await USER.findOne({ _id: req.params.id });

    let comparePassword = await bcrypt.compare(
      data.password,
      findUser.password
    );
    if (comparePassword) {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: PASSWORD_CANNNOT_SAME,
      });
    } else {
      let hash = await bcrypt.hash(
        data.password,
        parseInt(process.env.SALT_ROUNDS)
      );
      data.password = hash;

      let updatePassword = await USER.findOneAndUpdate(
        { _id: req.params.id },
        { password: data.password },
        { new: true }
      );

      if (updatePassword) {
        return res.status(HTTP.SUCCESS).send({
          success: true,
          message: PASSWORD_CHANGED,
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: ERROR_UPDATE,
        });
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
MARK USER AS BANNED, DELETED, INACTIVE
*/

_user.updateUserState = async (req, res, next) => {
  try {
    let updateUserState = await USER.findOneAndUpdate(
      { _id: req.params.id },
      { state: req.body.state },
      { new: true }
    );

    if (!updateUserState) {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: ERROR_UPDATE,
      });
    } else {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: FOUND("User"),
        data: getUsers,
      });
    }
  } catch (err) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
GET ALL USERS LOGIN LOGS
*/

_user.getLoginLogs = async (req, res, next) => {
  try {
    let filter = {};

    let page = parseInt(req.query.page) || CONST.page;
    let limit = parseInt(req.query.limit) || CONST.PAGE_LIMIT;

    if (req.query.filter && req.query.filter !== "undefined") {
      filter = {
        $or: [
          {
            userIP: {
              $regex: req.query.filter ? req.query.filter : "",
              $options: "i",
            },
          },
          {
            state: {
              $regex: req.query.filter ? req.query.filter : "",
              $options: "i",
            },
          },
          {
            failedReason: {
              $regex: req.query.filter ? req.query.filter : "",
              $options: "i",
            },
          },
        ],
      };
    }

    let loginLogs = await USERLOGINLOG.find(filter)
      .skip(limit * (page - CONST.page))
      .limit(limit)
      .populate({
        path: "user",
        select: "-password",
      })
      .sort({ loginAt: CONST.MINUS_ONE });

    let count = await USERLOGINLOG.find(filter).countDocuments();

    if (!loginLogs) {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: NOT_FOUND("Record"),
      });
    } else {
      await setResponseObject(
        req,
        true,
        FOUND("Api logs"),
        loginLogs,
        count,
        page,
        limit
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
DELETE LOGIN LOGS
*/

_user.deleteLoginLogs = async (req, res, next) => {
  try {
    let deleteLogs = await USERLOGINLOG.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deleteLogs) {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: DELETE_FAIL,
      });
    } else {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: DELETE_SUCCESS("Record"),
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
GET USERS REGISTERED MONTHLY
*/

_user.getMonthlyRegisteredUsers = async (req, res, next) => {
  try {
    let userStats = await USER.aggregate([
      {
        $match: { state: CONST.ACTIVE },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: {
            $sum: CONST.ONE,
          },
        },
      },
    ]);

    if (userStats) {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: FOUND("Record"),
        data: userStats,
      });
    } else {
      return res.status(CONST.failureStatus).send({
        success: false,
        message: NOT_FOUND("Record"),
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
GET TOTAL COUNT FOR USERS, LOGIN HISTORY, LOGS, EMAILS
*/
_user.getTotalCount = async (req, res, next) => {
  try {
    let customers = await USER.find({ roleId: CONST.SENDER }).countDocuments();
    let company = await USER.find({ roleId: CONST.COMPANY }).countDocuments();
    let driver = await USER.find({ roleId: CONST.DRIVER }).countDocuments();
    let bookings = 0;

    let response = {};
    response.customers = customers || 0;
    response.company = company || 0;
    response.driver = driver || 0;
    response.bookings = bookings || 0;

    if (response) {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: FOUND("Record"),
        data: response,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: NOT_FOUND("Record"),
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_user.getAdminDashboardGraphs = async (req, res, next) => {
  try {
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const collections = ["users", "orders"];
    const result = [];

    for (const month of allMonths) {
      const monthlyCounts = [month];

      for (const collectionName of collections) {
        const collection = mongoose.connection.collection(collectionName);
        let currentYear = req.params.year
          ? req.params.year
          : new Date().getFullYear();
        let startDate = new Date(`${month} 01, ${currentYear}`);
        let endDate = new Date(`${month} 31, ${currentYear}`);

        const query = { createdAt: { $gte: startDate, $lt: endDate } };

        let count;
        if (collectionName === "users") {
          count = await USER.countDocuments({
            roleId: CONST.SENDER,
            ...query,
          });
          monthlyCounts.push(count || 0);

          count = await USER.countDocuments({
            roleId: CONST.COMPANY,
            ...query,
          });
          monthlyCounts.push(count || 0);

          count = await USER.countDocuments({
            roleId: CONST.DRIVER,
            ...query,
          });
          monthlyCounts.push(count || 0);
        } else if (collectionName === "orders") {
          count = await ORDER.countDocuments(query);
          monthlyCounts.push(count || 0);
        }
      }

      result.push(monthlyCounts);
    }
    return res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
CONTACT-US FORM
*/

_user.contactUs = async (req, res, next) => {
  try {
    let data = req.body;
    let from = data.from;
    let subject = data.subject;
    let text = data.text;

    await nodemailer.contactUs(from, subject, text);

    return res.status(HTTP.SUCCESS).send({
      success: true,
      message: GENERAL_MESSAGE(
        "Your query has been successfully, we will contact you soon"
      ),
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
SEND MAIL
*/

_user.sendMail = async (req, res, next) => {
  try {
    let data = req.body;
    let to = data.to;
    let subject = data.subject;
    let text = data.text;

    let sendMail = await nodemailer.sendMail(to, subject, text);

    return res.status(HTTP.SUCCESS).send({
      success: true,
      message: GENERAL_MESSAGE("Mail sent"),
      data: sendMail,
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
GET EMAILS
*/
_user.emailList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
    let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

    let filter = {};

    switch (req.query.state) {
      case "0":
        filter = {
          stateId: CONST.FAILED,
        };
        break;

      case "1":
        filter = {
          stateId: CONST.COMPLETED,
        };
        break;

      default:
        break;
    }

    let searchFilter = {};

    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        $or: [
          {
            from: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            to: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            subject: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
        ],
      };
    }

    let SCHEDULEDEmail = await EMAILLOG.aggregate([
      {
        $match: filter,
      },
      {
        $match: searchFilter,
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

    const totalCount = SCHEDULEDEmail[0]?.count[0]?.count;

    if (SCHEDULEDEmail && SCHEDULEDEmail[0].data.length) {
      await setResponseObject(
        req,
        true,
        FOUND("Email list"),
        SCHEDULEDEmail[0].data,
        SCHEDULEDEmail[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: NOT_FOUND("Email list"),
        data: [],
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
DELETE ALL EMAILS LOGS
*/

_user.deleteAllEmailLog = async (req, res, next) => {
  try {
    const data = req.body;

    var idArr = data.id.split(",");
    for (let i = 0; i < idArr.length; i++) {
      var deleteEmailLog = await EMAILLOG.findByIdAndDelete({ _id: idArr[i] });
    }

    if (deleteEmailLog) {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: "Email logs deleted successfully",
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: DELETE_FAIL("Record"),
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
GET EMAILS VIEW
*/
_user.emailDetails = async (req, res, next) => {
  try {
    let emailView = await EMAILLOG.findById({ _id: req.params.id });
    if (emailView) {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: FOUND("Email details"),
        data: emailView,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: NOT_FOUND("Email details not"),
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
GET MONTHLY ERROR LOGS
*/

_user.getMonthlyErrorLogs = async (req, res, next) => {
  try {
    let errorLogStats = await LOGS.aggregate([
      {
        $match: { state: CONST.ACTIVE },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: {
            $sum: CONST.ONE,
          },
        },
      },
    ]);

    if (errorLogStats) {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: FOUND("Record"),
        data: errorLogStats,
      });
    } else {
      return res.status(CONST.failureStatus).send({
        success: false,
        message: NOT_FOUND("Record"),
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
DELETE SCHEDULED EMAILS
*/

_user.deleteEmail = async (req, res, next) => {
  try {
    let deleteEmail = await EMAILLOG.findOneAndDelete({ _id: req.params.id });

    if (deleteEmail) {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: DELETE_SUCCESS("Record"),
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: DELETE_FAIL,
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * users delete api
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
_user.deleteUser = async (req, res, next) => {
  try {
    let user = await USER.updateOne(
      { _id: req.userId },
      {
        $set: {
          state: CONST.DELETED,
        },
      }
    );
    if (user) {
      return res.status(HTTP.SUCCESS).send({
        success: false,
        message: "Your account has been deleted successfully",
        data: {},
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "Something Went Wrong",
        data: {},
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * users delete api
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
_user.notifyMe = async (req, res, next) => {
  try {
    let user = await USER.findById({ _id: req.userId });
    user.isNotify = !user.isNotify;
    let result = await user.save();
    result.password = undefined;
    if (result) {
      return res.status(HTTP.SUCCESS).send({
        success: false,
        message: "Data Updated Successfully",
        data: result,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "Something Went Wrong",
        data: {},
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * users delete api
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
_user.dashboardCount = async (req, res, next) => {
  try {
    let userCount = await USER.countDocuments({ roleId: { $ne: CONST.ADMIN } });
    let cmsCount = await PAGE_MODEL.countDocuments({
      stateId: { $ne: CONST.DELETED },
    });
    let paymentCount = await Payment.countDocuments({
      stateId: { $ne: CONST.DELETED },
    });
    let orderCount = await ORDER.countDocuments({
      stateId: { $ne: CONST.DELETED },
    });
    return res.status(HTTP.SUCCESS).send({
      message: "Dashboard count found successfully! ",
      success: true,
      data: { userCount, cmsCount, paymentCount, orderCount },
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};
/**
 * users delete api
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
_user.graphData = async (req, res, next) => {
  try {
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const collections = ["users", "pages", "orders", "payments"];
    const result = [];

    for (const month of allMonths) {
      const monthlyCounts = [month];

      for (const collectionName of collections) {
        let currentYear = req.params.year
          ? req.params.year
          : new Date().getFullYear();

        const lastDay = new Date(
          currentYear,
          allMonths.indexOf(month) + 1,
          0
        ).getDate();

        const query = {
          createdAt: {
            $gte: new Date(`${month} 01, ${currentYear}`),
            $lte: new Date(`${month} ${lastDay}, ${currentYear}`),
          },
        };
        let count;
        if (collectionName === "users") {
          count = await USER.countDocuments({
            roleId: { $ne: CONST.ADMIN },
            ...query,
          });
          monthlyCounts.push(count || 0);
        } else if (collectionName === "pages") {
          count = await PAGE_MODEL.countDocuments(query);
          monthlyCounts.push(count || 0);
        } else if (collectionName === "orders") {
          count = await ORDER.countDocuments({
            stateId: { $ne: CONST.DELETED },
            ...query,
          });
          monthlyCounts.push(count || 0);
        } else if (collectionName === "payments") {
          count = await Payment.countDocuments(query);
          monthlyCounts.push(count || 0);
        }
      }

      result.push(monthlyCounts);
    }
    return res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = _user;
