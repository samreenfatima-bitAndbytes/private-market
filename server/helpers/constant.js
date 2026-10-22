/*
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

// constant values set for date check, failure status, crypt token
module.exports.CONST = {
  backupFileName: "backup_",
  FileNAmeSliceFrom: 0,
  FileNAmeSliceTo: 10,
  backupDirPath: "./backupDump/",
  PAGE_NO: 1,
  PAGE_LIMIT: 10,
  ADMIN: 1,
  USER: 2,
  AGENT: 3,
  ACTIVE: 1,
  INACTIVE: 2,
  DELETED: 3,
  BAN: 4,
  MALE: 0,
  FEMALE: 1,
  OTHERS: 2,
  ABOUT: 1,
  TERMS: 2,
  PRIVACY: 3,
  CANCEL_POLICY: 4,
  COOKIES_POLICY: 5,
  SUCCESS: 1,
  PENDING: 3,
  FAILED: 2,
  WEB: 1,
  ANDROID: 2,
  IOS: 3,
  LOGIN: 1,
  LOGIN_FAIL: 2,
  TRUE: 1,
  FALSE: 2,
  SMTP: 1,
  PAYMENT: 2,
  SMS: 3,
  TWILLIO: 1,
  UNIFONIC: 2,
  WALLET: 1,
  ONLINE: 2,
  STRIPE: 1,
  PAYPAL: 2,
  RESOLVE: 2,
  ipSplitParam: 3,
  OPEN: 1,
  GOOD: 1,
  BAD: 2,
  CLOSE: 0,
  ONE_MONTH_IN_SECOND: 2629800,
  THREE_MONTH_IN_SECOND: 7776000,
  OTP_LIMIT: 4,
  NEW: 0,
  REPLIED: 1,
  dateCheck: 1609587250,
  CHAT_TYPE: {
    TEXT: 0,
    LOCATION: 1,
    FILE: 2,
    JSON: 3,
  },
  FILE_TYPE: {
    AUDIO: 0,
    VIDEO: 1,
    IMAGE: 2,
    PDF: 3,
    OTHERS: 4,
  },
  AUTO_CREATED: 1,
  MANUALLY_CREATED: 2,
  // TRUE: 0,
  // FALSE: 1,
  SCHEDULED: 4,
  ONGOING: 5,
  COMPLETED: 6,
  PAID: 1,
  UN_PAID: 2,
  VERIFIED: 1,
  UNVERIFIED: 0,
  VEHICLE: {
    HEAVY: 0,
    LIGHT: 1,
  },
  NOTIFICATION: {
    YES: 0,
    NO: 1,
  },
  NOTIFICATION_STATE: {
    STATE_ID: {
      ACTIVE: 0,
      INACTIVE: 1,
      DELETED: 2,
    },
  },

  MONTHLY: 1,
  QUARTERLY: 2,
  HALF_YEARLY: 3,
  YEARLY: 4,

  BASIC: 0,
  STANDARD: 1,
  PREMIUM: 2,

  SUBSCRIPTION: 0,

  SALE: 1,
  RENTAL: 2,

  PHONE_AND_MESSAGE: 1,
  ONLY_EMAIL: 2,
  ONLY_PHONE: 3,

  FLAT_APARTMENT: 1,
  PENTHOUSE: 2,
  DUPLEX: 3,
  STUDIO: 4,

  NEED_RENOVATING: 1,
  GOOD_CONDITION: 2,

  YES: 1,
  NO: 2,

  // SUCCESS: 4,

  CSV: 1,
  PRODUCT: 2,

  ENABLE: 1,
  DISABLE: 2,

  QUERY:1
};
