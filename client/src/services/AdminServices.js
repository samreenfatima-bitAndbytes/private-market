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

/************Dashboard count api **************/

export const adminDashboardCounts = async () => {
  return await http.get(`/admin/dashboard/count`);
};

export const adminGraphData = async (year) => {
  return await http.get(`/admin/dashboard/graphData/${year}`);
};

/****************User api************/
export const adminUserList = async (query) => {
  return await http.get(`/admin/user/list`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
      roleId: query?.roleId,
      state: query?.state,
      search: query?.search.trim(),
    },
  });
};

export const adminUserView = async (id) => {
  return await http.get(`/admin/user/view/${id}`);
};

export const adminUserUpdate = async (id, body) => {
  return await http.put(`/admin/user/changeState/${id}`, body);
};

/****************Error log api****************/

export const adminErrorList = async (query) => {
  return await http.get(`/admin/logs/errorList`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const adminErrorDelete = async (id) => {
  return await http.delete(`/admin/logs/delete/${id}`);
};

export const adminErrorAllDelete = async () => {
  return await http.delete(`/admin/logs/deleteAll`);
};

/****************Email log api ***************/
export const adminEmailList = async (query) => {
  return await http.get(`/admin/emaillog/list`, {
    params: {
      state: query?.state,
      search: query?.search,
      pageNo: query?.page,
      pageLimit: query?.limit,
      typeId: query?.typeId,
    },
  });
};

export const adminEmailDelete = async (id) => {
  return await http.delete(`/admin/emaillog/delete/${id}`);
};

export const adminEmailAllDelete = async () => {
  return await http.delete(`/admin/emaillog/deleteAll`);
};

export const adminEmailView = async (id) => {
  return await http.get(`/admin/emaillog/view/${id}`);
};

/******************Login activity api****************/

export const adminLoginList = async (query) => {
  return await http.get(`admin/loginActivity/list`, {
    params: {
      state: query?.state,
      search: query?.search,
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const adminLoginView = async (id) => {
  return await http.get(`/admin/loginActivity/details/${id}`);
};

export const adminLoginAllDelete = async () => {
  return await http.delete(`/admin/loginActivity/deleteAll`);
};

/*****************Cms api******************/
export const adminCmsList = async (query) => {
  return await http.get(`/admin/cms/`, {
    params: {
      state: query?.state,
      search: query?.search,
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const adminAddCms = async (body) => {
  return await http.post(`/admin/cms/add`, body);
};

export const adminCmsView = async (id) => {
  return await http.get(`/admin/cms/detail/${id}`);
};

export const adminUpdateCms = async (id, body) => {
  return await http.put(`/admin/cms/update/${id}`, body);
};

export const adminStatusCms = async (id, body) => {
  return await http.put(`/admin/cms/updateState/${id}`, body);
};

export const adminDeleteCMS = async (id) => {
  return await http.delete(`/admin/cms/delete/${id}`);
};

/**********************Faq api ********************/

export const adminFaqList = async (query) => {
  return await http.get(`/admin/faq/list`, {
    params: {
      state: query?.state,
      search: query?.search,
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const adminAddFaq = async (body) => {
  return await http.post(`/admin/faq/add`, body);
};

export const adminViewFaq = async (id) => {
  return await http.get(`/admin/faq/detail/${id}`);
};

export const adminUpdateFaq = async (id, body) => {
  return await http.put(`/admin/faq/edit/${id}`, body);
};

export const adminFaqStatus = async (body) => {
  return await http.put(`/admin/faq/updateState/${body?.id}`, body);
};

export const adminDeleteFaq = async (id) => {
  return await http.delete(`/admin/faq/delete/${id}`);
};

/**********************contact api*********************/
export const adminContactList = async (query) => {
  return await http.get(`/admin/contactUs/list/`, {
    params: {
      state: query?.state,
      search: query?.search,
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const adminContactView = async (id) => {
  return await http.get(`/admin/contactus/view/${id}`);
};

/****************property type api****************/
export const adminCategoryList = async (query) => {
  return await http.get(`/admin/category/categoryList`, {
    params: {
      search: query?.search,
      pageNo: query?.page,
      pageLimit: query?.limit,
      stateId: query?.stateId,
    },
  });
};

export const adminAddCatgeory = async (body) => {
  return await http.post(`/admin/category/addCategory`, body);
};

export const adminCategoryView = async (id) => {
  return await http.get(`/admin/category/categoryDetails/${id}`);
};

export const adminUpdateCategory = async (id, body) => {
  return await http.put(`/admin/category/editCategory/${id}`, body);
};

export const adminStatusCategory = async (id, body) => {
  return await http.put(`/admin/category/updateCategoryState/${id}`, body);
};

export const adminDeleteCatgeory = async (id) => {
  return await http.delete(`/admin/category/deleteCategory/${id}`);
};

/********************property api *********************/

export const adminPropertyList = async (query) => {
  return await http.get(`/users/property/propertyList`, {
    params: {
      search: query?.search,
      pageNo: query?.page,
      pageLimit: query?.limit,
      stateId: query?.stateId,
    },
  });
};

export const adminPropertyView = async (id) => {
  return await http.get(`/users/property/propertyDetails/${id}`);
};

export const adminUpdatePropertyState = async (body) => {
  return await http.put(`/users/property/updateState`, body);
};

export const getPropertyList = async (query) => {
  return await http.get(`/admin/property/propertyList`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
      search: query?.search,
    },
  });
};

/******************Order api********************/
export const adminOrderList = async (query) => {
  return await http.get(`/admin/order/orderList`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const adminViewOrder = async (id) => {
  return await http.get(`/admin/order/orderView/${id}`);
};

/******************payment api********************/

export const adminPaymentList = async (query) => {
  return await http.get(`/admin/payment/paymentList`, {
    params: {
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const adminViewPayment = async (id) => {
  return await http.get(`/admin/payment/transactionView/${id}`);
};

export const adminAddProduct = async (body) => {
  return await http.post(`/admin/product/add`, body);
};

export const adminUpdateProperty = async (id, body) => {
  return await http.put(`/admin/product/edit/${id}`, body);
};

export const adminViewProduct = async (id) => {
  return await http.get(`/admin/product/details/${id}`);
};

export const adminProductList = async (query) => {
  return await http.get(`/admin/product/list`, {
    params: {
      search: query?.search,
      pageNo: query?.page,
      pageLimit: query?.limit,
    },
  });
};

export const adminStatusProduct = async (id, body) => {
  return await http.put(`/admin/product/updateState/${id}`, body);
};
export const adminDeleteProduct = async (id) => {
  return await http.delete(`/admin/product/delete/${id}`);
};

export const adminDeleteProperty = async (id) => {
  return await http.delete(`/admin/property/delete/${id}`);
};
