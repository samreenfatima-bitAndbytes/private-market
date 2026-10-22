/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta

All Rights Reserved.
*/
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import Payment, { DummyPayment } from "./Payment";
import "./checkoutform.scss";

const isDummyStripe =
  String(import.meta.env.VITE_STRIPE_DUMMY || "true").toLowerCase() === "true";

const publishableKey =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51P2cPmRxk5j0MQHUOulX5UhsJa29gsJWfatr9QeiXSiii5PrJYwlgC2jYv9TGdqFBs0sTGhoypxVCIak5Cvwk0Kd00FELYyq6X";

function StripeCard() {
  if (isDummyStripe) {
    return <DummyPayment />;
  }

  const stripePromise = loadStripe(publishableKey);
  return (
    <Elements stripe={stripePromise}>
      <Payment />
    </Elements>
  );
}

export default StripeCard;
