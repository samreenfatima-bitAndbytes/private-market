import React from "react";
import "./notfound.scss";
import { useTranslation } from "react-i18next";

const DataNotFound = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="data-not">{t("DATA_NOT_FOUND")}</div>
    </>
  );
};

export default DataNotFound;
