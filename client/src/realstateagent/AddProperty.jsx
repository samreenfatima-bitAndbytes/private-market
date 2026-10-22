/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import React, { useState } from "react";
import Addlist from "../addlist/Addlist";
import Addlist2 from "../addlist/Addlist2";
import Addlist3 from "../addlist/Addlist3";
import { constant } from "../utils/constant";

const AddProperty = () => {
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
    type_of_real_estate: constant.HOUSE_DETACHED,
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
          />
        </>
      );
  }
};

export default AddProperty;
