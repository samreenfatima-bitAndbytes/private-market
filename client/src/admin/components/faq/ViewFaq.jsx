/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import React from "react";
import useSlider from "../../../hooks/useSlider";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../sidebar/Sidebar";
import moment from "moment";
import { checkAdminState } from "../../../utils/CheckAdminState";
import AdminFooter from "../AdminFooter";
import { constant } from "../../../utils/constant";
import { toastAlert } from "../../../utils/SweetAlert";
import { adminFaqStatus, adminViewFaq } from "../../../services/AdminServices";

const ViewFaq = () => {
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { id } = useParams();
  const { data: viewFaq } = useQuery({
    queryKey: ["viewFaq", { id }],
    queryFn: async () => {
      const res = await adminViewFaq(id);
      return res.data?.data;
    },
  });

  const editMutate = useMutation({
    mutationFn: (payload) =>
      adminFaqStatus({
        id,
        state: payload?.state,
      }),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["viewFaq"] });
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
              </Link> / Faq Details
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
                          <th>Question</th>
                          <td>{viewFaq?.question}</td>
                        </tr>

                        <tr>
                          <th>Answer</th>
                          <td
                            dangerouslySetInnerHTML={{
                              __html: viewFaq?.answer,
                            }}
                          ></td>
                        </tr>
                        <tr>
                          <th>Created On </th>
                          <td>{moment(viewFaq?.createdAt).format("LLL")}</td>
                        </tr>
                        <tr>
                          <th>Status</th>
                          <td>{checkAdminState(viewFaq?.stateId)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  {viewFaq?.stateId === constant.INACTIVE ? (
                    <div className="text-end mt-4 me-3">
                      <button
                        className="theme-btn btn-md mb-2"
                        type="submit"
                        onClick={() => {
                          editMutate.mutate({
                            state: constant.ACTIVE,
                          });
                        }}
                      >
                        Active
                      </button>
                    </div>
                  ) : (
                    <div className="text-end mt-4 me-3">
                      <button
                        className="theme-btn btn-md mb-2"
                        type="submit"
                        onClick={() => {
                          editMutate.mutate({
                            state: constant.INACTIVE,
                          });
                        }}
                      >
                        In-Active
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </section>
        </div>
        <AdminFooter />
      </div>
    </>
  );
};

export default ViewFaq;
