import React, { useEffect, useId, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./custom-select.scss";

/**
 * Branded dropdown — drop-in replacement for native <select>.
 * options: [{ value, label }]
 * onChange: (value: string) => void  OR  standard event-like for Formik
 */
const CustomSelect = ({
  value = "",
  onChange,
  options = [],
  placeholder = "Select",
  className = "",
  disabled = false,
  name,
  id,
  "aria-label": ariaLabel,
  formikCompatible = false,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const selectId = id || listId;

  const selected = options.find((o) => String(o.value) === String(value));
  const label = selected?.label ?? placeholder;
  const isPlaceholder = !selected || selected.value === "";

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const emitChange = (next) => {
    if (formikCompatible && name) {
      onChange?.({
        target: { name, value: next },
      });
    } else {
      onChange?.(next);
    }
    setOpen(false);
  };

  return (
    <div
      className={`pm-select ${open ? "is-open" : ""} ${
        disabled ? "is-disabled" : ""
      } ${className}`.trim()}
      ref={rootRef}
    >
      <button
        type="button"
        id={selectId}
        className={`pm-select__trigger ${
          isPlaceholder ? "is-placeholder" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel || placeholder}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        <span className="pm-select__label">{label}</span>
        <FaChevronDown className="pm-select__chevron" aria-hidden />
      </button>

      {open && !disabled && (
        <ul
          className="pm-select__menu"
          role="listbox"
          id={listId}
          aria-labelledby={selectId}
        >
          {options.map((opt) => {
            const active = String(opt.value) === String(value);
            return (
              <li
                key={`${opt.value}-${opt.label}`}
                role="option"
                aria-selected={active}
                className={`pm-select__option ${active ? "is-active" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  emitChange(opt.value);
                }}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
