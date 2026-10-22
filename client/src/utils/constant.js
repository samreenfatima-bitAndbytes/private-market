import { t } from "i18next";

/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
export const constant = Object.freeze({
  /************Role*****************/
  ADMIN: 1,
  CUSTOMER: 2,
  REAL_STATE_AGENT: 3,

  /*****************Pagination*****************/

  PAGE_NO_ONE: 1,
  PER_PAGE_TEN: 10,
  PER_PAGE_FIVE: 5,
  PER_PAGE_SIX: 6,
  PER_PAGE_EIGHT: 8,
  PER_PAGE_THREE: 3,
  PER_PAGE_THIRTY: 30,

  /******************Status*******************/

  ACTIVE: 1,
  INACTIVE: 2,
  DELETE: 3,
  REQUEST: 5,
  BLOCK: 4,

  /*****************Cms type******************/

  CMS_ABOUT: 1,
  CMS_TERMS: 2,
  CMS_PRIVACY: 3,
  CMS_COOKIES_POLICY: 5,

  /*****************Login activity status*****************/

  LOGIN: 1,
  LOGIN_FAIL: 2,

  /****************Email queue status*******************/

  EMAIL_SUCCESS: 1,
  EMAIL_FAILED: 2,
  EMAIL_PENDING: 3,

  /******************Contact us status*******************/

  CONTACT_NEW: 0,
  CONTACT_REPLIED: 1,

  /*********************Property Type of flat*******************/

  HOUSE_DETACHED: "FLAT / APARTMENT",
  HOUSE_SEMI_DETACHED: "PENTHOUSE",
  HOUSE_TERRACED: "DUPLEX",
  HOUSE_ANDER: "STUDIO APARTMENT/LOFT",
  HOUSE_SHOP: "SHOP",

  /*********************Property condition*******************/

  PROPERTY_NEED_RENOVATING: "NEEDS RENOVATING",
  PROPERTY_GOOD_CONDITION: "GOOD CONDITION",

  /*********************Property transcation type*******************/

  PROPERTY_SALE: 1,
  PROPERTY_RENTAL: 2,

  /***************Price sign****************/

  EURO: "€",
  DOLLAR: "$",

  /**********Entrance *************/

  ENTRANCE_YES: "1",
  ENTRANCE_NO: "2",

  /***************Lift****************/

  LIFT_YES: "YES",
  LIFT_NO: "NO",

  /***************orientation****************/

  NORTH: "NORTH",
  EAST: "EAST",
  WEST: "WEST",
  SOUTH: "SOUTH",

  /***************Gender*******************/

  MALE: 0,
  FEMALE: 1,
  OTHERS: 3,

  /******************Publication date*****************/

  FILTER_48_WEEK: "1",
  FILTER_LAST_WEEK: "2",
  FILTER_LAST_MONTH: "3",

  /*********************Property sorting***************/

  PROPERTY_RECENT: 1,
  PROPERTY_LEAST: 2,
  PROPERTY_HIGHEST_PRICE: 3,
  PROPERTY_LOWEST_PRICE: 4,
  PROPERTY_HIGHEST_FLOOR: 5,
  PROPERTY_LOWEST_FLOOR: 6,
  PROPERTY_BIGGEST_GROSS: 7,
  PROPERTY_LOWEST_GROSS: 8,
  PROPERTY_BIGGEST_NET: 9,
  PROPERTY_LOWEST_NET: 10,
  PROPERTY_HIGHEST_ESTIMATED_PRICE: 11,
  PROPERTY_LOWEST_ESTIMATED_PRICE: 12,
  PROPERTY_HIGHEST_RENTAL_YIELD: 13,
  PROPERTY_LOWEST_RENTAL_YIELD: 14,
  PROPERTY_MAXIMUM_DAYS_TO_SALE: 15,
  PROPERTY_MINIMUM_DAYS_TO_SALE: 16,
  PROPERTY_HIGHEST_PRICE_DELTA: 17,
  PROPERTY_LOWEST_PRICE_DELTA: 18,

  /*********************Property room***************/

  PROPERTY_ROOM_1: 1,
  PROPERTY_ROOM_2: 2,
  PROPERTY_ROOM_3: 3,
  PROPERTY_ROOM_4: 4,

  /*********************Property bath***************/

  PROPERTY_BATH_1: 1,
  PROPERTY_BATH_2: 2,
  PROPERTY_BATH_3: 3,
  PROPERTY_BATH_4: 4,

  /*********************Property floor***************/

  PROPERTY_FLOOR_1: 1,
  PROPERTY_FLOOR_2: 2,
  PROPERTY_FLOOR_3: 3,
  PROPERTY_FLOOR_4: 4,
});
