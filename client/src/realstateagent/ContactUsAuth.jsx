/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import { Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { CustomerSendQueryAuth } from "../services/Services";
import { toastAlert } from "../utils/SweetAlert";
import { emailRegex, phoneRegExp, restrictAlpha } from "../utils/Functions";
import { useTranslation } from "react-i18next";
import {PhoneInput} from "react-international-phone";
import "react-international-phone/style.css";
import styled from 'styled-components';

export const StyledPhoneInput = styled(PhoneInput)`
  .react-international-phone-country-selector-button__button-content {
    margin-left: 5px;
    margin-right: 8px;
  }
`;

export const StyledMessageInput = styled(Form.Control)`
  &.contact-message-input {
    border-width: 1px !important;
    padding: 10px 20px !important;
    outline: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    display: block;
    width: 100%;
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--bs-body-color);
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: var(--bs-body-bg);
    background-clip: padding-box;
    border: var(--bs-border-width) solid var(--bs-border-color);
    border-radius: var(--bs-border-radius);
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
  }
`;
const ContactUsAuth = () => {
  const { t, i18n } = useTranslation();

  const { id } = useParams();
  const {
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    resetForm,
    handleSubmit,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
      mobile: "",
    },
    validationSchema: yup.object().shape({
      firstName: yup.string().trim().required(t("FIRST_NAME_REQUIRED_FIELD")).max(32),
      // lastName: yup.string().trim().required(t("LAST_NAME_REQUIRED_FIELD")).max(20),
      email: yup
        .string()
        .required(t("EMAIL_ADDRESS_REQUIRED_FIELD"))
        .trim()
        .matches(emailRegex, t("INVALID_EMAIL")),
      mobile: yup
        .string()
        .required(t("MOBILE_VALIDATION"))
        .matches(phoneRegExp, t("INVALID_MOBILE")),
      message: yup.string().required(t("MESSAGE_VALIDATION")).trim(),
    }),
    onSubmit: (values) => {
      let body = {
        id: id,
        firstName: values?.firstName,
        lastName: values?.lastName,
        email: values?.email,
        message: values?.message,
        mobile: values?.mobile,
      };
      mutation.mutate(body);
    },
  });

  const mutation = useMutation({
    mutationFn: (body) => CustomerSendQueryAuth(body),
    onSuccess: () => {
      toastAlert("success", t("CONTACT_TOAST"));
      resetForm();
    },
  });

  return (
    <>
      <Col md={4} xl={4}>
        <div className="sidebox px-4 py-4 border-0 bg-white mb-4">
          <h4 className="mb-5">{t("CONTACT_US")}</h4>
          <Form>
            <Row>
              <Col md={12}>
                <div className="form-group mb-4">
                <Form.Label>{t("FULL_NAME")}</Form.Label>
                  <span className="text-danger">*</span>
                  <Form.Control
                    type="text"
                    placeholder={t("ENTER_FULL_NAME")}
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
              <Col md={12} style={{display:"none"}}>
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
                  <p className="text-danger">{touched.email && errors.email}</p>
                </div>
              </Col>

              <Col lg={12}>
                <div className="form-group mb-4">
                  <Form.Label>{t("MOBILE_NUMBER")}</Form.Label>
                  <span className="text-danger">*</span>
                  <StyledPhoneInput
                    defaultCountry="pt"
                    value={values.mobile}
                    onChange={(value) => setFieldValue("mobile", value)}
                    style={{
                      height: "55px",
                      borderWidth: "1px",
                      lineHeight: "55px",
                      outline: "none",
                      boxShadow: "none",
                      borderRadius: "0",
                      '--react-international-phone-height': '55px', 
                      '--react-international-phone-width': '55px', 
                      'react-international-phone-country-selector-button__button-content': '55px'// Custom CSS variable
                    }}
                    inputStyle={{
                      height: "55px",
                      lineHeight: "55px",
                      padding: "0 20px",
                      outline: "none",
                      boxShadow: "none",
                      borderRadius: "0",
                      width: "100%"
                    }}
                    inputProps={{
                      style: {
                        height: "55px",
                        lineHeight: "55px",
                        padding: "0 20px",
                        width: "100%",
                        outline: "none",
                        boxShadow: "none",
                        borderRadius: "0"
                      }
                    }}
                    countrySelectorStyleProps={{
                      style:{}
                    }}
                  />
                  <p className="text-danger">
                    {touched.mobile && errors.mobile}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="form-group mb-4">
                  <Form.Label>{t("MESSAGE")}</Form.Label>
                  <span className="text-danger">*</span>
                  <StyledMessageInput
                    as="textarea"
                    style={{ height: "100px" }}
                    className="contact-message-input"
                    placeholder={t("TYPE_YOUR_MESSAGE")}
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
            <button
              className="btn btn-theme2 px-4"
              type="button"
              onClick={handleSubmit}
            >
            {t("SEND_MESSAGE")}
            </button>
          </Form>
        </div>
        <br />
      </Col>
    </>
  );
};

export default ContactUsAuth;
