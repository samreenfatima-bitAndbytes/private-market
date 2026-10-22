/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import React from "react";
import "./loader.scss";
const Loader = () => {
  return (
    <div className="maindiv">
      <div>
        <div className="loadericon">
          <div className="outerCircle"></div>
          <div className="icon">
            <img alt="" width="10" src={"/vite.svg"} className="logoname" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
