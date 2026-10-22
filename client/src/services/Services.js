/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import axios from "axios";
import { store } from "../redux/store";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

http.interceptors.request.use(
  function (config) {
    const token = store.getState()?.auth?.details?.token;
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const logOut = async () => {
  return await http.post(`/auth/logout`);
};

export const customerEditProfile = async (body) => {
  return await http.put(`/auth/editProfile`, body);
};

export const changePassword = async (body) => {
  return await http.put(`/auth/changePassword`, body);
};

export const signIn = async (body) => {
  return await http.post(`/auth/signin`, body);
};

export const register = async (body) => {
  return await http.post(`/auth/signup`, body);
};

export const forgotPassword = async (body) => {
  return await http.post(`/auth/forgotPassword`, body);
};

export const verifyOTP = async (body) => {
  return await http.put(`/auth/verifyOtp`, body);
};
export const resendOTP = async (body) => {
  return await http.put(`/auth/resendOtp`, body);
};

export const staticPages = async (typeId) => {
  return await http.get(`/pages/cms/${typeId}`);
};

export const customerFaqList = async (query) => {
  return await http.get(`/pages/faq`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const customerAddContact = async (body) => {
  return await http.post(`/contactUs/add`, body);
};

export const agentActiveProperty = async () => {
  return await http.get(`/users/category/activeCategory`);
};

export const agentAddProperty = async (body) => {
  return await http.post(`/users/property/addProperty`, body);
};

export const agentUpdateProperty = async (body) => {
  return await http.put(`/users/property/updateProperty`, body);
};

export const propertyListingAuth = async (query) => {
  console.log("queryqueryqueryquery", query)
  return await http.get(`/users/property/propertyListAuth`, {
    params: {
      parish: query?.parish,
      municipality: query?.municipality,
      district: query?.district,
      search: query?.search,
      pageNo: query?.page,
      pageLimit: query?.limit,
      propertyType: query?.propertyType,
      minPrice: query?.minPrice,
      maxPrice: query?.maxPrice,
      minSize: query?.minSize,
      maxSize: query?.maxSize,
      rooms: query?.rooms,
      baths: query?.baths,
      condition: query?.condition,
      other_features_real_estate: query?.other_features_real_estate,
      other_features_building: query?.other_features_building,
      floor: query?.floor,
      date: query?.date,
      sort: query?.sort,
      minNet: query?.minNet,
      maxNet: query?.maxNet,
      lng: query?.lat,
      lat: query?.lng,
      minPriceEstimation: query?.minPriceEstimation,
      maxPriceEstimation: query?.maxPriceEstimation,
      minExpectedRentalYield: query?.minExpectedRentalYield,
      maxExpectedRentalYield: query?.maxExpectedRentalYield,
      minDaysToSale: query?.minDaysToSale,
      maxDaysToSale: query?.maxDaysToSale,
      minPriceDelta: query?.minPriceDelta,
      maxPriceDelta: query?.maxPriceDelta,
    },
  });
};

export const agentPropertyView = async (id) => {
  return await http.get(`/users/property/propertyDetails/${id}`);
};

export const agentPropertyDelete = async (id) => {
  return await http.delete(`/users/property/deleteProperty/${id}`);
};

export const getPropertySearch = async (query) => {
  return await http.get(`/property/propertyList`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
      search: (query?.search || "").trim(),
      propertyType: query?.propertyType,
      maxPrice: query?.maxPrice,
      minPrice: query?.minPrice,
      maxSize: query?.maxSize,
      minSize: query?.minSize,
      condition: query?.condition,
      other_features_real_estate: query?.other_features_real_estate,
      other_features_building: query?.other_features_building,
      rooms: query?.rooms,
      floor: query?.floor,
      baths: query?.baths,
      sort: query?.sort,
      minNet: query?.minNet,
      maxNet: query?.maxNet,
      lng: query?.lng,
      lat: query?.lat,
      parish: query?.parish,
      municipality: query?.municipality,
      district: query?.district,
      minPriceEstimation: query?.minPriceEstimation,
      maxPriceEstimation: query?.maxPriceEstimation,
      minExpectedRentalYield: query?.minExpectedRentalYield,
      maxExpectedRentalYield: query?.maxExpectedRentalYield,
      minDaysToSale: query?.minDaysToSale,
      maxDaysToSale: query?.maxDaysToSale,
      minPriceDelta: query?.minPriceDelta,
      maxPriceDelta: query?.maxPriceDelta,
    },
  });
};

export const propertySearchView = async (id) => {
  return await http.get(`/property/details/${id}`);
};

export const customerPropertyList = async (query) => {
  return await http.get(`/users/property/myProperty`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const contactCsvDownload = async (id, body) => {
  return await http.get(`/users/csv/exportPropertyCsv/${id}`, body);
};

export const customerAddFavourite = async (body) => {
  return await http.post(`/users/favourite/addFavourite`, body);
};

export const customerFavouriteList = async (query) => {
  return await http.get(`/users/favourite/favouriteList`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
      sort: query?.sort,
    },
  });
};

export const customerSaveSearch = async (body) => {
  return await http.post(`/users/search/saveSearch`, body);
};

export const CustomerSendQueryAuth = async (body) => {
  return await http.post(`/users/property/sendPropertyQuery`, body);
};
export const CustomerSendQuery = async (body) => {
  return await http.post(`/property/sendPropertyQuery`, body);
};

export const customerAddCart = async (body) => {
  return await http.post(`/users/cart/addCart`, body);
};

export const customerCartList = async () => {
  return await http.get(`/users/cart/mycarts`);
};

export const customerRemoveCart = async (id) => {
  return await http.delete(`/users/cart/removeCart/${id}`);
};

export const customerSearchList = async (query) => {
  return await http.get(`/users/search/mySearchList`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const customerActiveProperty = async () => {
  return await http.get(`/category/activeCategory`);
};

export const customerCardPayment = async (body) => {
  return await http.post(`/users/order/createOrder`, body);
};

export const customerFileList = async (query) => {
  return await http.get(`/users/order/myOrderList`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const customerFileDelete = async (id) => {
  return await http.delete(`/users/order/deleteOrder/${id}`);
};

export const customerSearchUpdate = async (body) => {
  return await http.put(`/users/search/updateSearch`, body);
};

export const customerSearchDelete = async (id) => {
  return await http.delete(`/users/search/deleteSearch/${id}`);
};

export const customerSearchDisable = async (body) => {
  return await http.put(`/users/search/enableDisable`, body);
};

export const customerNotificationList = async (query) => {
  return await http.get(`/users/notification/myNotification`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const customerDeleteNotification = async () => {
  return await http.delete(`/users/notification/deleteNotification
  `);
};

export const importCsv = async (body) => {
  return await http.post(`/admin/csv/imoprtPropertyCsv`, body);
};

export const customerAddCard = async (body) => {
  return await http.post(`/users/payment/addCard`, body);
};

export const customerCardList = async () => {
  return await http.get(`/users/payment/cardList`);
};

export const customerCardDelete = async (id) => {
  return await http.delete(`/users/payment/deleteCard/${id}`);
};

export const customerOrderCreate = async (body) => {
  return await http.post(`/users/order/createOrder`, body);
};

export const customerOrderDownload = async (orderId) => {
  return await http.get(`/users/order/downloadFiles/${orderId}`);
};

export const customerDownloadFull = async (query) => {
  return await http.get(`/users/property/downloadFull`, {
    params: {
      // pageNo: query?.page,
      // pageLimit: query?.limit,
      search: query?.search,
      propertyType: query?.propertyType,
      maxPrice: query?.maxPrice,
      minPrice: query?.minPrice,
      maxSize: query?.maxSize,
      minSize: query?.minSize,
      condition: query?.condition,
      other_features_real_estate: query?.other_features_real_estate,
      other_features_building: query?.other_features_building,
      rooms: query?.rooms,
      floor: query?.floor,
      baths: query?.baths,
      sort: query?.sort,
      minNet: query?.minNet,
      maxNet: query?.maxNet,
      lng: query?.lng,
      lat: query?.lat,
    },
  });
};

export const customerAllProperty = async (query) => {
  return await http.get(`/users/product/list`, {
    params: {
      search: query?.search,
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const adminStatusProperty = async (id, body) => {
  return await http.put(`/users/property/updateState/${id}`, body);
};

export const activeCategory = async () => {
  return await http.get(`/category/activeCategory`);
};

export const placeList = async (search, pageNo, municiplity = "") => {
  return await http.get(
    `/users/place/list?search=${search}&pageNo=${pageNo}&municipalityId=${municiplity}&pageLimit=${10}`
  );
};

export const municiplityList = async (search, pageNo, districtId = "") => {
  return await http.get(
    `/users/municiplity/list?search=${search}&pageNo=${pageNo}&districtId=${districtId}&pageLimit=${10}`
  );
};

export const districtList = async (search, pageNo) => {
  return await http.get(
    `/users/district/list?search=${search}&pageNo=${pageNo}&pageLimit=${10}`
  );
};

export const productListWithoutAuth = async (query) => {
  return await http.get(`/product/list`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};
