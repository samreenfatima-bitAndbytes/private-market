/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import useSlider from "../../../hooks/useSlider";
import { toastAlert } from "../../../utils/SweetAlert";
import Sidebar from "../../sidebar/Sidebar";
import { Col, Container, Form, Row } from "react-bootstrap";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import AdminFooter from "../AdminFooter";
import { adminAddFaq, adminUpdateFaq, adminViewFaq } from "../../../services/AdminServices";

const AddFaq = () => {
  const { id } = useParams();
  const isSlider = useSlider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (id) {
    useQuery({
      queryKey: ["faq-detail", id],
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const resp = await adminViewFaq(id);
        setValues({
          ...values,
          question: resp?.data?.data?.question,
          answer: resp?.data?.data?.answer,
        });
        return resp?.data?.data;
      },
    });
  }

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    resetForm,
    setValues,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      question: "",
      answer: "",
    },
    validationSchema: yup.object().shape({
      question: yup.string().required().label("Question").trim(),
      answer: yup.string().trim().required().label("Answer"),
    }),
    onSubmit: async (values) => {
      let body;
      if (id) {
        body = {
          id: id,
          question: values?.question.trim(),
          answer: values?.answer,
        };
        editMutate(body);
      } else {
        body = {
          question: values?.question.trim(),
          answer: values?.answer,
        };
        mutate(body);
      }
    },
  });
  const { mutate, error } = useMutation({
    mutationFn: (payload) => adminAddFaq(payload),
    onSuccess: (resp) => {
      // Success actions
      toastAlert("success", resp?.data?.message);
      resetForm();
      navigate(`/admin/faq-list`);
      queryClient.invalidateQueries({ queryKey: ["faq-list"] });
    },
  });

  const { mutate: editMutate } = useMutation({
    mutationFn: (payload) => adminUpdateFaq(id, payload),
    onSuccess: (resp) => {
      // Success actions
      toastAlert("success", resp?.data?.message);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["faq-list"] });
      navigate(`/admin/faq-list`);
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
              </Link> / {id ? "Update Faq" : "Create Faq"}
            </h2>
            <div className="text-end mx-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="theme-btn btn-md mb-2 mx-4"
              >
                Back
              </button>
            </div>
          </div>
          <section className="inner-wrap">
            <Container fluid className="px-0">
              <div className="custom-card">
                <Form>
                  <Row>
                    <Col lg={8}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bolder">
                          Question<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter a question"
                          name="question"
                          value={values?.question}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <p className="text-danger">
                          {touched?.question && errors?.question}
                        </p>
                      </Form.Group>
                    </Col>

                    <Col lg={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bolder">
                          Answer<span className="text-danger">*</span>
                        </Form.Label>

                        <CKEditor
                          editor={ClassicEditor}
                          data={values?.answer}
                          config={{
                            language: "en",
                            toolbar: [
                              "heading",
                              "|",
                              "bold",
                              "italic",
                              "bulletedList",
                              "numberedList",
                              "|",
                            ],
                          }}
                          onChange={(_, editor) => {
                            setFieldValue("answer", editor.getData());
                          }}
                          onBlur={() => {
                            setFieldTouched("answer", true);
                          }}
                        />
                        <p className="text-danger">
                          {touched?.answer && errors?.answer}
                        </p>
                      </Form.Group>
                    </Col>

                    <div className="text-end mt-4">
                      <button
                        className="theme-btn btn-md mb-2"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </Row>
                </Form>
              </div>
            </Container>
          </section>
        </div>
        <AdminFooter />
      </div>
    </>
  );
};

export default AddFaq;
