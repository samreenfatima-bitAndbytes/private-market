/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import React, { useState } from "react";
import { adminPaymentList } from "../../../services/AdminServices";
import useSlider from "../../../hooks/useSlider";
import { Link, useNavigate } from "react-router-dom";
import { constant } from "../../../utils/constant";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../sidebar/Sidebar";
import { Container, Table } from "react-bootstrap";
import moment from "moment";
import { FaEye } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import AdminFooter from "../AdminFooter";

const Payment = () => {
  const isSlider = useSlider();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageNo: constant.PAGE_NO_ONE,
    pageLimit: constant.PER_PAGE_TEN,
  });

  const { data: paymentList } = useQuery({
    queryKey: [
      "payment-List",
      {
        page: pagination.pageNo,
        limit: pagination.pageLimit,
      },
    ],
    queryFn: async ({ queryKey }) => {
      const [_key, query] = queryKey;
      const resp = await adminPaymentList(query);
      if (resp && resp.data && resp.data.data) {
        const { _meta } = resp.data;
        setPagination((prevPagination) => ({
          ...prevPagination,
          totalCount: _meta?.totalCount,
          pageNo: _meta?.currentPage ?? prevPagination.pageNo,
          pageLimit: _meta?.perPage ?? prevPagination.pageLimit,
        }));
        return resp.data.data;
      } else {
        // Handle error case or return an empty array
        console.error("Error fetching payment list:", resp);
        return [];
      }
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
              </Link> / Payment
            </h2>
          </div>

          <section className="inner-wrap">
            <Container fluid className="px-0">
              <div className="custom-card">
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th>No. of Product </th>
                      <th>First name</th>
                      <th>Last name </th>
                      <th>({constant.EURO})Total price</th>
                      <th>Created On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentList?.length > 0 ? (
                      paymentList?.map((data, index) => {
                        const serialNumber =
                          index +
                          1 +
                          (pagination.pageNo - 1) * pagination.pageLimit;
                        return (
                          <tr key={index}>
                            <th scope="row">{serialNumber}</th>
                            <td>{data?.productId?.length}</td>
                            <td>{data?.userDetails?.firstName}</td>
                            <td>{data?.userDetails?.lastName}</td>
                            <td>{constant.EURO}{Number(data?.amount)?.toLocaleString()}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>
                              <div className="action-btn">
                                <button
                                  title="View"
                                  onClick={() =>
                                    navigate(`/admin/view-payment/${data?._id}`)
                                  }
                                  className="btn-small style-one"
                                >
                                  <FaEye />
                                </button>
                              </div>
                            </td>
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
                {Math.ceil(pagination.totalCount / constant.PER_PAGE_TEN) >
                  1 && (
                  <div>
                    <ReactPaginate
                      containerClassName={
                        "pagination position-relative mt-2 pt-3"
                      }
                      previousLinkClassName={"pagination__link"}
                      nextLinkClassName={"pagination__link"}
                      disabledClassName={"pagination__link--disabled"}
                      activeClassName={"pagination__link--active"}
                      previousLabel={"Prev"}
                      nextLabel={"Next"}
                      onPageChange={(props) => {
                        setPagination({
                          ...pagination,
                          pageNo: props.selected + 1,
                        });
                      }}
                      pageCount={Math.ceil(
                        pagination.totalCount / constant.PER_PAGE_TEN
                      )}
                    />
                  </div>
                )}
              </div>
            </Container>
          </section>
        </div>
        <AdminFooter />
      </div>
    </>
  );
};

export default Payment;
