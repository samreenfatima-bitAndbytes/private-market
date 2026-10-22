/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import { useQuery } from "@tanstack/react-query";
import { React, useState } from "react";
import { Col, Container, Form, FormLabel, Row } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "swiper/swiper-bundle.css";
import CustomSelect from "../components/CustomSelect";
import DataNotFound from "../components/DataNotFound";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useDebounceEffect } from "../hooks/UseDebounceEffect";
import {
  customerActiveProperty,
  getPropertySearch,
} from "../services/Services";
import { restrictAlpha, truncate } from "../utils/Functions";
import { toastAlert } from "../utils/SweetAlert";
import { constant } from "../utils/constant";
import {
  PROPERTY_IMG_FALLBACK,
  propertyThumbUrl,
} from "../utils/propertyImages";
import "./search.scss";
import { useTranslation } from "react-i18next";
import Loader from "../Loader/Loader";
function Search() {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const [pagination, setPagination] = useState({
    pageNo: constant.PAGE_NO_ONE,
    pageLimit: constant.PER_PAGE_THIRTY,
    search: location?.state?.name ?? "",
    propertyType: location?.state?.property_type ?? "",
    maxPrice: "",
    minPrice: "",
    maxSize: "",
    minSize: "",
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
    lng: location?.state?.lat,
    lat: location?.state?.lng,
    parish: location?.state?.parish,
    municipality: location?.state?.municipality,
    district: location?.state?.district,
    minPriceEstimation: "",
    maxPriceEstimation: "",
    minExpectedRentalYield: "",
    maxExpectedRentalYield: "",
    minDaysToSale: "",
    maxDaysToSale: "",
    minPriceDelta: "",
    maxPriceDelta: "",
  });

  const debouncedSearch = useDebounceEffect(pagination?.search, 1000);
  const { data: propertyList, isFetching } = useQuery({
    queryKey: [
      "property-list",
      {
        parish: pagination?.parish,
        municipality: pagination?.municipality,
        district: pagination?.district,
        page: pagination.pageNo,
        limit: pagination.pageLimit,
        search: debouncedSearch,
        propertyType: pagination?.propertyType,
        maxPrice: pagination?.maxPrice,
        minPrice: pagination?.minPrice,
        maxSize: pagination?.maxSize,
        minSize: pagination?.minSize,
        condition: pagination?.condition,
        other_features_real_estate:
          pagination?.other_features_real_estate?.toString(),
        other_features_building:
          pagination?.other_features_building?.toString(),
        baths: pagination?.baths,
        rooms: pagination?.rooms,
        floor: pagination?.floor,
        gross_area: pagination?.gross_area,
        date: pagination?.date,
        sort: pagination?.sort,
        minNet: pagination?.minNet,
        maxNet: pagination?.maxNet,
        lng: pagination?.lat,
        lat: pagination?.lng,
        minPriceEstimation: pagination?.minPriceEstimation,
        maxPriceEstimation: pagination?.maxPriceEstimation,
        minExpectedRentalYield: pagination?.minExpectedRentalYield,
        maxExpectedRentalYield: pagination?.maxExpectedRentalYield,
        minDaysToSale: pagination?.minDaysToSale,
        maxDaysToSale: pagination?.maxDaysToSale,
        minPriceDelta: pagination?.minPriceDelta,
        maxPriceDelta: pagination?.maxPriceDelta,
      },
    ],
    queryFn: async ({ queryKey }) => {
      const [_key, query] = queryKey;
      const resp = await getPropertySearch(query);
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

  const { data: categoryList } = useQuery({
    queryKey: ["category-list"],
    queryFn: async ({ queryKey }) => {
      const [_key, query] = queryKey;
      const resp = await customerActiveProperty(query);
      return resp?.data?.data ?? [];
    },
  });
  const handleChange = (e) => {
    setPagination({
      ...pagination,
      propertyType: e.target.value,
      pageNo: 1, // Reset page number to 1 when state filter changes
    });
  };

  const handleStateFilterChange = (e) => {
    setPagination({
      ...pagination,
      sort: e.target.value,
      pageNo: 1, // Reset page number to 1 when state filter changes
    });
  };

  const handleotherFeaturesEstate = (e) => {
    if (pagination?.other_features_real_estate?.includes(e.target.value)) {
      return setPagination({
        ...pagination,
        other_features_real_estate:
          pagination?.other_features_real_estate?.filter(
            (i) => i !== e.target.value
          ),
        pageNo: 1,
      });
    } else {
      return setPagination({
        ...pagination,
        other_features_real_estate: [
          ...pagination?.other_features_real_estate,
          e.target.value,
        ],
        pageNo: 1, // Reset page number to 1 when state filter changes
      });
    }
  };

  const handleOtherFeatures = (e) => {
    if (pagination?.other_features_building?.includes(e.target.value)) {
      return setPagination({
        ...pagination,
        other_features_building: pagination?.other_features_building?.filter(
          (i) => i !== e.target.value
        ),
        pageNo: 1,
      });
    } else {
      return setPagination({
        ...pagination,
        other_features_building: [
          ...pagination?.other_features_building,
          e.target.value,
        ],
        pageNo: 1, // Reset page number to 1 when state filter changes
      });
    }
  };

  return (
    <>
      <Header />
      <section className="searchsection">
        <Container>
          <h2 className="mainheading mb-4">
            {t("PROPERTY_FOR_SALE")}{" "}
            {pagination?.search && pagination?.search && "in"}{" "}
            {(location?.state?.name || "")
              .split(",")
              .map((part) => part.trim())
              .filter((part) => part && part.toLowerCase() !== "undefined")
              .join(", ")}
            ,{" "}
            {pagination?.totalCount ?? 0} &nbsp;
            {pagination?.propertyType ?? "Property"} {t("FOUND")}
          </h2>
          <Row>
            <Col md={3}>
              <button
                className="btn btn-theme2 mb-4 w-100"
                onClick={() => navigate("/product-list")}
              >
                {t("DOWNLOAD_FULL_LIST")}
              </button>
              <div className="save-search-box ">
                <button
                  className="btn btn-white w-100"
                  type="submit"
                  onClick={() => {
                    toastAlert("error", t("ADD_SAVE_SEARCH"));
                  }}
                >
                  {t("SAVE_SEARCH")}
                </button>
              </div>
              <aside className="listing-aside">
                <div className="form-Group mb-4">
                  <FormLabel>{t("PROPERTY_TYPE")}</FormLabel>
                  <CustomSelect
                    name="propertyType"
                    formikCompatible
                    value={pagination?.propertyType ?? ""}
                    onChange={handleChange}
                    placeholder={`-- ${t("PROPERTY_TYPE")} --`}
                    aria-label={t("PROPERTY_TYPE")}
                    options={[
                      {
                        value: "",
                        label: `-- ${t("PROPERTY_TYPE")} --`,
                      },
                      ...(categoryList?.map((data) => ({
                        value: data?.name,
                        label: data?.name,
                      })) ?? []),
                    ]}
                  />
                </div>
                <div className="form-Group mb-4">
                  <label>{t("PRICE")}</label>
                  <Row className="align-items-center">
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="Min"
                        value={pagination?.minPrice}
                        onKeyPress={restrictAlpha}
                        maxLength={10}
                        onChange={(e) =>
                          setPagination({
                            ...pagination,
                            minPrice: e.target.value,
                          })
                        }
                      />
                    </Col>
                    <Col className="divide">
                      <span>-</span>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="Max"
                        name="maxPrice"
                        onKeyPress={restrictAlpha}
                        maxLength={10}
                        onChange={(e) =>
                          setPagination({
                            ...pagination,
                            maxPrice: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                </div>
                <div className="form-Group mb-4">
                  <label>{t("GROSS_AREA")}</label>
                  <Row className="align-items-center">
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="Min"
                        name="minSize"
                        maxLength={10}
                        onKeyPress={restrictAlpha}
                        onChange={(e) =>
                          setPagination({
                            ...pagination,
                            minSize: e.target.value,
                          })
                        }
                      />
                    </Col>
                    <Col className="divide">
                      <span>-</span>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="Max"
                        name="maxSize"
                        maxLength={10}
                        onKeyPress={restrictAlpha}
                        onChange={(e) =>
                          setPagination({
                            ...pagination,
                            maxSize: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                </div>

                <div className="form-Group mb-4">
                  <label>{t("NET_AREA")}</label>
                  <Row className="align-items-center">
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="Min"
                        name="minNet"
                        maxLength={10}
                        onKeyPress={restrictAlpha}
                        onChange={(e) =>
                          setPagination({
                            ...pagination,
                            minNet: e.target.value,
                          })
                        }
                      />
                    </Col>
                    <Col className="divide">
                      <span>-</span>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="Max"
                        name="maxNet"
                        maxLength={10}
                        onKeyPress={restrictAlpha}
                        onChange={(e) =>
                          setPagination({
                            ...pagination,
                            maxNet: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                </div>
                
                <div className="form-Group mb-4">
                    <label>{t("PRICE_ESTIMATION")}</label>
                    <Row className="align-items-center">
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Min"
                          name="minPriceEstimation"
                          onChange={(e) => setPagination(pagination => ({
                            ...pagination,
                            minPriceEstimation: e.target.value
                          }))}                          
                          value={pagination?.minPriceEstimation}
                          onKeyPress={restrictAlpha}
                          maxLength={20}
                        />
                      </Col>
                      <Col className="divide">
                        <span>-</span>
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Max"
                          name="maxPriceEstimation"
                          onChange={(e) => setPagination(pagination => ({
                            ...pagination,
                            maxPriceEstimation: e.target.value
                          }))}                          
                          value={pagination?.maxPriceEstimation}
                          onKeyPress={restrictAlpha}
                          maxLength={20}
                        />
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="form-Group mb-4">
                    <label>{t("RENTAL_YIELD")}</label>
                    <Row className="align-items-center">
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Min"
                          name="minExpectedRentalYield"
                          onChange={(e) => setPagination(pagination => ({
                            ...pagination,
                            minExpectedRentalYield: e.target.value
                          }))}
                          value={pagination?.minExpectedRentalYield}
                          onKeyPress={restrictAlpha}
                          maxLength={20}
                        />
                      </Col>
                      <Col className="divide">
                        <span>-</span>
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Max"
                          name="maxExpectedRentalYield"
                          onChange={(e) => setPagination(pagination => ({
                            ...pagination,
                            maxExpectedRentalYield: e.target.value
                          }))}
                          value={pagination?.maxExpectedRentalYield}
                          onKeyPress={restrictAlpha}
                          maxLength={20}
                        />
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="form-Group mb-4">
                    <label>{t("DAYS_TO_SALE")}</label>
                    <Row className="align-items-center">
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Min"
                          name="minDaysToSale"
                          onChange={(e) => setPagination(pagination => ({
                            ...pagination,
                            minDaysToSale: e.target.value
                          }))}
                          value={pagination?.minDaysToSale}
                          onKeyPress={restrictAlpha}
                          maxLength={20}
                        />
                      </Col>
                      <Col className="divide">
                        <span>-</span>
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Max"
                          name="maxDaysToSale"
                          onChange={(e) => setPagination(pagination => ({
                            ...pagination,
                            maxDaysToSale: e.target.value
                          }))}
                          value={pagination?.maxDaysToSale}
                          onKeyPress={restrictAlpha}
                          maxLength={20}
                        />
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="form-Group mb-4">
                    <label>{t("PRICE_DELTA")}</label>
                    <Row className="align-items-center">
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Min"
                          name="minPriceDelta"
                          onChange={(e) => setPagination(pagination => ({
                            ...pagination,
                            minPriceDelta: e.target.value
                          }))}
                          value={pagination?.minPriceDelta}
                          onKeyPress={restrictAlpha}
                          maxLength={20}
                        />
                      </Col>
                      <Col className="divide">
                        <span>-</span>
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Max"
                          name="maxPriceDelta"
                          onChange={(e) => setPagination(pagination => ({
                            ...pagination,
                            maxPriceDelta: e.target.value
                          }))}
                          value={pagination?.maxPriceDelta}
                          onKeyPress={restrictAlpha}
                          maxLength={20}
                        />
                      </Col>
                    </Row>
                  </div>
                <div className="form-group mb-4 ">
                  <label>{t("ROOMS")}</label>
                  <Form>
                    <div className="mb-3">
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="rooms"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              rooms: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              rooms: e.target.value == pagination.rooms && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_ROOM_1 == pagination?.rooms
                          }
                          value={constant.PROPERTY_ROOM_1}
                          id="1"
                        />
                        <label className="ms-2 " htmlFor="1">
                          {t("1_ROOMS")}
                        </label>
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="rooms"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              rooms: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              rooms: e.target.value == pagination.rooms && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_ROOM_2 == pagination?.rooms
                          }
                          value={constant.PROPERTY_ROOM_2}
                          id="2"
                        />
                        <label className="ms-2" htmlFor="2">
                          {t("2_ROOMS")}
                        </label>
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="rooms"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              rooms: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              rooms: e.target.value == pagination.rooms && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_ROOM_3 == pagination?.rooms
                          }
                          value={constant.PROPERTY_ROOM_3}
                          id="3"
                        />
                        <label className="ms-2 " htmlFor="3">
                          {t("3_ROOMS")}
                        </label>
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="rooms"
                          onChange={(e) => {
                            setPagination({
                              ...pagination,
                              rooms: e.target.value,
                            });
                          }}
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              rooms: e.target.value == pagination.rooms && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_ROOM_4 == pagination?.rooms
                          }
                          value={constant.PROPERTY_ROOM_4}
                          id="4"
                        />
                        <label className="ms-2 " htmlFor="4">
                          {t("4_ROOMS_OR_MORE_THAN")}
                        </label>
                      </div>
                    </div>
                  </Form>
                </div>

                <div className="form-group mb-4">
                  <label>{t("BATHROOMS")}</label>
                  <Form>
                    <div className="mb-3">
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="baths"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              baths: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              baths: e.target.value == pagination.baths && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_BATH_1 == pagination?.baths
                          }
                          value={constant.PROPERTY_BATH_1}
                          id="5"
                        />
                        <label className="ms-2 " htmlFor="5">
                          {t("1_BATH")}
                        </label>
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="baths"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              baths: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              baths: e.target.value == pagination.baths && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_BATH_2 == pagination?.baths
                          }
                          value={constant.PROPERTY_BATH_2}
                          id="6"
                        />
                        <label className="ms-2" htmlFor="6">
                          {t("2_BATH")}
                        </label>
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="baths"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              baths: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              baths: e.target.value == pagination.baths && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_BATH_3 == pagination?.baths
                          }
                          value={constant.PROPERTY_BATH_3}
                          id="7"
                        />
                        <label className="ms-2 " htmlFor="7">
                          {t("3_BATH")}
                        </label>
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="baths"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              baths: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              baths: e.target.value == pagination.baths && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_BATH_4 == pagination?.baths
                          }
                          value={constant.PROPERTY_BATH_4}
                          id="8"
                        />
                        <label className="ms-2 " htmlFor="8">
                          {t("4_BATH_OR_MORE_THAN")}
                        </label>
                      </div>
                    </div>
                  </Form>
                </div>

                <div className="form-group mb-4">
                  <label>{t("CONDITION")}</label>
                  <Form>
                    <div className="mb-3">
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="condition"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              condition: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              condition:
                                e.target.value == pagination.condition && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_GOOD_CONDITION ==
                            pagination?.condition
                          }
                          value={constant.PROPERTY_GOOD_CONDITION}
                          id="9"
                        />
                        <label className="ms-2 " htmlFor="9">
                          {t("GOOD_CONDITION")}
                        </label>
                      </div>

                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="condition"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              condition: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              condition:
                                e.target.value == pagination.condition && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_NEED_RENOVATING ==
                            pagination?.condition
                          }
                          value={constant.PROPERTY_NEED_RENOVATING}
                          id="10"
                        />
                        <label className="ms-2 " htmlFor="10">
                          {t("NEEDS_RENOVATING")}
                        </label>
                      </div>
                    </div>
                  </Form>
                </div>

                <div className="form-group mb-4">
                  <label>{t("BUILDING_FEATURES")}</label>

                  <Form>
                    <div className="mb-3">
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="checkbox"
                          onChange={handleotherFeaturesEstate}
                          value="Fitted wardrobes"
                          checked={pagination?.other_features_real_estate?.includes(
                            "Fitted wardrobes"
                          )}
                          id="Fitted wardrobes"
                          label={t("FITTED_WARDROBES")}
                        />
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="checkbox"
                          onChange={handleotherFeaturesEstate}
                          value="Terrace"
                          checked={pagination?.other_features_real_estate?.includes(
                            "Terrace"
                          )}
                          id="Terrace"
                          label={t("TERRACE")}
                        />
                      </div>

                      <div className="d-flex mb-2">
                        <Form.Check
                          type="checkbox"
                          onChange={handleotherFeaturesEstate}
                          value="Air conditioning"
                          checked={pagination?.other_features_real_estate?.includes(
                            "Air conditioning"
                          )}
                          id="Air conditioning"
                          label={t("AIR_CONDITIONING")}
                        />
                      </div>

                      <div className="d-flex mb-2">
                        <Form.Check
                          type="checkbox"
                          onChange={handleotherFeaturesEstate}
                          value="Storeroom"
                          checked={pagination?.other_features_real_estate?.includes(
                            "Storeroom"
                          )}
                          id="Storeroom"
                          label={t("STOREROOM")}
                        />
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="checkbox"
                          onChange={handleotherFeaturesEstate}
                          value="Balcony"
                          checked={pagination?.other_features_real_estate?.includes(
                            "Balcony"
                          )}
                          id="Balcony"
                          label={t("BALCONY")}
                        />
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="checkbox"
                          onChange={handleotherFeaturesEstate}
                          value=" Parking space/Single garage"
                          checked={pagination?.other_features_real_estate?.includes(
                            " Parking space/Single garage"
                          )}
                          id=" Parking space/Single garage"
                          label={t("PARKING_SPACE/SINGLE_GARAGE")}
                        />
                      </div>
                    </div>
                  </Form>
                </div>

                <div className="form-group mb-4">
                  <label>{t("OTHER_FEATURES")} </label>

                  <Form>
                    <div className="mb-3">
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="checkbox"
                          value="Swimming pool"
                          onChange={handleOtherFeatures}
                          checked={pagination?.other_features_building?.includes(
                            "Swimming pool"
                          )}
                          id="Swimming pool"
                          label={t("SWIMMING_POOL")}
                        />
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="checkbox"
                          value="Garden area"
                          onChange={handleOtherFeatures}
                          checked={pagination?.other_features_building?.includes(
                            "Garden area"
                          )}
                          id="Garden area"
                          label={t("GARDEN_AREA")}
                        />
                      </div>
                    </div>
                  </Form>
                </div>

                <div className="form-group mb-4">
                  <label>{t("FLOOR")}</label>

                  <Form>
                    <div className="mb-3">
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="floor"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              floor: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              floor: e.target.value == pagination.floor && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_FLOOR_1 == pagination?.floor
                          }
                          value={constant.PROPERTY_BATH_1}
                          id="11"
                        />
                        <label className="ms-2 " htmlFor="11">
                          {t("1_FLOOR")}
                        </label>
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="floor"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              floor: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              floor: e.target.value == pagination.floor && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_FLOOR_2 == pagination?.floor
                          }
                          value={constant.PROPERTY_FLOOR_2}
                          id="12"
                        />
                        <label className="ms-2" htmlFor="12">
                          {t("2_FLOOR")}
                        </label>
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="floor"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              floor: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              floor: e.target.value == pagination.floor && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_FLOOR_3 == pagination?.floor
                          }
                          value={constant.PROPERTY_FLOOR_3}
                          id="13"
                        />
                        <label className="ms-2 " htmlFor="13">
                          {t("3_FLOOR")}
                        </label>
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="floor"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              floor: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              floor: e.target.value == pagination.floor && "",
                            });
                          }}
                          checked={
                            constant.PROPERTY_FLOOR_4 == pagination?.floor
                          }
                          value={constant.PROPERTY_FLOOR_4}
                          id="14"
                        />
                        <label className="ms-2 " htmlFor="14">
                          {t("4_FLOOR_OR_MORE_THAN")}
                        </label>
                      </div>
                    </div>
                  </Form>
                </div>

                <div className="form-group mb-4">
                  <label>{t("PUBLICATION_DATE")}</label>

                  <Form>
                    <div className="mb-3">
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="date"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              date: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              date: e.target.value == pagination.date && "",
                            });
                          }}
                          checked={constant.FILTER_48_WEEK == pagination?.date}
                          value={constant.FILTER_48_WEEK}
                          id="15"
                        />
                        <label className="ms-2 " htmlFor="15">
                          {t("LAST_48_HOURS")}
                        </label>
                      </div>
                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="date"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              date: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              date: e.target.value == pagination.date && "",
                            });
                          }}
                          checked={
                            constant.FILTER_LAST_WEEK == pagination?.date
                          }
                          value={constant.FILTER_LAST_WEEK}
                          id="16"
                        />
                        <label className="ms-2" htmlFor="16">
                          {t("LAST_WEEK")}
                        </label>
                      </div>

                      <div className="d-flex mb-2">
                        <Form.Check
                          type="radio"
                          name="date"
                          onChange={(e) =>
                            setPagination({
                              ...pagination,
                              date: e.target.value,
                            })
                          }
                          onClick={(e) => {
                            setPagination({
                              ...pagination,
                              date: e.target.value == pagination.date && "",
                            });
                          }}
                          checked={
                            constant.FILTER_LAST_MONTH == pagination?.date
                          }
                          value={constant.FILTER_LAST_MONTH}
                          id="17"
                        />
                        <label className="ms-2 " htmlFor="17">
                          {t("LAST_MONTH")}
                        </label>
                      </div>
                    </div>
                  </Form>
                </div>
              </aside>
            </Col>

            <Col md={9}>
              <Row>
                <Col md={4} lg={4}>
                  <h6 className="mt-2 mb-2">
                    {t("SHOWING")} {pagination?.totalCount} &nbsp;{t("RESULT")}
                  </h6>
                </Col>
                <Col md={5} lg={5}></Col>
                <Col md={3} lg={3}>
                  <div
                    className="order-by d-flex align-items-center justify-content-end"
                    data-param="ordem"
                  >
                    <CustomSelect
                      className="gross-drop"
                      disabled={propertyList?.length <= 0}
                      value={pagination.sort ?? ""}
                      onChange={(val) =>
                        handleStateFilterChange({ target: { value: val } })
                      }
                      placeholder={t("MORE")}
                      aria-label={t("SORT_BY")}
                      options={[
                        { value: "", label: t("MORE") },
                        {
                          value: constant.PROPERTY_BIGGEST_GROSS,
                          label: t("BIGGEST_GROSS_AREA"),
                        },
                        {
                          value: constant.PROPERTY_LOWEST_GROSS,
                          label: t("LOWEST_GROSS_AREA"),
                        },
                        {
                          value: constant.PROPERTY_BIGGEST_NET,
                          label: t("BIGGEST_NET_AREA"),
                        },
                        {
                          value: constant.PROPERTY_LOWEST_NET,
                          label: t("LOWEST_NET_AREA"),
                        },
                        {
                          value: constant.PROPERTY_RECENT,
                          label: t("MOST_RECENT"),
                        },
                        {
                          value: constant.PROPERTY_LEAST,
                          label: t("LEAST_RECENT"),
                        },
                        {
                          value: constant.PROPERTY_HIGHEST_PRICE,
                          label: t("HIGHEST_PRICE"),
                        },
                        {
                          value: constant.PROPERTY_LOWEST_PRICE,
                          label: t("LOWEST_PRICE"),
                        },
                        {
                          value: constant.PROPERTY_HIGHEST_FLOOR,
                          label: t("HIGHEST_FLOOR"),
                        },
                        {
                          value: constant.PROPERTY_LOWEST_FLOOR,
                          label: t("LOWEST_FLOOR"),
                        },
                        {
                          value: constant.PROPERTY_HIGHEST_ESTIMATED_PRICE,
                          label: t("HIGHEST_ESTIMATED_PRICE"),
                        },
                        {
                          value: constant.PROPERTY_LOWEST_ESTIMATED_PRICE,
                          label: t("LOWEST_ESTIMATED_PRICE"),
                        },
                        {
                          value: constant.PROPERTY_HIGHEST_RENTAL_YIELD,
                          label: t("HIGHEST_RENTAL_YIELD"),
                        },
                        {
                          value: constant.PROPERTY_LOWEST_RENTAL_YIELD,
                          label: t("LOWEST_RENTAL_YIELD"),
                        },
                        {
                          value: constant.PROPERTY_MAXIMUM_DAYS_TO_SALE,
                          label: t("MAXIMUM_DAYS_TO_SALE"),
                        },
                        {
                          value: constant.PROPERTY_MINIMUM_DAYS_TO_SALE,
                          label: t("MINIMUM_DAYS_TO_SALE"),
                        },
                        {
                          value: constant.PROPERTY_HIGHEST_PRICE_DELTA,
                          label: t("HIGHEST_PRICE_DELTA"),
                        },
                        {
                          value: constant.PROPERTY_LOWEST_PRICE_DELTA,
                          label: t("LOWEST_PRICE_DELTA"),
                        },
                      ]}
                    />
                  </div>
                </Col>
              </Row>

              <div className="property-list">
                {propertyList?.length > 0 ? (
                  propertyList?.map((data, index) => {
                    const imageUrl = propertyThumbUrl(data);
                    return (
                      <>
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
                                              to={`/search-detail/${data?._id}`}
                                            >
                                              {data?.categoryId}
                                              <br />
                                              {truncate(data?.description, 100)}
                                            </Link>
                                          </h4>
                                        </div>

                                        <div className="d-flex">
                                          <span>
                                            <Link
                                              onClick={() => {
                                                toastAlert(
                                                  "error",
                                                  t("ADD_FAVOURITE")
                                                );
                                              }}
                                            >
                                              <svg
                                                width="20"
                                                height="20"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                              >
                                                <path
                                                  fill="#004aad"
                                                  d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                                                />
                                              </svg>
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
                                              `/search-detail/${data?._id}`
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
                                              to={`/search-detail/${data?._id}`}
                                            >
                                              {data?.type_of_real_estate +
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
                                            <Link
                                              onClick={() => {
                                                toastAlert(
                                                  "error",
                                                  t("ADD_FAVOURITE")
                                                );
                                              }}
                                            >
                                              <svg
                                                width="20"
                                                height="20"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                              >
                                                <path
                                                  fill="#004aad"
                                                  d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                                                />
                                              </svg>
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

                                          {data?.gross_area + " " + "m2"}
                                        </span>
                                        &nbsp;&nbsp;&nbsp;
                                        <span>
                                          <b className="text-dark">
                                            {t("NET_AREA")}:
                                          </b>
                                          {data?.net_area + " " + "m2"}
                                        </span>
                                        &nbsp;&nbsp;&nbsp;
                                        <span>
                                          <b className="text-dark">
                                            {t("FLOOR")} : &nbsp;
                                          </b>
                                          {data?.floor}
                                        </span>
                                        &nbsp;&nbsp;&nbsp;
                                        <span>
                                          <b className="text-dark">
                                            {t("ELEVATOR")} : &nbsp;
                                          </b>
                                          &nbsp;
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
                                          {data?.priceEstimation && constant.EURO} {data?.priceEstimation || "N/A"}
                                        </span>
                                        &nbsp;&nbsp; &nbsp;
                                        <span>
                                        <b className="text-dark">
                                          {t("PRICE_DELTA")} : &nbsp;
                                        </b>
                                        {data?.priceDelta || "N/A"} {data?.priceDelta && "%"}
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
                                      <div className="mb-3">
                                        <span
                                          style={{ cursor: "pointer" }}
                                          className="badge bg-success"
                                          onClick={() =>
                                            navigate(
                                              `/search-detail/${data?._id}`
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
                      </>
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
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
      {isFetching && <Loader />}
    </>
  );
}

export default Search;
