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
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Modal, Row } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../Loader/Loader";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { cart } from "../../redux/features/cartSlice";
import { store } from "../../redux/store";
import {
  contactCsvDownload,
  customerCardDelete,
  customerCardList,
  customerOrderCreate,
  customerOrderDownload,
} from "../../services/Services";
import { toastAlert } from "../../utils/SweetAlert";
import StripeCard from "./StripeCard";

const CheckoutForm = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [propertyId, setPropertyId] = useState([]);
  const [paidOrderId, setPaidOrderId] = useState("");
  const location = useLocation();

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { data: cardList, isFetching } = useQuery({
    queryKey: ["cardList"],
    queryFn: async ({ queryKey }) => {
      const [_key] = queryKey;
      const resp = await customerCardList();
      return resp.data?.data;
    },
  });
  const handleDelete = (id) => {
    Swal.fire({
      title: t("ARE_YOU_SURE"),
      text: t("YOU_WANT_TO_DELETE_CARD"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#004aad",
      cancelButtonColor: "#d33",
      confirmButtonText: t("YOU_DELETE_IT"),
      cancelButtonText: t("CANCEL"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteSchedularList.mutate(id);
      }
    });
  };
  const deleteSchedularList = useMutation({
    mutationFn: (id) => customerCardDelete(id),
    onSuccess: () => {
      toastAlert("success", t("CARD_DELETE_TOAST"));
      queryClient.invalidateQueries({ queryKey: ["cardList"] });
    },
  });
  const [selectedCard, setSelectedCard] = useState("");

  // Auto-select newly added / only remaining card
  useEffect(() => {
    if (!cardList?.length) {
      setSelectedCard("");
      return;
    }
    const stillSelected = cardList.some((c) => String(c.id) === String(selectedCard));
    if (stillSelected) return;
    const newest = [...cardList].sort(
      (a, b) => Number(b.created || 0) - Number(a.created || 0)
    )[0];
    if (newest?.id) setSelectedCard(String(newest.id));
  }, [cardList, selectedCard]);

  const handlePayAmount = () => {
    if (selectedCard) {
      let body = {
        paymentMethodId: selectedCard,
        orderTotal: location?.state?.totalPrice,
        total: location?.state?.totalPrice,
        productIds: location?.state?.productIds || [],
      };

      payMutation.mutate(body);
    } else {
      toastAlert(
        "error",
        t("SELECT_CARD_TOAST") + " " + location?.state?.totalPrice
      );
    }
  };
  const payMutation = useMutation({
    mutationFn: (body) => customerOrderCreate(body),
    onSuccess: (resp) => {
      if (resp?.data?.success === false) {
        toastAlert("error", resp?.data?.message || "Payment failed");
        return;
      }
      setPropertyId(resp?.data?.data?.productId || []);
      setPaidOrderId(resp?.data?.data?._id || "");
      toastAlert("success", t("ORDER_ADD_TOAST"));
      handleShow();
    },
    onError: (e) => {
      toastAlert(
        "error",
        e?.response?.data?.message || "Could not complete payment"
      );
    },
  });

  const handleSampleDownload = async () => {
    try {
      let filePath = "";

      if (paidOrderId) {
        const resp = await customerOrderDownload(paidOrderId);
        filePath = resp?.data?.data || "";
      }

      if (!filePath) {
        const productFiles = (propertyId || [])
          .map((product) => product?.productFile)
          .filter(Boolean);
        if (productFiles.length) {
          const resp = await contactCsvDownload(productFiles.join(","), {
            ids: productFiles,
          });
          filePath = resp?.data?.data || "";
        }
      }

      if (!filePath) {
        toastAlert("error", "No spreadsheet file on this order");
        return;
      }

      store.dispatch(cart(0));
      window.location.assign(`${import.meta.env.VITE_API_URL}/${filePath}`);
      toastAlert("success", t("FILE_DOWNLOAD_TOAST"));
      handleClose();
      navigate(`/customer/file-list`);
    } catch (e) {
      toastAlert(
        "error",
        e?.response?.data?.message || "Download failed"
      );
    }
  };

  return (
    <>
      <Header />
      <section className="searchsection">
        <Container>
          <div className="sidebox overflow-hidden bg-white py-5">
            <Row>
              <Col md={8} className="mx-auto">
                <h4 className="text-center mb-lg-5  mb-3 text-uppercase">
                  {t("FILL")}
                </h4>
                <StripeCard />

                <Row>
                  {cardList?.length > 0
                    ? cardList?.map((data, index) => {
                        return (
                          <div className="col-xl-6" key={index}>
                            <Card className="mb-3 p-0">
                              <CardBody>
                                <div className="payment-card">
                                  <input
                                    className="radio-inner"
                                    type="radio"
                                    name="card-radio"
                                    value={data?.id}
                                    id={data?.id}
                                    checked={data?.id == selectedCard}
                                    onChange={(e) =>
                                      setSelectedCard(e.target.value)
                                    }
                                  />
                                  <div
                                    className="chck-label blk-txt"
                                    htmlFor={data?.id}
                                  >
                                    <span className="card-icn-design">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-credit-card-2-back"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z" />
                                        <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z" />
                                      </svg>
                                    </span>
                                    {t("DEBIT_CARD")}
                                  </div>
                                  <label
                                    htmlFor={1}
                                    className="d-flex align-items-start justify-content-between"
                                  >
                                    <div className="credit-card visa">
                                      <div className="credit-card-last4">
                                        {data?.last4}
                                      </div>
                                      <div className="credit-card-expiry">
                                        {data?.exp_month}/{data?.exp_year}
                                      </div>
                                    </div>
                                    <p className="card-name"> {data?.brand} </p>
                                  </label>
                                  <button
                                    className="delete-btn"
                                    title={t("DELETE")}
                                    type="button"
                                    onClick={() => {
                                      handleDelete(data?.id);
                                    }}
                                  >
                                    <FaTrashAlt />
                                  </button>
                                </div>
                              </CardBody>
                            </Card>
                          </div>
                        );
                      })
                    : ""}
                </Row>

                <p className="text-center mt-4">
                  {t("CART_DETAIL")}{" "}
                  <strong>€{location?.state?.totalPrice}</strong>
                  {t("CART_DETILS*")}
                  <Link
                    to="/terms-conditions"
                    className="text-underline"
                    target="_blank"
                  >
                    {t("TERMS_&_CONDITION")}
                  </Link>{" "}
                  &
                  <Link
                    to="/privacy-policy"
                    className="text-underline"
                    target="_blank"
                  >
                    {t("PRIVACY_&_POLICY")}
                  </Link>{" "}
                  {t("CART_DETAIL_1")}
                </p>
              </Col>
            </Row>
            {cardList?.length > 0 ? (
              <>
                <div className="d-flex align-items-center justify-content-center gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    type="button"
                    className="add-modal-btn me-0  "
                  >
                    {t("BACK")}
                  </button>
                  <button
                    className="add-modal-btn me-0 "
                    onClick={() => {
                      handlePayAmount();
                    }}
                  >
                    {t("PAY")}&nbsp;€{location?.state?.totalPrice}
                  </button>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </Container>
      </section>

      <Footer />
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <Modal.Header
            closeButton
            className="p-0 border-0 pt-4"
          ></Modal.Header>
          <Row>
            <Col md={10} className="mx-auto py-5 text-center">
              <img src="../pay.png" width={150} />
              <h5 className="mt-4 mb-4">
                {t("PAYMENT")} <br />
                {t("SUCCESSFULLY_DONE")}
              </h5>
              <button
                className="btn bg-green px-5"
                type="button"
                onClick={() => handleSampleDownload()}
              >
                {t("DOWNLOAD_CSV_FILE")}
              </button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      {isFetching ||
      payMutation?.isPending ||
      deleteSchedularList?.isPending ? (
        <Loader />
      ) : (
        ""
      )}
    </>
  );
};

export default CheckoutForm;
