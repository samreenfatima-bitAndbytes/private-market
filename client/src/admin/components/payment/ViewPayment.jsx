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
import { Col, Container, Row, Table } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSlider from "../../../hooks/useSlider";
import { adminViewPayment } from "../../../services/AdminServices";
import { constant } from "../../../utils/constant";
import Sidebar from "../../sidebar/Sidebar";
import AdminFooter from "../AdminFooter";

const ViewPayment = () => {
  const isSlider = useSlider();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: paymentView } = useQuery({
    queryKey: ["paymentView", { id }],
    queryFn: async () => {
      const res = await adminViewPayment(id);
      return res.data?.data;
    },
  });
  return (
    <>
      <div className="mainbox">
        <Sidebar />
        <div className={isSlider ? "body-content close" : "body-content open"}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mainhead mb-0">
              <Link to="/admin/dashboard" className="bread_color">
                Home
              </Link> / Payment Details
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
                  <h2 className="mainhead mb-0">User Details</h2>
                  <Col xl={12}>
                    <Table responsive bordered>
                      <tbody>
                        <tr>
                          <th>First name</th>
                          <td>{paymentView?.userDetails?.firstName}</td>
                        </tr>
                        <tr>
                          <th>Last name</th>
                          <td>{paymentView?.userDetails?.lastName}</td>
                        </tr>
                        <tr>
                          <th>({constant.EURO})Total csv price</th>
                          <td>
                            {constant.EURO}
                            {Number(paymentView?.amount)?.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <th>Created On </th>
                          <td>
                            {moment(paymentView?.createdAt).format("LLL")}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            </Container>
          </section>

          <section className="inner-wrap">
            <Container fluid className="px-0">
              <div className="custom-card">
                <h1 className="mainhead mb-0">Product list</h1>
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th>Product Name </th>

                      <th>({constant.EURO}) price</th>
                      <th>Created On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentView?.productDetails?.length > 0 ? (
                      paymentView?.productDetails?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{data?.productName ?? ""}</td>
                            <td>{constant.EURO}{Number(data?.price)?.toLocaleString()}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center">
                          Data Not Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Container>
          </section>
        </div>
        <AdminFooter />
      </div>
    </>
  );
};

export default ViewPayment;
