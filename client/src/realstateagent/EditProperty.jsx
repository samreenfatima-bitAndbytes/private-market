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
import { useParams } from "react-router-dom";
import Addlist from "../addlist/Addlist";
import Addlist2 from "../addlist/Addlist2";
import Addlist3 from "../addlist/Addlist3";
import { agentPropertyView } from "../services/Services";
import { constant } from "../utils/constant";

const EditProperty = () => {
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [firstForm, setFirstForm] = useState({
    categoryId: "",
    year_of_construction: "",
    street: "",
    building_no: "",
    place: "",
    municipality: "",
    district: "",
    postalCode: "",
    baths: "",
    floor: "",
    rooms: "",
    elevator: constant.LIFT_YES,
    latitude: 0,
    longitude: 0,
  });

  const [secondForm, setSecondForm] = useState({
    houseType: constant.HOUSE_DETACHED,
    condition: constant.PROPERTY_NEED_RENOVATING,
    net_area: "",
    gross_area: "",
    link: "",
    reference: "",
    energy_class: "",
    position: constant.NORTH,
    other_features_real_estate: [],
    other_features_building: [],
    price: "",
    building_fee: "",
    description: "",
  });

  const [thirdForm, setThirdForm] = useState({
    propertyImgId: [],
  });

  const allValues = {
    ...firstForm,
    ...secondForm,
    ...thirdForm,
  };

  if (id) {
    useQuery({
      queryKey: ["cms-detail", id],
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey;
        const resp = await agentPropertyView(id);
        setFirstForm((prev) => ({
          ...prev,
          categoryId: resp?.data?.data?.categoryId ?? "",
          year_of_construction: resp?.data?.data?.year_of_construction ?? "",
          street: resp?.data?.data?.street ?? "",
          building_no: resp?.data?.data?.building_no ?? "",
          place: {
            label: resp?.data?.data?.place,
            value: resp?.data?.data?.place,
          },
          district: {
            label: resp?.data?.data?.district,
            value: resp?.data?.data?.district,
          },
          municipality: {
            label: resp?.data?.data?.municipality,
            value: resp?.data?.data?.municipality,
          },
      
          postalCode: resp?.data?.data?.postalCode ?? "",
          baths: resp?.data?.data?.baths ?? "",
          rooms: resp?.data?.data?.rooms ?? "",
          elevator: resp?.data?.data?.elevator ?? "",
          floor: resp?.data?.data?.floor ?? "",
          latitude: resp?.data?.data?.location?.coordinates[0],
          longitude: resp?.data?.data?.location?.coordinates[1],
          description: resp?.data?.data?.description,
        }));
        setSecondForm((prev) => ({
          ...prev,
          type_of_real_estate: resp?.data?.data?.type_of_real_estate ?? "",
          condition: resp?.data?.data?.condition ?? "",
          net_area: resp?.data?.data?.net_area ?? "",
          gross_area: resp?.data?.data?.gross_area ?? "",
          link: resp?.data?.data?.link ?? "",
          reference: resp?.data?.data?.reference ?? "",
          energy_class: resp?.data?.data?.energy_class ?? "",
          position: resp?.data?.data?.position ?? "",
          other_features_real_estate:
            resp?.data?.data?.other_features_real_estate ?? "",
          other_features_building:
            resp?.data?.data?.other_features_building ?? "",
          price: resp?.data?.data?.price ?? "",
          building_fee: resp?.data?.data?.building_fee ?? "",
          description: resp?.data?.data?.description ?? "",
        }));
        setThirdForm((prev) => ({
          ...prev,
          picked: resp?.data?.data?.propertyImgId,
          fileType: resp?.data?.data?.fileType,
        }));
        return resp?.data?.data;
      },
    });
  }

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  switch (step) {
    case 1:
      return (
        <>
          <Addlist
            firstForm={firstForm}
            setFirstForm={setFirstForm}
            nextStep={nextStep}
            id={id}
          />
        </>
      );

    case 2:
      return (
        <>
          <Addlist2
            secondForm={secondForm}
            setSecondForm={setSecondForm}
            nextStep={nextStep}
            prevStep={prevStep}
            id={id}
          />
        </>
      );

    case 3:
      return (
        <>
          <Addlist3
            thirdForm={thirdForm}
            setThirdForm={setThirdForm}
            prevStep={prevStep}
            allValues={allValues}
            id={id}
          />
        </>
      );
  }
};
export default EditProperty;
