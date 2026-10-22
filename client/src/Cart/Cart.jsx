/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { React, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import DataNotFound from "../components/DataNotFound";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { cart } from "../redux/features/cartSlice";
import { store } from "../redux/store";
import { customerCartList, customerRemoveCart } from "../services/Services";
import { toastAlert } from "../utils/SweetAlert";
import { constant } from "../utils/constant";
import "./cart.scss";

function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [totalPrice, setTotalPrice] = useState(0);
  const { data: cartList, isFetching } = useQuery({
    queryKey: ["cart-list"],
    queryFn: async ({ queryKey }) => {
      const [_key] = queryKey;
      const resp = await customerCartList();
      setTotalPrice(resp?.data?.data?.total);
      return resp?.data?.data?.list;
    },
  });

  const { mutate,isPending } = useMutation({
    mutationFn: (payload) => customerRemoveCart(payload),
    onSuccess: (resp) => {
      store.dispatch(cart(resp?.data?.data?.length));
      toastAlert("success", t("PRODUCT_REMOVED_SUCCESSFULLY"));
      queryClient.invalidateQueries({ queryKey: ["cart-list"] });
    },
  });

  const handleDelete = (id) => {
    mutate(id);
  };

  return (
    <>
      <Header />
      <section className="searchsection">
        <Container>
          <Row>
            <Col md={8}>
              <Row>
                {cartList?.length > 0 ? (
                  cartList?.map((data, index) => {
                    return (
                      <>
                        <Col lg={4} key={index}>
                          <div className="sidebox overflow-hidden bg-white py-4 p-3 mt-4">
                            <div className="d-flex align-items-center mt-4 justify-content-center gap-3">
                              {data?.productDetails?.productImg.length > 0 ? (
                                <>
                                  <img
                                    className="w-100"
                                    src={
                                      data?.productDetails?.productImg?.[0]
                                        ? import.meta.env.VITE_API_URL +
                                          `/getImg/${data?.productDetails?.productImg?.[0]}`
                                        : "/static_image.jpg"
                                    }
                                    width="200px"
                                    height="150px"
                                  />
                                </>
                              ) : (
                                <img src="/static_image.jpg" />
                              )}
                            </div>
                            <h5 className="text-center my-3">
                              {data?.productDetails?.productName}
                            </h5>
                            <p className="text-center my-3">
                              {constant.EURO}
                              {Number(
                                data?.productDetails?.price
                              )?.toLocaleString()}
                            </p>
                            <button
                              className="btn btn-theme2 px-5 w-100"
                              onClick={() => {
                                handleDelete(data?._id);
                              }}
                            >
                              {t("REMOVE")}
                            </button>
                          </div>
                        </Col>
                      </>
                    );
                  })
                ) : (
                  <div>
                    <DataNotFound />
                  </div>
                )}
              </Row>
            </Col>

            <Col lg={4}>
              <div className="sidebox buybox overflow-hidden bg-white">
                <h6 className="px-lg-4 px-3 my-4  text-uppercase">
                  {t("CART_TOTAL")}
                </h6>
                <div className="table-responsive">
                  <Table className="mb-0">
                    <tbody>
                      <tr>
                        <td className="width30">SUBTOTAL</td>
                        <td>
                          {constant.EURO}
                          {totalPrice ?? 0}
                        </td>
                      </tr>
                      <tr>
                        <td className="width30 fw-bold border-0 pb-0">TOTAL</td>
                        <td className="fw-bold border-0 pb-0">
                          {constant.EURO}
                          {totalPrice ?? 0}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                <Row className="mt-3 px-lg-4 px-">
                  <Col md={12}>
                    <button
                      className="btn btn-theme2 mb-4 w-100"
                      onClick={() => {
                        const productIds = (cartList || [])
                          .map(
                            (row) =>
                              row?.productId ||
                              row?.productDetails?._id ||
                              row?.productDetails?.id
                          )
                          .filter(Boolean);
                        navigate("/customer/payment", {
                          state: { totalPrice, productIds },
                        });
                      }}
                      disabled={cartList?.length === 0}
                    >
                      {t("BUY")}
                    </button>
                  </Col>
                  <p className="fw-normal">{t("CART_CONTENT")}</p>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
      {isFetching || isPending ? <Loader /> : ""}
    </>
  );
}

export default Cart;
