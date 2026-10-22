/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Loader from "../Loader/Loader";
import { customerFaqList } from "../services/Services";
import { constant } from "../utils/constant";
import "./faq.scss";

function Faq() {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(null);

  const [pagination, setPagination] = useState({
    pageNo: constant.PAGE_NO_ONE,
    pageLimit: constant.PER_PAGE_EIGHT,
  });
  const { data: faqList, isFetching } = useQuery({
    queryKey: [
      "faq-List",
      {
        page: pagination.pageNo,
        limit: pagination.pageLimit,
      },
    ],
    queryFn: async ({ queryKey }) => {
      const [_key, query] = queryKey;
      const resp = await customerFaqList(query);
      const { _meta } = resp?.data ?? {};
      setPagination((prevPagination) => ({
        ...prevPagination,
        totalCount: _meta?.totalCount,
        pageNo: _meta?.currentPage ?? prevPagination.pageNo,
        pageLimit: _meta?.perPage ?? prevPagination.pageLimit,
      }));
      return resp?.data?.data;
    },
  });

  const pageCount = Math.ceil(
    (pagination.totalCount || 0) / (pagination.pageLimit || constant.PER_PAGE_EIGHT)
  );

  return (
    <>
      <Header />
      <section className="breadcrumbs">
        <div className="breadcrumbs_overly">
          <Container>
            <Row>
              <Col className="justify-content-center">
                <div className="breadcrumb_text">
                  <h1>{t("FAQ")}</h1>
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
      <section className="faq">
        <Container fluid="xl">
          <Row>
            <Col lg={10} className="mx-auto">
              <p className="faq-intro text-center mb-4">{t("FAQ_INTRO")}</p>
              {faqList?.length > 0 ? (
                <Accordion
                  className="faq-accordion p-0"
                  activeKey={activeKey}
                  onSelect={(key) => setActiveKey(key)}
                >
                  {faqList.map((data, index) => {
                    const eventKey = String(data?._id || index);
                    return (
                      <Accordion.Item eventKey={eventKey} key={eventKey}>
                        <Accordion.Header>{data?.question}</Accordion.Header>
                        <Accordion.Body>
                          <div
                            className="faq-answer"
                            dangerouslySetInnerHTML={{
                              __html: data?.answer,
                            }}
                          />
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
              ) : (
                <div className="text-center">{t("DATA_NOT_FOUND")}</div>
              )}
            </Col>
          </Row>
          {pageCount > 1 && (
            <div>
              <ReactPaginate
                containerClassName={"pagination position-relative mt-2 pt-3"}
                previousLinkClassName={"pagination__link"}
                nextLinkClassName={"pagination__link"}
                disabledClassName={"pagination__link--disabled"}
                activeClassName={"pagination__link--active"}
                previousLabel={"Prev"}
                nextLabel={"Next"}
                onPageChange={(props) => {
                  setActiveKey(null);
                  setPagination({
                    ...pagination,
                    pageNo: props.selected + 1,
                  });
                }}
                pageCount={pageCount}
              />
            </div>
          )}
        </Container>
      </section>
      <Footer />
      {isFetching && <Loader />}
    </>
  );
}

export default Faq;
