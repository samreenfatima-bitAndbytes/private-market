/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import React from "react";
import Profile from "../profile/Profile";
import { Route, Routes } from "react-router-dom";
import ChangePassword from "../password/ChangePassword";
import NotFound from "../components/NotFound";
import Home from "../home/Home";

const CustomerRoute = () => {
  return (
    <Routes>
      {/********************Profile route*********************/}
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/change-password" element={<ChangePassword />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default CustomerRoute;
