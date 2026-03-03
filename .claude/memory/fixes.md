# Klox Systems - Applied Fixes Log

## Session 1 — Full Audit & Bug Fixes

### Critical

**1. `user.id` → `user.uid` (app.js `processCheckout`)**
Firebase user object exposes `uid`, not `id`. Orders were being created with `undefined` userId.

**2. UPI auto-complete race condition (app.js `handleGooglePaySend`)**
A `setTimeout(..., 2000)` was unconditionally completing orders 2 seconds after the UPI modal opened, regardless of user confirmation. Removed. Confirm button now wired with `addEventListener`.

**3. XSS in UPI copy button (app.js)**
`onclick="navigator.clipboard.writeText('${upiRecipientId}')"` injected untrusted data into an inline JS string. Fixed by setting `.value` via DOM property and binding the handler via `addEventListener`.

### High

**4. `substr` deprecated — wrong output (backend.js)**
`substr(start, length)` was replaced with `substring(start, end)` with corrected end indexes:
- orderId: `substr(2, 5)` → `substring(2, 7)`
- trackingNumber: `substr(2, 10)` → `substring(2, 12)`
- transactionId: `substr(2, 12)` → `substring(2, 14)`

**5. Business days calculation wrong (backend.js `calculateEstimatedDelivery`)**
Was adding 5 calendar days. Fixed to loop and skip Saturday (6) and Sunday (0):
```js
calculateEstimatedDelivery() {
  const date = new Date();
  let daysAdded = 0;
  while (daysAdded < 5) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) { daysAdded++; }
  }
  return date.toISOString().split('T')[0];
}
```

**6. Missing `sendShipmentEmail` (email.js)**
Method was called in `backend.js` but never defined in `email.js`. Added implementation with EmailJS + console fallback.

**7. Stale dashboard for different users (app.js `openDashboard`)**
Modal body was only rendered on first creation. Fixed to always refresh `.modal-body` innerHTML when called.

### Medium

**8. Destructive `clearEventListeners` (refresh.js)**
Was cloning every DOM element to strip listeners, breaking all JS object references and crashing the app. Replaced with a safe no-op with an explanatory log.

**9. `location.reload(true)` deprecated (refresh.js)**
`forceGet` parameter is ignored in modern browsers. Changed to `location.reload()`.

**10. Duplicate EmailJS CDN loading (index.html + email-loader.js)**
A `<script async>` tag in index.html loaded EmailJS at the same time as email-loader.js, resulting in 4 simultaneous loads (3 parallel CDNs + 1 inline). Removed the HTML tag; email-loader.js is the sole loader.

**11. Parallel CDN loading (email-loader.js)**
All 3 CDNs were loaded in parallel causing duplicate EmailJS definitions. Replaced with sequential `tryLoadCDN(index)` that only tries the next CDN on error.

**12. `resetPreOrderForm` null crash (app.js)**
`document.querySelector('input[name="payment"]').checked = true` threw if no radio button existed. Added null guard.

**13. Duplicate `timestamp` property (backend.js shipment notification)**
Object literal had two `timestamp` keys; the second silently overrode the first. Removed duplicate.

### Low

**14. Hardcoded EmailJS API key (email.js)**
Added security warning comment; key should be moved to a server-side function or environment variable before production.

**15. Blocking Razorpay script (index.html)**
`<script src="checkout.razorpay.com/...">` had no `defer`. Added `defer` to prevent blocking HTML parsing.

**16. Unused Google Fonts preconnect (index.html)**
`<link rel="preconnect" href="https://fonts.googleapis.com">` was present but Google Fonts were never loaded. Removed.

**17. Nav placeholder product names (config/data.js)**
`Ojas_0/1/2` with broken `#ojas-0/1/2` hrefs replaced with `Agni 512`, `Agni 1024`, `Agni 2048` pointing to `#products`.

## Session 1 — UI Changes

- Removed `#userAccount` section from index.html (was before Klox Store section)
- Removed `Ojas Series` grouping wrapper from Products nav; Agni products are now direct children of Products
