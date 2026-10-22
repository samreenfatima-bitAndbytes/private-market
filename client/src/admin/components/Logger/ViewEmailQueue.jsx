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
import { adminEmailView } from "../../../services/AdminServices";
import { constant } from "../../../utils/constant";
import Sidebar from "../../sidebar/Sidebar";
import AdminFooter from "../AdminFooter";

const ViewEmailQueue = () => {
  const { id } = useParams();
  const isSlider = useSlider();
  const navigate = useNavigate();

  const { data: emailDetails } = useQuery({
    queryKey: ["emailDetails", { id }],
    queryFn: async () => {
      const res = await adminEmailView(id);
      return res.data?.data;
    },
  });

  const StatusHandler = (stateId) => {
    if (stateId == constant.EMAIL_SUCCESS) {
      return <Badge bg="success">Success</Badge>;
    } else if (stateId == constant.EMAIL_FAILED) {
      return <Badge bg="danger">Failed</Badge>;
    } else if (stateId == constant.EMAIL_PENDING) {
      return <Badge bg="info">Pending</Badge>;
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
              </Link>
              / Email Queue Details
            </h2>
            <div className="text-end mx-1">
              <button
                type="button"
                className="theme-btn btn-md mb-2"
                onClick={() => navigate(-1)}
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
                    <Table responsive>
                      <tbody>
                        <tr>
                          <th>From</th>
                          <td>{emailDetails?.from}</td>
                        </tr>
                        <tr>
                          <th>To</th>
                          <td>{emailDetails?.to}</td>
                        </tr>
                        <tr>
                          <th>Subject</th>
                          <td>{emailDetails?.subject}</td>
                        </tr>
                        <tr>
                          <th>Created On</th>
                          <td>
                            {moment(emailDetails?.createdAt).format("LLL")}
                          </td>
                        </tr>
                        <tr>
                          <th>Status</th>
                          <td>{StatusHandler(emailDetails?.stateId)}</td>
                        </tr>
                        <tr>
                          <th>Description</th>
                          <td>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: emailDetails?.description,
                              }}
                            />
                          </td>
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

export default ViewEmailQueue;
