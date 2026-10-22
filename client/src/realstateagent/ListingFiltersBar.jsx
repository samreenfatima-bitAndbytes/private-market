import React from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CustomSelect from "../components/CustomSelect";
import { restrictAlpha } from "../utils/Functions";
import { constant } from "../utils/constant";

/** Matches seeded listing types (not CMS categories). */
const PROPERTY_TYPES = [
  "FLAT / APARTMENT",
  "DUPLEX",
  "PENTHOUSE",
  "STUDIO APARTMENT/LOFT",
];

function ChipGroup({ label, name, value, options, onPick, className = "" }) {
  return (
    <div className={`lf-field ${className}`.trim()}>
      <label>{label}</label>
      <div className="lf-chips" role="group" aria-label={label}>
        {options.map((opt) => {
          const active = String(value) === String(opt.value);
          return (
            <button
              key={String(opt.value)}
              type="button"
              className={`lf-chip${active ? " is-active" : ""}`}
              onClick={() => onPick(name, active ? "" : opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RangeField({
  label,
  minName,
  maxName,
  minValue,
  maxValue,
  minPlaceholder,
  maxPlaceholder,
  onChange,
  onBlur,
}) {
  return (
    <div className="lf-field lf-field--range">
      <label>{label}</label>
      <div className="lf-range">
        <Form.Control
          type="text"
          inputMode="numeric"
          placeholder={minPlaceholder || "Min"}
          name={minName}
          value={minValue}
          onChange={onChange}
          onBlur={onBlur}
          onKeyPress={restrictAlpha}
          maxLength={12}
        />
        <span className="lf-range__sep">–</span>
        <Form.Control
          type="text"
          inputMode="numeric"
          placeholder={maxPlaceholder || "Max"}
          name={maxName}
          value={maxValue}
          onChange={onChange}
          onBlur={onBlur}
          onKeyPress={restrictAlpha}
          maxLength={12}
        />
      </div>
    </div>
  );
}

export default function ListingFiltersBar({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  resetForm,
  pagination,
  onSortChange,
  propertyCount,
  moreOpen,
  setMoreOpen,
  handleFeatures,
  handleOtherFeatures,
  onSaveSearch,
  onDownload,
}) {
  const { t } = useTranslation();

  const moreActiveCount = [
    values?.minSize,
    values?.maxSize,
    values?.minNet,
    values?.maxNet,
    values?.minPriceEstimation,
    values?.maxPriceEstimation,
    values?.minExpectedRentalYield,
    values?.maxExpectedRentalYield,
    values?.minDaysToSale,
    values?.maxDaysToSale,
    values?.minPriceDelta,
    values?.maxPriceDelta,
    values?.condition,
    values?.floor,
    values?.date,
    ...(values?.other_features_real_estate || []),
    ...(values?.other_features_building || []),
  ].filter(Boolean).length;

  const pick = (field, next) => setFieldValue(field, next);

  return (
    <Form
      className="listing-filters"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="listing-filters__toolbar">
        <p className="listing-filters__hint mb-0">
          Filters update results instantly
        </p>
        <div className="listing-filters__toolbar-actions">
          <button type="button" className="btn btn-theme2" onClick={onDownload}>
            {t("DOWNLOAD_FULL_LIST")}
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={onSaveSearch}
          >
            {t("SAVE_SEARCH")}
          </button>
        </div>
      </div>

      <div className="listing-filters__primary">
        <div className="lf-field">
          <label>{t("PROPERTY_TYPE")}</label>
          <CustomSelect
            name="propertyType"
            formikCompatible
            value={values?.propertyType ?? ""}
            onChange={handleChange}
            placeholder="Any type"
            aria-label={t("PROPERTY_TYPE")}
            options={[
              { value: "", label: "Any type" },
              ...PROPERTY_TYPES.map((type) => ({
                value: type,
                label: type,
              })),
            ]}
          />
        </div>

        <RangeField
          label={`${t("PRICE")} (€)`}
          minName="minPrice"
          maxName="maxPrice"
          minValue={values?.minPrice}
          maxValue={values?.maxPrice}
          minPlaceholder="Min €"
          maxPlaceholder="Max €"
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <ChipGroup
          label={t("ROOMS")}
          name="rooms"
          value={values?.rooms}
          onPick={pick}
          options={[
            { value: constant.PROPERTY_ROOM_1, label: "1" },
            { value: constant.PROPERTY_ROOM_2, label: "2" },
            { value: constant.PROPERTY_ROOM_3, label: "3" },
            { value: constant.PROPERTY_ROOM_4, label: "4+" },
          ]}
        />

        <ChipGroup
          label={t("BATHROOMS")}
          name="baths"
          value={values?.baths}
          onPick={pick}
          options={[
            { value: constant.PROPERTY_BATH_1, label: "1" },
            { value: constant.PROPERTY_BATH_2, label: "2" },
            { value: constant.PROPERTY_BATH_3, label: "3" },
            { value: constant.PROPERTY_BATH_4, label: "4+" },
          ]}
        />

        <div className="lf-field">
          <label>{t("SORT_BY")}</label>
          <CustomSelect
            disabled={propertyCount <= 0}
            value={pagination.sort ?? ""}
            onChange={(val) =>
              onSortChange({ target: { value: val } })
            }
            placeholder="Default"
            aria-label={t("SORT_BY")}
            options={[
              { value: "", label: "Default" },
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
                value: constant.PROPERTY_BIGGEST_GROSS,
                label: t("BIGGEST_GROSS_AREA"),
              },
              {
                value: constant.PROPERTY_LOWEST_GROSS,
                label: t("LOWEST_GROSS_AREA"),
              },
              {
                value: constant.PROPERTY_HIGHEST_RENTAL_YIELD,
                label: t("HIGHEST_RENTAL_YIELD"),
              },
              {
                value: constant.PROPERTY_LOWEST_RENTAL_YIELD,
                label: t("LOWEST_RENTAL_YIELD"),
              },
            ]}
          />
        </div>

        <div className="lf-field lf-field--btns">
          <label>&nbsp;</label>
          <div className="lf-btns">
            <button
              type="button"
              className={`btn btn-light lf-more-btn${moreOpen ? " is-open" : ""}`}
              onClick={() => setMoreOpen(!moreOpen)}
            >
              {moreOpen ? "Hide filters" : "More filters"}
              {moreActiveCount > 0 ? ` · ${moreActiveCount}` : ""}
            </button>
            <button
              type="button"
              className="btn btn-link lf-clear"
              onClick={() => {
                resetForm();
                onSortChange({ target: { value: "" } });
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {moreOpen && (
        <div className="listing-filters__more">
          <div className="lf-section">
            <h4 className="lf-section__title">Size &amp; investment</h4>
            <div className="lf-section__grid">
              <RangeField
                label={`${t("GROSS_AREA")} (m²)`}
                minName="minSize"
                maxName="maxSize"
                minValue={values?.minSize}
                maxValue={values?.maxSize}
                minPlaceholder="Min"
                maxPlaceholder="Max"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <RangeField
                label={`${t("NET_AREA")} (m²)`}
                minName="minNet"
                maxName="maxNet"
                minValue={values?.minNet}
                maxValue={values?.maxNet}
                minPlaceholder="Min"
                maxPlaceholder="Max"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <RangeField
                label={`${t("RENTAL_YIELD")} (%)`}
                minName="minExpectedRentalYield"
                maxName="maxExpectedRentalYield"
                minValue={values?.minExpectedRentalYield}
                maxValue={values?.maxExpectedRentalYield}
                minPlaceholder="Min"
                maxPlaceholder="Max"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <RangeField
                label={`${t("PRICE_ESTIMATION")} (€)`}
                minName="minPriceEstimation"
                maxName="maxPriceEstimation"
                minValue={values?.minPriceEstimation}
                maxValue={values?.maxPriceEstimation}
                minPlaceholder="Min"
                maxPlaceholder="Max"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <RangeField
                label={t("DAYS_TO_SALE")}
                minName="minDaysToSale"
                maxName="maxDaysToSale"
                minValue={values?.minDaysToSale}
                maxValue={values?.maxDaysToSale}
                minPlaceholder="Min"
                maxPlaceholder="Max"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <RangeField
                label={`${t("PRICE_DELTA")} (%)`}
                minName="minPriceDelta"
                maxName="maxPriceDelta"
                minValue={values?.minPriceDelta}
                maxValue={values?.maxPriceDelta}
                minPlaceholder="Min"
                maxPlaceholder="Max"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="lf-section">
            <h4 className="lf-section__title">Property details</h4>
            <div className="lf-section__grid lf-section__grid--chips">
              <ChipGroup
                label={t("CONDITION")}
                name="condition"
                value={values?.condition}
                onPick={pick}
                options={[
                  { value: "Good", label: t("GOOD_CONDITION") },
                  { value: "Needs renovating", label: t("NEEDS_RENOVATING") },
                  { value: "New", label: "New" },
                ]}
              />
              <ChipGroup
                label={t("FLOOR")}
                name="floor"
                value={values?.floor}
                onPick={pick}
                options={[
                  { value: constant.PROPERTY_FLOOR_1, label: "1" },
                  { value: constant.PROPERTY_FLOOR_2, label: "2" },
                  { value: constant.PROPERTY_FLOOR_3, label: "3" },
                  { value: constant.PROPERTY_FLOOR_4, label: "4+" },
                ]}
              />
              <ChipGroup
                label={t("PUBLICATION_DATE")}
                name="date"
                value={values?.date}
                onPick={pick}
                options={[
                  { value: constant.FILTER_48_WEEK, label: t("LAST_48_HOURS") },
                  { value: constant.FILTER_LAST_WEEK, label: t("LAST_WEEK") },
                  { value: constant.FILTER_LAST_MONTH, label: t("LAST_MONTH") },
                ]}
              />
            </div>
          </div>

          <div className="lf-section">
            <h4 className="lf-section__title">{t("BUILDING_FEATURES")}</h4>
            <div className="lf-check-grid">
              {[
                ["Fitted wardrobes", t("FITTED_WARDROBES")],
                ["Terrace", t("TERRACE")],
                ["Air conditioning", t("AIR_CONDITIONING")],
                ["Storeroom", t("STOREROOM")],
                ["Balcony", t("BALCONY")],
                [
                  "Parking space/Single garage",
                  t("PARKING_SPACE/SINGLE_GARAGE"),
                ],
              ].map(([value, label]) => (
                <label key={value} className="lf-check">
                  <input
                    type="checkbox"
                    onChange={handleFeatures}
                    name={value}
                    value={value}
                    checked={Boolean(
                      values?.other_features_real_estate?.includes(value)
                    )}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="lf-section">
            <h4 className="lf-section__title">{t("OTHER_FEATURES")}</h4>
            <div className="lf-check-grid">
              {[
                ["Swimming pool", t("SWIMMING_POOL")],
                ["Garden area", t("GARDEN_AREA")],
              ].map(([value, label]) => (
                <label key={value} className="lf-check">
                  <input
                    type="checkbox"
                    name={value}
                    value={value}
                    onChange={handleOtherFeatures}
                    checked={Boolean(
                      values?.other_features_building?.includes(value)
                    )}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </Form>
  );
}
