/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta

All Rights Reserved.
*/
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { customerAddCard } from "../../services/Services";
import { toastAlert } from "../../utils/SweetAlert";
import "./checkoutform.scss";

function useAddCardMutation(onSettledClear) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => customerAddCard(body),
    onSuccess: () => {
      toastAlert("success", t("CARD_ADD_TOAST"));
      onSettledClear?.();
      queryClient.invalidateQueries({ queryKey: ["cardList"] });
    },
    onError: (e) => {
      console.error(e);
      toastAlert("error", e?.response?.data?.message || "Could not add card");
    },
  });
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatCardNumber(value) {
  const digits = onlyDigits(value).slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

function detectBrand(digits) {
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "";
}

/** Local demo — Stripe Elements look, stubbed charge on the API */
export function DummyPayment() {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focused, setFocused] = useState("");
  const [fieldError, setFieldError] = useState("");
  const handleStripePayment = useAddCardMutation(() => {
    setNumber("");
    setExpiry("");
    setCvc("");
    setFieldError("");
  });

  const digits = onlyDigits(number);
  const brand = useMemo(() => detectBrand(digits), [digits]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFieldError("");

    const expDigits = onlyDigits(expiry);
    const month = Number(expDigits.slice(0, 2));
    const year = Number(expDigits.slice(2));
    const cvcDigits = onlyDigits(cvc);

    if (digits.length < 15) {
      setFieldError("Your card number is incomplete.");
      return;
    }
    if (expDigits.length < 4 || month < 1 || month > 12) {
      setFieldError("Your card’s expiration date is incomplete.");
      return;
    }
    if (cvcDigits.length < 3) {
      setFieldError("Your card’s security code is incomplete.");
      return;
    }
    // Accept Stripe test numbers (or any complete demo card)
    const okTest =
      digits === "4242424242424242" ||
      digits === "4000056655665556" ||
      digits === "5555555555554444";
    if (!okTest && digits.length === 16) {
      // Still allow for Loom, but nudge toward 4242
      // no-op — accept any 16-digit for local demo
    }

    const fullYear = year < 100 ? 2000 + year : year;
    setBusy(true);
    handleStripePayment.mutate(
      {
        cardTokenId: "tok_demo_visa",
        last4: digits.slice(-4),
        brand: brand || "visa",
        exp_month: month,
        exp_year: fullYear,
      },
      { onSettled: () => setBusy(false) }
    );
  };

  return (
    <div className="stripe-dummy-wrap">
      <form className="stripe-dummy-form" onSubmit={handleSubmit} noValidate>
        <label className="stripe-field-label">Card information</label>
        <div
          className={`stripe-card-shell ${focused ? "is-focused" : ""} ${
            fieldError ? "has-error" : ""
          }`}
        >
          <div className="stripe-row stripe-row-number">
            <input
              className="stripe-input"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="Card number"
              aria-label="Card number"
              value={number}
              onChange={(e) => setNumber(formatCardNumber(e.target.value))}
              onFocus={() => setFocused("number")}
              onBlur={() => setFocused("")}
            />
            <span className={`stripe-brand ${brand || "generic"}`} aria-hidden>
              {brand === "visa"
                ? "VISA"
                : brand === "mastercard"
                  ? "MC"
                  : brand === "amex"
                    ? "AMEX"
                    : ""}
            </span>
          </div>
          <div className="stripe-row stripe-row-meta">
            <input
              className="stripe-input"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM / YY"
              aria-label="Expiration"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              onFocus={() => setFocused("expiry")}
              onBlur={() => setFocused("")}
            />
            <input
              className="stripe-input stripe-input-cvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="CVC"
              aria-label="CVC"
              maxLength={4}
              value={cvc}
              onChange={(e) => setCvc(onlyDigits(e.target.value).slice(0, 4))}
              onFocus={() => setFocused("cvc")}
              onBlur={() => setFocused("")}
            />
          </div>
        </div>
        {fieldError ? <p className="stripe-error">{fieldError}</p> : null}
        <p className="stripe-hint">
          Use test card <strong>4242 4242 4242 4242</strong>, any future expiry,
          any CVC.
        </p>
        <button
          className="add-modal-btn me-0 w-100 my-3"
          type="submit"
          disabled={busy || handleStripePayment.isPending}
        >
          {busy || handleStripePayment.isPending ? t("LOADING") : t("ADD")}
        </button>
        <div className="stripe-powered">
          <span>Secured checkout</span>
          <span className="stripe-powered-mark">stripe</span>
        </div>
      </form>
    </div>
  );
}

/** Live Stripe Elements form */
const Payment = () => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(false);

  const handleStripePayment = useAddCardMutation(() => {
    try {
      elements?.getElement(CardElement)?.clear();
    } catch (_) {
      /* ignore */
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setError(true);
    const paymentResult = await stripe.createToken(
      elements.getElement(CardElement)
    );
    setError(false);
    if (paymentResult?.error) {
      toastAlert("error", paymentResult.error.message);
      return;
    }
    handleStripePayment.mutate({ cardTokenId: paymentResult?.token?.id });
  };

  return (
    <div style={{ padding: "1.5rem 1rem 0" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <form style={{ display: "block", width: "100%" }} onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CardElement
              className="card"
              options={{
                style: {
                  base: {
                    backgroundColor: "white",
                  },
                },
              }}
            />
            <button
              className="add-modal-btn me-0 w-100 my-3"
              type="submit"
              disabled={error || handleStripePayment.isPending}
            >
              {error || handleStripePayment.isPending ? t("LOADING") : t("ADD")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
