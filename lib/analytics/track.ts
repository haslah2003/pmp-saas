// Conversion event helpers — fire GA4 + Meta Pixel events for the funnel.
//
// Safe to call anywhere: each call no-ops unless the underlying tag is loaded.
// gtag loads with Consent Mode (so GA sees consent-aware pings even pre-consent);
// fbq only exists after the visitor accepts cookies, so Meta events naturally
// respect consent. window.gtag / window.fbq types are declared in
// components/analytics/MarketingAnalytics.tsx.

type Params = Record<string, unknown>;

function gtagEvent(name: string, params?: Params) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params || {});
  }
}

function fbqTrack(name: string, params?: Params, eventID?: string) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (eventID) window.fbq('track', name, params || {}, { eventID });
    else window.fbq('track', name, params || {});
  }
}

/** Account created (paid-plan signup or free demo signup). */
export function trackSignup(opts: { plan?: string; demo?: boolean }) {
  gtagEvent('sign_up', {
    method: 'email',
    plan: opts.plan,
    demo: !!opts.demo,
  });
  fbqTrack('CompleteRegistration', {
    content_name: opts.plan,
    status: opts.demo ? 'demo' : 'registered',
  });
}

/** User started the PayPal checkout for a plan. */
export function trackBeginCheckout(opts: { plan: string; period: string; value: number }) {
  gtagEvent('begin_checkout', {
    currency: 'USD',
    value: opts.value,
    items: [{ item_id: opts.plan, item_name: opts.plan, item_category: opts.period, price: opts.value, quantity: 1 }],
  });
  fbqTrack('InitiateCheckout', {
    currency: 'USD',
    value: opts.value,
    content_ids: [opts.plan],
    content_type: 'product',
    contents: [{ id: opts.plan, quantity: 1, item_price: opts.value }],
  });
}

/**
 * Payment completed. Pass the receipt/transaction id so GA4 (transaction_id)
 * and Meta (eventID) can de-duplicate if the success page is reloaded.
 */
export function trackPurchase(opts: {
  transactionId?: string;
  plan: string;
  period: string;
  value: number;
}) {
  gtagEvent('purchase', {
    transaction_id: opts.transactionId,
    currency: 'USD',
    value: opts.value,
    items: [{ item_id: opts.plan, item_name: opts.plan, item_category: opts.period, price: opts.value, quantity: 1 }],
  });
  fbqTrack(
    'Purchase',
    {
      currency: 'USD',
      value: opts.value,
      content_ids: [opts.plan],
      content_type: 'product',
      contents: [{ id: opts.plan, quantity: 1, item_price: opts.value }],
    },
    opts.transactionId,
  );
}
