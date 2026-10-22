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
import { React, useState } from "react";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "swiper/swiper-bundle.css";
import Loader from "../Loader/Loader";
import DataNotFound from "../components/DataNotFound";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useDetails from "../hooks/useDetails";
import {
  agentActiveProperty,
  customerAddFavourite,
  customerDownloadFull,
  customerSaveSearch,
  propertyListingAuth,
} from "../services/Services";
import { restrictAlpha, truncate } from "../utils/Functions";
import { toastAlert } from "../utils/SweetAlert";
import { constant } from "../utils/constant";
import {
  PROPERTY_IMG_FALLBACK,
  propertyThumbUrl,
} from "../utils/propertyImages";
import ListingFiltersBar from "./ListingFiltersBar";
import "./allProperty.scss";

const AllPropertyList = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const details = useDetails();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [moreFilters, setMoreFilters] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageNo: constant.PAGE_NO_ONE,
    pageLimit: constant.PER_PAGE_THIRTY,
    sort: "",
  });

  const addAndRemoveFavouritesMutation = useMutation({
    mutationFn: (body) => customerAddFavourite(body),
    onSuccess: (resp) => {
      resp?.data?.data?.isFavourite == 1
        ? toastAlert("success", t("FAVOURITE_ADD_FILTER"))
        : toastAlert("success", t("FAVOURITE_REMOVE_FILTER"));

      queryClient.invalidateQueries({ queryKey: ["property-list"] });
    },
  });

  const { data: categoryList } = useQuery({
    queryKey: ["category-list"],
    queryFn: async ({ queryKey }) => {
      const [_key, query] = queryKey;
      const resp = await agentActiveProperty(query);
      return resp?.data?.data ?? [];
    },
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    touched,
    errors,
    resetForm,
  } = useFormik({
    initialValues: {
      search: location?.state?.name ?? location?.state?.search ?? "",
      propertyType: location?.state?.property_type ?? "",
      minPrice: "",
      maxPrice: "",
      minSize: "",
      maxSize: "",
      condition: "",
      other_features_real_estate: [],
      other_features_building: [],
      baths: "",
      rooms: "",
      floor: "",
      gross_area: "",
      date: "",
      sort: "",
      minNet: "",
      maxNet: "",
      minPriceEstimation: "",
      maxPriceEstimation: "",
      minExpectedRentalYield: "",
      maxExpectedRentalYield: "",
      minDaysToSale: "",
      maxDaysToSale: "",
      minPriceDelta: "",
      maxPriceDelta: "",
    },
    onSubmit: async () => {
      let body = {
        search: location?.state?.name ?? "",
        propertyType: values?.propertyType,
        minPrice: values?.minPrice,
        maxPrice: values?.maxPrice,
        minSize: values?.minSize,
        maxSize: values?.maxSize,
        gross_area: values?.gross_area,
        condition: values?.condition,
        baths: values?.baths,
        rooms: values?.rooms,
        floor: values?.floor,
        other_features_building: values?.other_features_building.toString(),
        other_features_real_estate:
          values?.other_features_real_estate.toString(),
        date: values?.date,
        minNet: values?.minNet,
        maxNet: values?.maxNet,
        lng: location?.state?.lat,
        lat: location?.state?.lng,
        minPriceEstimation: values?.minPriceEstimation,
        maxPriceEstimation: values?.maxPriceEstimation,
        minExpectedRentalYield: values?.minExpectedRentalYield,
        maxExpectedRentalYield: values?.maxExpectedRentalYield,
        minDaysToSale: values?.minDaysToSale,
        maxDaysToSale: values?.maxDaysToSale,
        minPriceDelta: values?.minPriceDelta,
        maxPriceDelta: values?.maxPriceDelta,
      };
      mutation.mutate(body);
    },
  });
  let dataUrl = "";
  const [csb, setcsv] = useState([]);
  const { data: propertyList, isFetching } = useQuery({
    queryKey: [
      "property-list",
      {
        parish: location?.state?.parish,
        municipality: location?.state?.municipality,
        district: location?.state?.district,
        search: location?.state?.name,
        page: pagination.pageNo,
        limit: pagination.pageLimit,
        propertyType: values?.propertyType,
        minPrice: values?.minPrice,
        maxPrice: values?.maxPrice,
        minSize: values?.minSize,
        maxSize: values?.maxSize,
        rooms: values?.rooms,
        baths: values?.baths,
        condition: values?.condition,
        other_features_real_estate:
          values?.other_features_real_estate.toString(),
        other_features_building: values?.other_features_building.toString(),
        floor: values?.floor,
        date: values?.date,
        sort: pagination?.sort,
        minNet: values?.minNet,
        maxNet: values?.maxNet,
        lng: location?.state?.lat,
        lat: location?.state?.lng,
        minPriceEstimation: values?.minPriceEstimation,
        maxPriceEstimation: values?.maxPriceEstimation,
        minExpectedRentalYield: values?.minExpectedRentalYield,
        maxExpectedRentalYield: values?.maxExpectedRentalYield,
        minDaysToSale: values?.minDaysToSale,
        maxDaysToSale: values?.maxDaysToSale,
        minPriceDelta: values?.minPriceDelta,
        maxPriceDelta: values?.maxPriceDelta,
      },
    ],
    queryFn: async ({ queryKey, isFetching }) => {
      const [_key, query] = queryKey;
      const resp = await propertyListingAuth(query);
      const { _meta } = resp?.data ?? {};
      setPagination((prevPagination) => ({
        ...prevPagination,
        totalCount: _meta?.totalCount,
        pageNo: _meta?.currentPage ?? prevPagination.pageNo,
        pageLimit: _meta?.perPage ?? prevPagination.pageLimit,
      }));
      setcsv(
        resp?.data?.data?.map((data, index) => {
          return <> {data?.csvPrice}</>;
        })
      );
      return resp?.data?.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (body) =>
      values?.propertyType ||
      values?.gross_area ||
      values?.condition ||
      values?.maxPrice ||
      values?.minPrice ||
      values?.minPriceEstimation ||
      values?.maxPriceEstimation ||
      values?.minExpectedRentalYield ||
      values?.maxExpectedRentalYield ||
      values?.minDaysToSale ||
      values?.maxDaysToSale ||
      values?.minPriceDelta ||
      values?.maxPriceDelta ||
      values?.minSize ||
      values?.maxSize ||
      values?.baths ||
      values?.rooms ||
      values?.floor ||
      values?.other_features_building.toString() ||
      values?.other_features_real_estate.toString() ||
      values?.date ||
      values?.minNet ||
      values?.maxNet
        ? customerSaveSearch(body)
        : "",
    onSuccess: (resp) => {
      if (resp?.status == 200) {
        toastAlert("success", t("SAVE_TOAST"));
        resetForm();

        navigate(`/customer/save-search`);
      } else {
        toastAlert("error", t("SAVE_FILTER"));
      }
    },
  });

  const handleOtherFeatures = (e) => {
    if (values?.other_features_building?.includes(e.target.value)) {
      return setFieldValue(
        "other_features_building",
        values?.other_features_building?.filter((i) => i !== e.target.value)
      );
    } else {
      return setFieldValue("other_features_building", [
        ...values.other_features_building,
        e.target.value,
      ]);
    }
  };

  const handleFeatures = (e) => {
    if (values?.other_features_real_estate?.includes(e.target.value)) {
      return setFieldValue(
        "other_features_real_estate",
        values?.other_features_real_estate?.filter((i) => i !== e.target.value)
      );
    } else {
      return setFieldValue("other_features_real_estate", [
        ...values.other_features_real_estate,
        e.target.value,
      ]);
    }
  };

  const handleStateFilterChange = (e) => {
    console.log(e.target.value),
    setPagination({
      ...pagination,
      sort: e.target.value,
      pageNo: 1, // Reset page number to 1 when state filter changes
    });
  };
  const handelDownloadList = async () => {
    let query = {
      search: location?.state?.name,
      propertyType: values?.propertyType,
      minPrice: values?.minPrice,
      maxPrice: values?.maxPrice,
      minSize: values?.minSize,
      maxSize: values?.maxSize,
      rooms: values?.rooms,
      baths: values?.baths,
      condition: values?.condition,
      other_features_real_estate: values?.other_features_real_estate.toString(),
      other_features_building: values?.other_features_building.toString(),
      floor: values?.floor,
      date: values?.date,
      sort: pagination?.sort,
      minNet: values?.minNet,
      maxNet: values?.maxNet,
      lng: location?.state?.lat,
      lat: location?.state?.lng,
      type: values?.type,
      minPriceEstimation: values?.minPriceEstimation,
      maxPriceEstimation: values?.maxPriceEstimation,
      minExpectedRentalYield: values?.minExpectedRentalYield,
      maxExpectedRentalYield: values?.maxExpectedRentalYield,
      minDaysToSale: values?.minDaysToSale,
      maxDaysToSale: values?.maxDaysToSale,
      minPriceDelta: values?.minPriceDelta,
      maxPriceDelta: values?.maxPriceDelta,
    };
    const resp = await customerDownloadFull(query);
    navigate("/customer/cart");
  };

  return (
    <>
      <Header />
      <section className="searchsection listing-page">
        <Container>
          <div className="listing-page__head">
            <div>
              <h2 className="mainheading mb-1">
                {t("PROPERTY_FOR_SALE")}
                {location?.state?.name
                  ? ` in ${(location?.state?.name || "")
                      .split(",")
                      .map((part) => part.trim())
                      .filter((part) => part && part.toLowerCase() !== "undefined")
                      .join(", ")}`
                  : ""}
          </h2>
              <p className="listing-page__sub mb-0">
                {t("SHOWING")} {pagination?.totalCount ?? 0} {t("RESULT")}
                {values?.propertyType ? ` · ${values.propertyType}` : ""}
              </p>
                </div>
                  </div>

          <ListingFiltersBar
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            setFieldValue={setFieldValue}
            resetForm={resetForm}
            categoryList={categoryList}
            pagination={pagination}
            onSortChange={handleStateFilterChange}
            propertyCount={propertyList?.length || 0}
            moreOpen={moreFilters}
            setMoreOpen={setMoreFilters}
            handleFeatures={handleFeatures}
            handleOtherFeatures={handleOtherFeatures}
            onSaveSearch={(e) => {
              e?.preventDefault?.();
              handleSubmit();
            }}
            onDownload={() => navigate("/customer/product-list")}
          />

          <div className="listing-page__results">
              <div className="property-list">

                {propertyList?.length > 0 ? (
                  propertyList?.map((data, index) => {
                    const imageUrl = propertyThumbUrl(data);
                    return (
                      <div className="property_list_item" key={data?._id || index}>
                        <Row className="m-0">
                          {data?.categoryId == "Business" ? (
                            <>
                              <Col lg={3} md={5} className="pe-0 ps-0">
                                <div className="single_property_img">
                                  <img
                                    src="/business.jpg"
                                    width="50px"
                                    height="50px"
                                    alt="Default Image"
                                  />
                                </div>
                              </Col>
                            </>
                          ) : (
                            <>
                              <Col lg={3} md={5} className="pe-0 ps-0">
                                <div className="single_property_img">
                                  <img
                                    src={imageUrl}
                                    width="50px"
                                    height="50px"
                                    alt={data?.name || `Property ${index + 1}`}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = PROPERTY_IMG_FALLBACK;
                                    }}
                                  />
                                </div>
                              </Col>
                            </>
                          )}

                          <Col lg={9} md={7} className="ps-0 pe-0">
                            {data?.categoryId == "Business" ? (
                              <>
                                <div className="single_property_text">
                                  <div className="single_property_top px-4">
                                    <div className="d-flex justify-content-between">
                                      <div>
                                        <h4>
                                          <Link
                                            className="item_title"
                                            to={`/customer/property-detail/${data?._id}`}
                                          >
                                            {data?.categoryId}
                                            <br />
                                            {truncate(data?.description, 100)}
                                          </Link>
                                        </h4>
                                      </div>
                                      <div className="d-flex">
                                        <span>
                                          <Link>
                                            {data?.isFavourite ? (
                                              <>
                                                <FaHeart
                                                  style={{
                                                    color: "#D62F2F",
                                                    width: "20",
                                                    height: "20",
                                                  }}
                                                  onClick={() => {
                                                    let body = {
                                                      propertyId: data?._id,
                                                      isFavourite: 2,
                                                    };
                                                    addAndRemoveFavouritesMutation.mutate(
                                                      body
                                                    );
                                                  }}
                                                />
                                              </>
                                            ) : (
                                              <>
                                                <FaRegHeart
                                                  style={{
                                                    width: "20",
                                                    height: "20",
                                                  }}
                                                  onClick={() => {
                                                    let body = {
                                                      propertyId: data?._id,
                                                      isFavourite: 1,
                                                    };
                                                    addAndRemoveFavouritesMutation.mutate(
                                                      body
                                                    );
                                                  }}
                                                />
                                              </>
                                            )}
                                          </Link>
                                        </span>
                                      </div>
                                    </div>

                                    <div className="mb-3">
                                      <span
                                        style={{ cursor: "pointer" }}
                                        className="badge bg-success"
                                        onClick={() =>
                                          navigate(
                                            `/customer/property-detail/${data?._id}`
                                          )
                                        }
                                      >
                                        {t("SEE_VIEW")}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="single_property_text">
                                  <div className="single_property_top px-4">
                                    <div className="d-flex justify-content-between">
                                      <div>
                                        <h4>
                                          <Link
                                            className="item_title"
                                            to={`/customer/property-detail/${data?._id}`}
                                          >
                                            {data?.categoryId == "Business"
                                              ? data?.description
                                              : data?.type_of_real_estate +
                                                " in " +
                                                data?.street}
                                          </Link>
                                        </h4>
                                        <span className="price">
                                          <b>
                                            {constant.EURO}
                                            {Number(
                                              data?.price
                                            )?.toLocaleString()}
                                          </b>
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span>
                                          <Link>
                                            {data?.isFavourite ? (
                                              <>
                                                <FaHeart
                                                  style={{
                                                    color: "#D62F2F",
                                                    width: "20",
                                                    height: "20",
                                                  }}
                                                  onClick={() => {
                                                    let body = {
                                                      propertyId: data?._id,
                                                      isFavourite: 2,
                                                    };
                                                    addAndRemoveFavouritesMutation.mutate(
                                                      body
                                                    );
                                                  }}
                                                />
                                              </>
                                            ) : (
                                              <>
                                                <FaRegHeart
                                                  style={{
                                                    width: "20",
                                                    height: "20",
                                                  }}
                                                  onClick={() => {
                                                    let body = {
                                                      propertyId: data?._id,
                                                      isFavourite: 1,
                                                    };
                                                    addAndRemoveFavouritesMutation.mutate(
                                                      body
                                                    );
                                                  }}
                                                />
                                              </>
                                            )}
                                          </Link>
                                        </span>
                                      </div>
                                    </div>
                                    <p className="mt-2">
                                      <span>
                                        <b className="text-dark">
                                          {t("ROOMS")} :&nbsp;
                                        </b>
                                        {data?.rooms}
                                      </span>
                                      &nbsp; &nbsp;&nbsp;
                                      <span>
                                        <b className="text-dark">
                                          {t("GROSS_AREA")} : &nbsp;
                                        </b>
                                        &nbsp;
                                        {data?.gross_area + " " + "m2"}
                                      </span>
                                      &nbsp; &nbsp;&nbsp;
                                      <span>
                                        <b className="text-dark">
                                          {t("NET_AREA")}:
                                        </b>
                                        &nbsp;
                                        {data?.net_area + " " + "m2"}
                                      </span>
                                      &nbsp;&nbsp; &nbsp;
                                      <span>
                                        <b className="text-dark">
                                          {t("FLOOR")} : &nbsp;
                                        </b>
                                        {data?.floor}
                                      </span>
                                      &nbsp;&nbsp; &nbsp;
                                      <span>
                                        <b className="text-dark">
                                          {t("ELEVATOR")} : &nbsp;
                                        </b>
                                        {data?.elevator === constant.LIFT_YES
                                          ? t("YES")
                                          : t("NO")}
                                      </span>
                                      &nbsp;&nbsp;&nbsp;
                                      <span>
                                        <b className="text-dark">
                                          {t("RENTAL_YIELD")} :&nbsp;
                                        </b>
                                        {data.expectedRentalYield || "N/A"}{data.expectedRentalYield && "%"}
                                      </span>
                                      &nbsp;&nbsp;&nbsp;
                                      <span>
                                        <b className="text-dark">
                                          {t("DAYS_TO_SALE")} : &nbsp;
                                        </b>
                                        &nbsp;
                                        {data?.daysToSale || "N/A"}
                                      </span>
                                      &nbsp; &nbsp;&nbsp;
                                      <span>
                                        <b className="text-dark">
                                          {t("PRICE_ESTIMATION")}:
                                        </b>
                                        &nbsp;
                                        {data?.priceEstimation && constant.EURO}{data?.priceEstimation || "N/A"}
                                      </span>
                                      &nbsp;&nbsp; &nbsp;
                                      <span>
                                      <b className="text-dark">
                                        {t("PRICE_DELTA")} : &nbsp;
                                      </b>
                                      {data?.priceDelta || "N/A"}{data?.priceDelta && "%"}
                                      </span>
                                      &nbsp;&nbsp; &nbsp;
                                    </p>
                                    <p>{truncate(data?.description, 250)}</p>
                                    {/* <p>
                                      <span>
                                        <b>{t("PROPERTY_TYPE")} :&nbsp;</b>
                                        <b>{data?.categoryId}</b>
                                      </span>
                                    </p> */}

                                    <div className="mb-3 d-flex">
                                      <span
                                        style={{ cursor: "pointer" }}
                                        className="badge bg-success"
                                        onClick={() =>
                                          navigate(
                                            `/customer/property-detail/${data?._id}`
                                          )
                                        }
                                      >
                                        {t("SEE_VIEW")}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </Col>
                        </Row>
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <DataNotFound />
                  </div>
                )}
              </div>

              {Math.ceil(pagination.totalCount / constant.PER_PAGE_THIRTY) >
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
                      pagination.totalCount / constant.PER_PAGE_THIRTY
                    )}
                  />
                </div>
              )}
          </div>
        </Container>
      </section>

      <Footer />

      <Modal show={show} className="csv-modal">
        <Modal.Body className="text-center">
          <div className="px-4 ">
            <img src="../../csv.png" className="csvimg" />
            <br /> <br />
            <h4>You can't directly download full list</h4>
            <p>
              You can't directly download full list ,you have to firstly click
              on add to cart and pay the payment.
            </p>
            <Row className="mt-4">
              <Col md={8} className="mx-auto">
                <button className="btn btn-theme2 w-100" onClick={handleClose}>
                  Okay
                </button>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
      {isFetching || addAndRemoveFavouritesMutation?.isPending ? (
        <Loader />
      ) : (
        ""
      )}
    </>
  );
};

export default AllPropertyList;
