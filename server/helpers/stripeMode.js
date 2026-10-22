/**
 * Local / Loom demo Stripe stub.
 * Enabled when STRIPE_API_KEY is missing, placeholder, or STRIPE_DUMMY=true.
 */
function isDummyStripe() {
  const key = String(process.env.STRIPE_API_KEY || "").trim();
  if (String(process.env.STRIPE_DUMMY || "").toLowerCase() === "true") {
    return true;
  }
  if (!key) return true;
  if (/replace_me|changeme|your_stripe|sk_test_xxx/i.test(key)) return true;
  return false;
}

const DEMO_CARD = {
  id: "pm_demo_visa_4242",
  object: "payment_method",
  customer: "cus_demo_local",
  type: "card",
  brand: "visa",
  country: "PT",
  exp_month: 12,
  exp_year: 2030,
  last4: "4242",
  created: Math.floor(Date.now() / 1000),
};

function demoCustomerId(user) {
  if (user?.customerId) return user.customerId;
  const id = user?._id || user?.id || "local";
  return `cus_demo_${String(id)}`;
}

function buildDemoCard(payload = {}, customerId) {
  const last4 = String(payload.last4 || "4242").replace(/\D/g, "").slice(-4);
  const brand = String(payload.brand || "visa").toLowerCase();
  let exp_month = Number(payload.exp_month) || 12;
  let exp_year = Number(payload.exp_year) || 2030;
  if (exp_year < 100) exp_year += 2000;
  if (exp_month < 1 || exp_month > 12) exp_month = 12;
  return {
    id: `pm_demo_${brand}_${last4}_${Date.now()}`,
    object: "payment_method",
    customer: customerId || "cus_demo_local",
    type: "card",
    brand,
    country: "PT",
    exp_month,
    exp_year,
    last4: last4.padStart(4, "0"),
    created: Math.floor(Date.now() / 1000),
  };
}

module.exports = {
  isDummyStripe,
  DEMO_CARD,
  demoCustomerId,
  buildDemoCard,
};
