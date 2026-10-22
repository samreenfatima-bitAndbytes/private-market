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
import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import * as yup from "yup";
import useSlider from "../../../hooks/useSlider";
import { login } from "../../../redux/features/authSlice";
import { changePassword } from "../../../services/Services";
import { toastAlert } from "../../../utils/SweetAlert";
import Sidebar from "../../sidebar/Sidebar";
import AdminFooter from "../AdminFooter";

const AdminResetPassword = () => {
  const [showPassOld, setShowPassOld] = useState(false);
  const [showPassNew, setShowPassNew] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  const isSlider = useSlider();
  const dispatch = useDispatch();
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    errors,
    resetForm,
  } = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: yup.object().shape({
      oldPassword: yup.string().required().label("Old Password"),
      newPassword: yup
        .string()
        .required()
        .label("New Password")
        .matches(
          /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/,
          "Password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special character."
        ),
      confirmPassword: yup
        .string()
        .required()
        .label("Confirm Password")
        .oneOf(
          [yup.ref("newPassword"), null],
          "New password and confirm password must match"
        ),
    }),

    onSubmit: (values) => {
      let body = {
        password: values?.newPassword,
        oldPassword: values?.oldPassword,
      };
      changePasswordMutation.mutate(body);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (body) => changePassword(body),
    onSuccess: (resp) => {
       toastAlert("success", resp?.data?.message);
       resetForm();
       dispatch(login(""));
    },
  });
  return (
    <>
      <div className="mainbox">
        <Sidebar />
        <div className={isSlider ? "body-content close" : "body-content open"}>
          <div className="d-flex align-items-center justify-content-between">
          <h2 className="mainhead mb-0"><Link to="/admin/dashboard" className="bread_color">Home</Link> / Change Password</h2>
          </div>
          <section className="inner-wrap">
            <Container fluid className="px-0">
              <div className="custom-card">
                <Row>
                  <Col lg={8} className="mx-auto">
                    <Form className="changepass-form">
                      <Row>
                        <Col lg={12}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bolder">Old Password</Form.Label>
                            <span className="text-danger">*</span>
                            <div className="password-input-wrap">
                              <Form.Control
                                type={showPassOld ? "text" : "password"}
                                placeholder="Old Password"
                                name="oldPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values?.oldPassword}
                              />
                              <span
                                className="eye-icon"
                                onClick={() => setShowPassOld((v) => !v)}
                              >
                                {showPassOld ? <FaEye /> : <FaEyeSlash />}
                              </span>
                            </div>
                            <span className="text-danger">
                              {touched?.oldPassword && errors?.oldPassword}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bolder">New Password</Form.Label>
                            <span className="text-danger">*</span>
                            <div className="password-input-wrap">
                              <Form.Control
                                type={showPassNew ? "text" : "password"}
                                placeholder="New Password"
                                name="newPassword"
                                value={values?.newPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <span
                                className="eye-icon"
                                onClick={() => setShowPassNew((v) => !v)}
                              >
                                {showPassNew ? <FaEye /> : <FaEyeSlash />}
                              </span>
                            </div>
                            <span className="text-danger">
                              {touched?.newPassword && errors?.newPassword}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bolder">Confirm Password </Form.Label>
                            <span className="text-danger">*</span>
                            <div className="password-input-wrap">
                              <Form.Control
                                type={showPassConfirm ? "text" : "password"}
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values?.confirmPassword}
                              />
                              <span
                                className="eye-icon"
                                onClick={() => setShowPassConfirm((v) => !v)}
                              >
                                {showPassConfirm ? <FaEye /> : <FaEyeSlash />}
                              </span>
                            </div>
                            <span className="text-danger">
                              {touched?.confirmPassword &&
                                errors?.confirmPassword}
                            </span>
                          </Form.Group>
                        </Col>
                        <div className="text-center">
                          <button
                            className="theme-btn"
                            type="button"
                            onClick={handleSubmit}
                          >
                            Save Changes
                          </button>
                        </div>
                      </Row>
                    </Form>
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

export default AdminResetPassword;
