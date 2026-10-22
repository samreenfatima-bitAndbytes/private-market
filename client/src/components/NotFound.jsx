/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./notfound.scss";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Container fluid>
      <div className="not-found">
        <div className="not_found" data-text={404}>
          <img src={"/not-found.gif"} />
        </div>
        <h1 className="mainhead mb-0">404 Not Found</h1>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="theme-btn btn-md"
        >
          Go to Home
        </button>
      </div>
    </Container>
  );
};

export default NotFound;
