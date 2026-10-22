/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import { Badge, Col, Container, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSlider from "../../../hooks/useSlider";
import { adminContactView } from "../../../services/AdminServices";
import { constant } from "../../../utils/constant";
import Sidebar from "../../sidebar/Sidebar";
import AdminFooter from "../AdminFooter";

const ViewContactUs = () => {
  const isSlider = useSlider();
  const navigate = useNavigate();

  const { id } = useParams();
  const { data: contactView } = useQuery({
    queryKey: ["contactView", { id }],
    queryFn: async () => {
      const res = await adminContactView(id);
      return res.data?.data;
    },
  });
  const statusHandler = (stateId) => {
    if (stateId == constant.CONTACT_NEW) {
      return <Badge bg="warning">New</Badge>;
    } else if (stateId == constant.CONTACT_REPLIED) {
      return <Badge bg="success">Reply</Badge>;
    } else {
      return "N/A";
    }
  };

  return (
    <>
      <div className="mainbox">
        <Sidebar />
        <div className={isSlider ? "body-content close" : "body-content open"}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mainhead mb-0">
              <Link to="/admin/dashboard" className="bread_color">
                Home
              </Link> / Contact Us Details
            </h2>
            <div className="text-end mx-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="theme-btn btn-md mb-2"
              >
                Back
              </button>
            </div>
          </div>

          <section className="inner-wrap">
            <Container fluid className="px-0">
              <div className="custom-card">
                <Row>
                  <Col xl={12}>
                    <Table responsive bordered>
                      <tbody>
                        <tr>
                          <th>First name</th>
                          <td>{contactView?.firstName}</td>
                        </tr>
                        <tr>
                          <th>Last name</th>
                          <td>{contactView?.lastName}</td>
                        </tr>
                        <tr>
                          <th>Email address</th>
                          <td>{contactView?.email}</td>
                        </tr>
                        <tr>
                          <th>Message</th>
                          <td>{contactView?.message}</td>
                        </tr>

                        <tr>
                          <th>Created On </th>
                          <td>
                            {moment(contactView?.createdAt).format("LLL")}
                          </td>
                        </tr>
                        <tr>
                          <th>Status</th>
                          <td>{statusHandler(contactView?.stateId)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            </Container>
          </section>
        </div>
        <AdminFooter />
      </div>
    </>
  );
};

export default ViewContactUs;
