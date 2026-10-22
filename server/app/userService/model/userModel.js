let mongoose = require("mongoose");
let SCHEMA = mongoose.Schema;
let { CONST } = require("../../../helpers/constant");
let user = new SCHEMA(
  {
    fullName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
    },
    profileImgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "filesBucket.files",
    },
    dob: {
      type: String,
    },
    about: {
      type: String,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
    },
    token: {
      type: String,
      default: "",
    },
    userIP: {
      type: String,
    },
    roleId: {
      type: Number,
      enum: [CONST.ADMIN, CONST.USER, CONST.AGENT], // 1 => ADMIN, 2 => USER, 3 => AGENT
      default: CONST.USER,
    },
    state: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED, CONST.BAN],
      default: CONST.ACTIVE,
    },
    gender: {
      type: Number,
      enum: [CONST.MALE, CONST.FEMALE, CONST.OTHERS],
      default: CONST.MALE,
    },
    countryCode: {
      type: String,
    },
    companyName: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    postalCode: {
      type: String,
    },
    city: {
      type: Number,
    },
    country: {
      type: Number,
    },
    otp: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Number,
      enum: [CONST.VERIFIED, CONST.UNVERIFIED],
      default: CONST.UNVERIFIED,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    isNotify: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    isNotificationOn: {
      type: Number,
      enum: [CONST.NOTIFICATION.YES, CONST.NOTIFICATION.NO],
      default: CONST.NOTIFICATION.YES,
    },
    accountId: {
      type: String,
    },
    customerId: {
      type: String,
    },
    /** Local / dummy Stripe saved cards (not used with real Stripe keys) */
    demoCards: [
      {
        id: String,
        object: { type: String, default: "payment_method" },
        customer: String,
        type: { type: String, default: "card" },
        brand: String,
        country: { type: String, default: "PT" },
        exp_month: Number,
        exp_year: Number,
        last4: String,
        created: Number,
      },
    ],
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Number,
    },
    occupation: {
      type: String,
    },
    CommercialName: {
      type: String,
    },
    CommercialName: {
      type: String,
    },
    CommercialAddress: {
      type: String,
    },
    emailChecked: {
      type: Boolean,
      default: false,
    },
    terms: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
user.index({ location: "2dsphere" });
module.exports.USER = mongoose.model("user", user);
