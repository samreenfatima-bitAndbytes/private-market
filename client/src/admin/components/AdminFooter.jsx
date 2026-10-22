/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import useSlider from "../../hooks/useSlider";

const AdminFooter = () => {
  const isSlider = useSlider();
  return (
    <>
      <section
        className={isSlider ? "admin-footer close" : "admin-footer open"}
      >
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <p className="mb-0">
              Copyright &copy; {new Date().getFullYear()}&nbsp;
               
                <Link
                  to="#"
                  target="_blank"
                  className="text-decoration-underline "
                >
                  Hotopics Unipessoal Lda. 
                </Link>
                &nbsp; All Rights Reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AdminFooter;
