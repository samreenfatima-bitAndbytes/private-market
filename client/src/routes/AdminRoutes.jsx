/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import React from "react";
import { Route, Routes } from "react-router-dom";
import AddCms from "../admin/components/Cms/AddCms";
import CmsList from "../admin/components/Cms/CmsList";
import ViewCms from "../admin/components/Cms/ViewCms";
import Contacts from "../admin/components/Contact.jsx/Contacts";
import ViewContactUs from "../admin/components/Contact.jsx/ViewContactUs";
import EmailQueue from "../admin/components/Logger/EmailQueue";
import ErrorLogs from "../admin/components/Logger/ErrorLogs";
import LoginActivity from "../admin/components/Logger/LoginActivity";
import ViewEmailQueue from "../admin/components/Logger/ViewEmailQueue";
import ViewLoginActivity from "../admin/components/Logger/ViewLoginActivity";
import AdminProfile from "../admin/components/adminauth/AdminProfile";
import AdminResetPassword from "../admin/components/adminauth/AdminResetPassword";
import AddFaq from "../admin/components/faq/AddFaq";
import FaqList from "../admin/components/faq/FaqList";
import ViewFaq from "../admin/components/faq/ViewFaq";
import Order from "../admin/components/order/Order";
import ViewOrder from "../admin/components/order/ViewOrder";
import Payment from "../admin/components/payment/Payment";
import ViewPayment from "../admin/components/payment/ViewPayment";
import AddProduct from "../admin/components/product/AddProduct";
import ProductList from "../admin/components/product/ProductList";
import PropertyList from "../admin/components/property/PropertyList";
import PropertyType from "../admin/components/property/PropertyType";
import ViewProperty from "../admin/components/property/ViewProperty";
import ViewPropertyType from "../admin/components/property/ViewPropertyType";
import UserList from "../admin/components/userlist/UserList";
import UserView from "../admin/components/userlist/UserView";
import Dashboard from "../admin/dashboard/Dashboard";
import NotFound from "../components/NotFound";
import ViewProduct from "../admin/components/product/ViewProduct";
import MessageQueue from "../admin/components/Logger/MessageQueue";
import ViewMessage from "../admin/components/Logger/ViewMessage";

const AdminRoutes = () => {
  return (
    <Routes>
      {/**************Admin profile route*******************/}
      <Route path="/profile" element={<AdminProfile />} />
      <Route path="/reset-password" element={<AdminResetPassword />} />

      {/*******************Dashboard route*******************/}
      <Route path="/dashboard" element={<Dashboard />} />

      {/********************User route*********************/}
      <Route path="/user-list" element={<UserList />} />
      <Route path="/view-user/:id" element={<UserView />} />

      {/********************Property route*********************/}
      <Route path="/property-type" element={<PropertyType />} />
      <Route path="/view-property-type/:id" element={<ViewPropertyType />} />

      <Route path="/property-list" element={<PropertyList />} />
      <Route path="/view-property/:id" element={<ViewProperty />} />

      {/********************Product route*********************/}

      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/edit-product/:id" element={<AddProduct />} />
      <Route path="/view-product/:id" element={<ViewProduct />} />
      <Route path="/product-list" element={<ProductList />} />

      {/********************Order route*********************/}

      <Route path="/order-list" element={<Order />} />
      <Route path="/view-order/:id" element={<ViewOrder />} />

      {/********************payment route*********************/}

      <Route path="/payment-list" element={<Payment />} />
      <Route path="/view-payment/:id" element={<ViewPayment />} />

      {/********************Logger route*********************/}
      <Route path="/error-logs" element={<ErrorLogs />} />
      <Route path="/email-queue" element={<EmailQueue />} />
      <Route path="/message-queue" element={<MessageQueue />} />
      <Route path="/view-message/:id" element={<ViewMessage />} />

      <Route path="/email-view/:id" element={<ViewEmailQueue />} />
      <Route path="/login-activity" element={<LoginActivity />} />
      <Route path="/view-login-activity/:id" element={<ViewLoginActivity />} />

      {/********************Cms route*********************/}
      <Route path="/cms-list" element={<CmsList />} />
      <Route path="/add-cms" element={<AddCms />} />
      <Route path="/edit-cms/:id" element={<AddCms />} />
      <Route path="/view-cms/:id" element={<ViewCms />} />

      {/********************Faq route*********************/}
      <Route path="/faq-list" element={<FaqList />} />
      <Route path="/add-faq" element={<AddFaq />} />
      <Route path="/edit-faq/:id" element={<AddFaq />} />
      <Route path="/view-faq/:id" element={<ViewFaq />} />

      {/********************Contact route*********************/}
      <Route path="/contact-list" element={<Contacts />} />
      <Route path="/view-contact/:id" element={<ViewContactUs />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
