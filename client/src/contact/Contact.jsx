/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { React } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { customerAddContact } from "../services/Services";
import { emailRegex } from "../utils/Functions";
import { toastAlert } from "../utils/SweetAlert";
import "./contact.scss";
import { useTranslation } from "react-i18next";
import Loader from "../Loader/Loader";

function Contact() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const {
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    resetForm,
    handleSubmit,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
    validationSchema: yup.object().shape({
      firstName: yup
        .string()
        .trim()
        .required(t("FIRST_NAME_REQUIRED_FIELD"))
        .max(20),
      lastName: yup
        .string()
        .trim()
        .required(t("LAST_NAME_REQUIRED_FIELD"))
        .max(20),
      email: yup
        .string()
        .required(t("EMAIL_ADDRESS_REQUIRED_FIELD"))
        .trim()
        .matches(emailRegex, t("INVALID_EMAIL")),
      message: yup.string().required(t("MESSAGE_VALIDATION")).trim(),
    }),
    onSubmit: (values) => {
      let body = {
        firstName: values?.firstName,
        lastName: values?.lastName,
        email: values?.email,
        message: values?.message,
      };
      mutation.mutate(body);
    },
  });

  const mutation = useMutation({
    mutationFn: (body) => customerAddContact(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      navigate("/");
    },
  });

  return (
    <>
      <Header />
      <section className="breadcrumbs">
        <div className="breadcrumbs_overly">
          <Container>
            <Row>
              <Col className="justify-content-center">
                <div className="breadcrumb_text">
                  <h1>{t("CONTACT_US")}</h1>
                  <svg
                    width="536"
                    height="1"
                    viewBox="0 0 536 1"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="-4.37114e-08"
                      y1="0.5"
                      x2="268"
                      y2="0.499977"
                      stroke="url(#paint0_linear_88_135)"
                    />
                    <line
                      y1="-0.5"
                      x2="268"
                      y2="-0.5"
                      transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 536 1.00006)"
                      stroke="url(#paint1_linear_88_135)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_88_135"
                        x1="4.37114e-08"
                        y1="1.5"
                        x2="268"
                        y2="1.49998"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="white" stopOpacity="0" />
                        <stop offset="1" stopColor="white" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_88_135"
                        x1="0"
                        y1="0.5"
                        x2="268"
                        y2="0.5"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="white" stopOpacity="0" />
                        <stop offset="1" stopColor="white" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
      <section className="aboutus">
        <Container fluid="xl">
          <Row>
            <Col lg={8} md={10} className="text-center mx-auto mb-5">
              <h2>{t("CONTACT_INFO")}</h2>
              <p>{t("CONTACT_DATA")}</p>
            </Col>
          </Row>
          <div className="emp-dash-body cardbox sidebox px-4 py-5 bg-white">
            <Row>
              <Col md={4}>
                <div className="cardcontact d-flex">
                  <svg
                    width="60"
                    height="88"
                    viewBox="0 0 60 88"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="60" height="88" rx="5" fill="#FEE7DD" />
                    <mask
                      id="mask0_342_2"
                      maskUnits="userSpaceOnUse"
                      x="17"
                      y="30"
                      width="27"
                      height="27"
                    >
                      <path d="M17 30H44V57H17V30Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_342_2)">
                      <path
                        d="M30.5 56.209C27.3359 51.4629 21.7988 45.0293 21.7988 39.4922C21.7988 34.6944 25.7022 30.791 30.5 30.791C35.2978 30.791 39.2012 34.6944 39.2012 39.4922C39.2012 45.0293 33.6641 51.4629 30.5 56.209Z"
                        stroke="#FF550B"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M30.5 43.4473C28.3193 43.4473 26.5449 41.6729 26.5449 39.4922C26.5449 37.3115 28.3193 35.5371 30.5 35.5371C32.6807 35.5371 34.4551 37.3115 34.4551 39.4922C34.4551 41.6729 32.6807 43.4473 30.5 43.4473Z"
                        stroke="#FF550B"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                  <div className="ms-4">
                    <h4>{t("ADDRESS")}</h4>
                    <p className="mb-0">Almada, Portugal</p>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="cardcontact d-flex">
                  <svg
                    width="60"
                    height="88"
                    viewBox="0 0 60 88"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="60" height="88" rx="5" fill="#D9F7F0" />
                    <g clip-path="url(#clip0_342_3)">
                      <path
                        d="M37.3384 47.7253C36.7856 47.1498 36.1189 46.8421 35.4123 46.8421C34.7114 46.8421 34.039 47.1441 33.4634 47.7196L31.6627 49.5147C31.5145 49.4349 31.3663 49.3608 31.2239 49.2867C31.0187 49.1841 30.825 49.0873 30.6597 48.9847C28.973 47.9134 27.4401 46.5172 25.9698 44.7108C25.2575 43.8104 24.7788 43.0525 24.4312 42.2832C24.8985 41.8558 25.3316 41.4113 25.7533 40.984C25.9128 40.8244 26.0724 40.6591 26.232 40.4996C27.4287 39.3029 27.4287 37.7529 26.232 36.5562L24.6763 35.0005C24.4996 34.8238 24.3173 34.6415 24.1463 34.4591C23.8044 34.1058 23.4454 33.7411 23.075 33.3992C22.5222 32.8521 21.8612 32.5615 21.166 32.5615C20.4707 32.5615 19.7983 32.8521 19.2285 33.3992C19.2228 33.4049 19.2228 33.4049 19.2171 33.4106L17.2796 35.3652C16.5501 36.0946 16.1342 36.9836 16.043 38.015C15.9062 39.679 16.3963 41.229 16.7724 42.2433C17.6956 44.7336 19.0746 47.0415 21.1318 49.5147C23.6277 52.495 26.6309 54.8485 30.0614 56.5068C31.372 57.1279 33.1215 57.863 35.0761 57.9884C35.1958 57.9941 35.3211 57.9998 35.4351 57.9998C36.7515 57.9998 37.857 57.5268 38.7232 56.5865C38.7288 56.5751 38.7402 56.5695 38.7459 56.5581C39.0423 56.199 39.3842 55.8742 39.7432 55.5266C39.9882 55.293 40.239 55.0479 40.484 54.7915C41.0482 54.2046 41.3445 53.5207 41.3445 52.8198C41.3445 52.1132 41.0425 51.4351 40.4669 50.8652L37.3384 47.7253ZM39.3785 53.7259C39.3728 53.7259 39.3728 53.7316 39.3785 53.7259C39.1562 53.9652 38.9283 54.1818 38.6833 54.4211C38.3129 54.7744 37.9368 55.1448 37.5834 55.5608C37.0079 56.1763 36.3298 56.4669 35.4408 56.4669C35.3553 56.4669 35.2641 56.4669 35.1787 56.4612C33.4862 56.3529 31.9134 55.6919 30.7338 55.1277C27.5084 53.5663 24.6763 51.3496 22.3228 48.5402C20.3796 46.1981 19.0803 44.0327 18.2198 41.7077C17.6899 40.2887 17.4961 39.1832 17.5816 38.1404C17.6386 37.4737 17.895 36.9209 18.368 36.4479L20.3112 34.5047C20.5904 34.2426 20.8867 34.1001 21.1774 34.1001C21.5364 34.1001 21.827 34.3167 22.0093 34.499C22.015 34.5047 22.0207 34.5104 22.0264 34.5161C22.3741 34.8409 22.7046 35.1772 23.0522 35.5362C23.2288 35.7185 23.4112 35.9009 23.5935 36.0889L25.1492 37.6446C25.7533 38.2487 25.7533 38.8071 25.1492 39.4112C24.984 39.5764 24.8244 39.7417 24.6592 39.9012C24.1805 40.3913 23.7246 40.8472 23.2288 41.2917C23.2174 41.3031 23.206 41.3088 23.2003 41.3202C22.7103 41.8102 22.8014 42.2889 22.904 42.6137C22.9097 42.6308 22.9154 42.6479 22.9211 42.665C23.3257 43.6452 23.8956 44.5683 24.7617 45.6682L24.7674 45.6739C26.3402 47.6114 27.9985 49.1215 29.8277 50.2783C30.0614 50.4264 30.3007 50.5461 30.5287 50.6601C30.7338 50.7626 30.9276 50.8595 31.0928 50.9621C31.1156 50.9735 31.1384 50.9906 31.1612 51.002C31.3549 51.0989 31.5373 51.1444 31.7253 51.1444C32.1983 51.1444 32.4947 50.8481 32.5915 50.7512L34.5404 48.8023C34.7342 48.6086 35.0419 48.375 35.4009 48.375C35.7542 48.375 36.0448 48.5972 36.2215 48.791C36.2272 48.7966 36.2272 48.7966 36.2329 48.8023L39.3728 51.9422C39.9597 52.5235 39.9597 53.1218 39.3785 53.7259Z"
                        fill="#01B188"
                      />
                      <path
                        d="M30.5912 37.4226C32.0843 37.6733 33.4405 38.3799 34.5232 39.4627C35.606 40.5454 36.3069 41.9016 36.5633 43.3947C36.626 43.7708 36.9508 44.0329 37.3212 44.0329C37.3668 44.0329 37.4067 44.0272 37.4523 44.0215C37.874 43.9531 38.1532 43.5542 38.0848 43.1325C37.7771 41.3261 36.9223 39.6792 35.6173 38.3742C34.3124 37.0693 32.6655 36.2145 30.8591 35.9068C30.4374 35.8384 30.0442 36.1176 29.9701 36.5336C29.896 36.9496 30.1696 37.3542 30.5912 37.4226Z"
                        fill="#01B188"
                      />
                      <path
                        d="M42.9686 42.9103C42.4615 39.9356 41.0596 37.2288 38.9056 35.0748C36.7515 32.9207 34.0447 31.5189 31.0701 31.0117C30.6541 30.9376 30.2609 31.2226 30.1868 31.6386C30.1184 32.0603 30.3977 32.4535 30.8193 32.5275C33.4749 32.9777 35.8967 34.2371 37.8228 36.1575C39.7489 38.0836 41.0026 40.5055 41.4528 43.161C41.5155 43.5371 41.8403 43.7992 42.2107 43.7992C42.2563 43.7992 42.2962 43.7935 42.3418 43.7878C42.7578 43.7252 43.0427 43.3263 42.9686 42.9103Z"
                        fill="#01B188"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_342_3">
                        <rect
                          width="27"
                          height="27"
                          fill="white"
                          transform="translate(16 31)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <div className="ms-4">
                    <h4>{t("CALL_US")}</h4>
                    <p className="mb-0">+351 21 000 0000</p>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="cardcontact d-flex">
                  <svg
                    width="60"
                    height="88"
                    viewBox="0 0 60 88"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="60" height="88" rx="5" fill="#FFF4D9" />
                    <path
                      d="M42.5833 32.625H18.4167C17.0838 32.625 16 33.7088 16 35.0417V51.9584C16 53.2912 17.0838 54.375 18.4167 54.375H42.5834C43.9162 54.375 45 53.2912 45 51.9583V35.0417C45 33.7088 43.9162 32.625 42.5833 32.625ZM18.4167 33.8333H42.5834C42.6724 33.8333 42.7509 33.8658 42.8344 33.8841C40.7422 35.799 33.8046 42.1457 31.3768 44.3331C31.1868 44.5042 30.8806 44.7083 30.5001 44.7083C30.1195 44.7083 29.8133 44.5042 29.6227 44.3325C27.1951 42.1454 20.2572 35.7984 18.1653 33.8842C18.249 33.8659 18.3276 33.8333 18.4167 33.8333ZM17.2083 51.9583V35.0417C17.2083 34.9233 17.244 34.8159 17.2759 34.7077C18.8773 36.1734 23.718 40.6018 26.8568 43.456C23.7282 46.1435 18.8862 50.7341 17.2721 52.2732C17.2437 52.1705 17.2083 52.07 17.2083 51.9583ZM42.5833 53.1667H18.4167C18.3202 53.1667 18.2344 53.133 18.1442 53.1115C19.8121 51.5215 24.6849 46.9045 27.7585 44.2751C28.1592 44.6385 28.5252 44.9699 28.8138 45.2299C29.3117 45.6795 29.8946 45.9167 30.5 45.9167C31.1054 45.9167 31.6883 45.6795 32.1856 45.2305C32.4743 44.9704 32.8406 44.6387 33.2415 44.2751C36.3152 46.9042 41.1873 51.5209 42.8558 53.1115C42.7656 53.133 42.6799 53.1667 42.5833 53.1667ZM43.7917 51.9583C43.7917 52.07 43.7563 52.1705 43.7279 52.2732C42.1132 50.7333 37.2718 46.1432 34.1432 43.4561C37.2821 40.6018 42.1221 36.1738 43.7241 34.7076C43.756 34.8158 43.7917 34.9232 43.7917 35.0416V51.9583Z"
                      fill="#DF9F00"
                    />
                  </svg>
                  <div className="ms-4">
                    <h4>{t("EMAIL_ADDRESS")}</h4>
                    <p className="mb-0">info@privatemarkets.pt</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Row>
            <Col lg={9} md={10} className=" mx-auto mb-5 mt-5">
              <div className="sidebox px-4 py-5 border-0 bg-white">
                <h4 className="mb-5">{t("LEAVE_A_MESSAGE")}</h4>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <div className="form-group mb-4">
                        <Form.Label>{t("FIRST_NAME")}</Form.Label>
                        <span className="text-danger">*</span>
                        <Form.Control
                          type="text"
                          placeholder={t("ENTER_A_FIRST_NAME")}
                          name="firstName"
                          value={values?.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <p className="text-danger">
                          {touched.firstName && errors.firstName}
                        </p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group mb-4">
                        <Form.Label>{t("LAST_NAME")}</Form.Label>
                        <span className="text-danger">*</span>
                        <Form.Control
                          type="text"
                          placeholder={t("ENTER_A_LAST_NAME")}
                          name="lastName"
                          value={values?.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <p className="text-danger">
                          {touched.lastName && errors.lastName}
                        </p>
                      </div>
                    </Col>

                    <Col lg={12}>
                      <div className="form-group mb-4">
                        <Form.Label>{t("EMAIL_ADDRESS")}</Form.Label>
                        <span className="text-danger">*</span>
                        <Form.Control
                          type="email"
                          placeholder={t("ENTER_A_EMAIL_ADDRESS")}
                          name="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.email}
                        />
                        <p className="text-danger">
                          {touched.email && errors.email}
                        </p>
                      </div>
                    </Col>

                    <Col lg={12}>
                      <div className="form-group mb-4">
                        <Form.Label>{t("MESSAGE")}</Form.Label>
                        <span className="text-danger">*</span>
                        <Form.Control
                          as="textarea"
                          placeholder={t("TYPE_YOUR_MESSAGE")}
                          style={{ height: "100px" }}
                          name="message"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.message}
                        />
                        <p className="text-danger">
                          {touched.message && errors.message}
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <button className="btn btn-theme2 px-4" type="submit">
                    {t("SEND_MESSAGE")}
                  </button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
      {mutation?.isPending && <Loader />}
    </>
  );
}

export default Contact;
