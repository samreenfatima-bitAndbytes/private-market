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
import Cart from "../Cart/Cart";
import MySearches from "../Search/MySearches";
import NotFound from "../components/NotFound";
import Home from "../home/Home";
import MyFavorites from "../myfavorites/MyFavorites";
import Notification from "../notification/Notification";
import ChangePassword from "../password/ChangePassword";
import AddProperty from "../realstateagent/AddProperty";
import AgentProfile from "../realstateagent/AgentProfile";
import AllPropertyDetail from "../realstateagent/AllPropertyDetail";
import AllPropertyList from "../realstateagent/AllPropertyList";
import EditProperty from "../realstateagent/EditProperty";
import FileList from "../realstateagent/FileList";
import PropertyList from "../realstateagent/PropertyList";
import ViewProperty from "../realstateagent/ViewProperty";
import CheckoutForm from "../realstateagent/checkoutForm/CheckoutForm";
import AllProductList from "../Cart/AllProductList";

const RealAuthRoute = () => {
  return (
    <Routes>
      {/********************profile route*********************/}
      <Route path="/home" element={<Home />} />
      <Route path="/agent-profile" element={<AgentProfile />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/add-property" element={<AddProperty />} />
      <Route path="/edit-property/:id" element={<EditProperty />} />
      <Route path="/view-property/:id" element={<ViewProperty />} />
      <Route path="/property-list" element={<PropertyList />} />
      <Route path="/property-listing" element={<AllPropertyList />} />
      <Route path="/property-detail/:id" element={<AllPropertyDetail />} />
      <Route path="/favourites" element={<MyFavorites />} />
      <Route path="/save-search" element={<MySearches />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/product-list" element={<AllProductList />} />
      <Route path="/payment" element={<CheckoutForm/>} />
      <Route path="/file-list" element={<FileList />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RealAuthRoute;
