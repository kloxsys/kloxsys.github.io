# Klox Systems - Claude Workspace Memory

## Project Overview
- **Repo**: `d:\github\kloxsys\kloxsys.github.io` (GitHub Pages site)
- **Stack**: Vanilla JS SPA, Firebase Auth + Firestore, EmailJS, Razorpay + UPI payments
- **Branch**: `main`

## Key Files
- `index.html` — shell HTML; all sections populated by JS
- `config/data.js` — single source of truth for navigation, products, content
- `js/app.js` — `AppManager` + all sub-managers (Modal, Cart, User, Dashboard, PreOrder, Support, Payment, Tab)
- `js/backend.js` — order/tracking/shipment services, ID generators, delivery calc
- `js/email.js` — EmailJS wrapper (sendOrderConfirmation, sendShipmentEmail)
- `js/email-loader.js` — sequential CDN fallback loader for EmailJS
- `js/auth.js` — Firebase Auth wrapper (`AuthService`)
- `js/db.js` — Firestore wrapper
- `js/refresh.js` — `ApplicationRefresh` object (soft/hard reset helpers)
- `js/razorpay.js` — Razorpay + UPI payment flow
- `js/utils.js` — utility helpers
- `js/templates.js` — DOM template renderers
- `js/init.js` — page initialization, calls `initializePage()`

## Architecture Notes
- `CONFIG.navigation` in `config/data.js` drives the nav bar (rendered by `Templates.navLink()` → `renderNavigation()`)
- `AppManager` is the top-level orchestrator; sub-managers registered on it
- Firebase user object uses `user.uid` (NOT `user.id`)
- Modals are managed by `ModalManager`; dashboard modal refreshes `.modal-body` on every open

## Fixes Applied (Session 1)
See [fixes.md](fixes.md) for full details.

**backend.js**
- `substr` → `substring` for orderId, trackingNumber, transactionId (correct end-index math)
- `calculateEstimatedDelivery()` now counts 5 business days (skips Sat/Sun)
- Removed duplicate `timestamp` property in shipment notification object

**app.js**
- `user.id` → `user.uid` in `processCheckout()`
- Null guard added before setting payment radio `.checked` in `resetPreOrderForm()`
- UPI modal: removed auto-completing `setTimeout`; wired confirm/copy via `addEventListener`; fixed XSS (DOM property assignment instead of string interpolation)
- Dashboard modal: always refreshes `.modal-body` content on `openDashboard()`

**email.js**
- Added missing `sendShipmentEmail(order, user, trackingNumber)` method
- Added security warning comment on hardcoded `apiKey`

**email-loader.js**
- Replaced parallel 3-CDN loading with sequential `tryLoadCDN(index)` fallback chain

**refresh.js**
- `clearEventListeners()` replaced with safe no-op (cloning DOM was destructive)
- `location.reload(true)` → `location.reload()`

**index.html**
- Removed duplicate `<script async>` EmailJS CDN tag
- Added `defer` to Razorpay script
- Removed unused Google Fonts preconnect
- Removed `#userAccount` section (was before Klox Store)

**config/data.js**
- Nav: Products → replaced `Ojas_0/1/2` placeholder items with `Agni 512`, `Agni 1024`, `Agni 2048`
- Nav: Removed `Ojas Series` grouping wrapper; three Agni products are now direct children of `Products`

## Known Remaining Issues
- `updateDashboard(user)` in `app.js` (around line 955) still calls `OrderService.getUserOrders(user.id)` — should be `user.uid`

## User Preferences
- Concise responses preferred
- No emojis unless explicitly requested
