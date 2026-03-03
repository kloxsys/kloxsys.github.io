# Order Confirmation Email - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    KLOX SYSTEMS - EMAIL FLOW                    │
└─────────────────────────────────────────────────────────────────┘

Customer Places Order
         ↓
    ┌──────────────────────┐
    │  app.js              │
    │  processCheckout()    │
    └──────────────────────┘
         ↓
  Handle Payment Method
  (Razorpay / UPI)
         ↓
    ┌──────────────────────┐
    │  RazorpayPayment     │
    │  /GooglePaySend      │
    └──────────────────────┘
         ↓
  Payment Success
         ↓
    ┌──────────────────────────────┐
    │  app.js                      │
    │  completeOrder()             │
    │  ├─ Create order data        │
    │  ├─ Prepare items array      │
    │  └─ Store payment details    │
    └──────────────────────────────┘
         ↓
    ┌──────────────────────────────────────────┐
    │  backend.js                              │
    │  NotificationService.sendOrderConfirm()  │
    │  Pass: order, user, items                │
    └──────────────────────────────────────────┘
         ↓
    ┌──────────────────────────────────────────┐
    │  email.js - EmailService                 │
    │  ├─ Generate HTML template               │
    │  ├─ Collect order details                │
    │  ├─ Format addresses & prices            │
    │  └─ Send via active method               │
    └──────────────────────────────────────────┘
         ↓
    ┌─────────────────────────────────────────────────────────┐
    │  Try Email Methods (in order):                          │
    │  ┌─────────────────────────────────┐                    │
    │  │ 1. Firebase Cloud Function      │ ← Production Ready │
    │  │    POST /sendOrderConfirmation  │                    │
    │  └─────────────────────────────────┘                    │
    │  ┌─────────────────────────────────┐                    │
    │  │ 2. EmailJS Service              │ ← Easiest Setup   │
    │  │    emailjs.send()               │                    │
    │  └─────────────────────────────────┘                    │
    │  ┌─────────────────────────────────┐                    │
    │  │ 3. Custom Backend API           │ ← Your Server     │
    │  │    POST /api/send-email         │                    │
    │  └─────────────────────────────────┘                    │
    └─────────────────────────────────────────────────────────┘
         ↓
    ┌────────────────────────────────────┐
    │  Email Service Provider            │
    │  ├─ SendGrid (email.js calls)      │
    │  ├─ Gmail (Firebase function)      │
    │  ├─ Mailgun (Firebase/Custom)      │
    │  └─ Your SMTP (Custom backend)     │
    └────────────────────────────────────┘
         ↓
    ┌────────────────────────────────────┐
    │  Customer Inbox                    │
    │  ✓ Order Confirmation Email        │
    │    with all order details          │
    └────────────────────────────────────┘
```

---

## Component Details

### 1. Order Completion Flow

**File**: `js/app.js` - `completeOrder()` method

```javascript
completeOrder(order, user, total, paymentMethod, paymentData) {
  // Step 1: Update order status
  OrderService.updateOrderStatus(order.id, 'processing');

  // Step 2: Prepare items for email
  const items = this.items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  // Step 3: Send confirmation with all details
  NotificationService.sendOrderConfirmation(order, user, items);

  // Step 4: Clear cart and close modals
  // Step 5: Show success message
  // Step 6: Redirect to dashboard
}
```

#### Data Passed to Email Service:

**Order Object**:
```javascript
{
  id: "ORD-1234567890",
  userId: "user123",
  items: [...],
  subtotal: 29999,
  tax: 5399.82,
  shipping: 0,
  total: 35398.82,
  shippingAddress: { name, address1, city, state, postalCode, phone },
  billingAddress: { ... },
  paymentMethod: "razorpay",
  paymentId: "pay_1234567890",
  status: "processing",
  createdAt: "2026-02-20T10:30:00Z",
  estimatedDelivery: "2026-02-25"
}
```

**User Object**:
```javascript
{
  uid: "firebase_uid",
  email: "customer@example.com",
  displayName: "John Doe",
  phone: "9876543210"
}
```

**Items Array**:
```javascript
[
  {
    name: "Ojas Series Power Station",
    quantity: 1,
    price: 29999
  }
]
```

---

### 2. Notification Service

**File**: `js/backend.js` - `NotificationService`

```javascript
async sendOrderConfirmation(order, user, items = []) {
  // Check if EmailService is available
  if (typeof EmailService !== 'undefined') {
    // Call EmailService with all order details
    const emailResult = await EmailService.sendOrderConfirmation(
      order,    // Complete order with all details
      user,     // Customer information
      items     // Array of purchased items
    );

    // Log success/failure
    if (emailResult.success) {
      Logger.info('Email sent via ' + emailResult.method);
    }
  }

  // Create notification record
  const notification = {
    id: 'NOTIF-' + Date.now(),
    type: 'order_confirmation',
    orderId: order.id,
    email: user.email,
    status: 'sent',
    timestamp: new Date().toISOString(),
  };

  return notification;
}
```

---

### 3. Email Service

**File**: `js/email.js` - `EmailService`

#### Configuration:
```javascript
const EmailService = {
  config: {
    // Method 1: EmailJS (Frontend)
    emailjs: {
      serviceId: 'service_klox_system',
      templateId: 'template_order_confirmation',
      apiKey: 'YOUR_PUBLIC_KEY',
      enabled: false  // ← Set to true when configured
    },
    
    // Method 2: Firebase Cloud Function
    firebaseCloudFunction: {
      url: 'https://us-central1-xxx.cloudfunctions.net/sendOrderConfirmationEmail',
      enabled: false  // ← Set to true when deployed
    },
    
    // Method 3: Custom Backend API
    customBackend: {
      url: 'https://your-backend.com/api/send-email',
      enabled: false  // ← Set to true when ready
    }
  }
}
```

#### Main Methods:

**1. generateOrderConfirmationHTML(order, user, items)**
- Formats all order data into beautiful HTML
- Creates professional email template
- Includes all details: items, pricing, addresses, payment info
- Returns: HTML string (560+ lines)

**2. sendOrderConfirmation(order, user, items)**
- Main entry point
- Tries enabled email methods in order
- Handles fallback and retries
- Logs detailed console output
- Returns: success/error status

**3. sendViaEmailJS(order, user, items)**
- Uses EmailJS frontend service
- No backend required
- Free tier: 200 emails/month
- Returns: Promise with result

**4. sendViaFirebaseCloudFunction(order, user, items)**
- Calls deployed Cloud Function
- Can use SendGrid, Mailgun, Gmail, etc.
- Serverless and scalable
- Returns: Promise with result

**5. sendViaCustomBackend(order, user, items)**
- Calls your API endpoint
- Full control over email process
- Can integrate with any service
- Returns: Promise with result

#### Error Handling:
```javascript
// If all methods fail, store for retry
storeForRetry(order, user, items)

// Retry up to 3 times later
retryPendingEmails()

// Access pending emails
localStorage.getItem('pendingOrderEmails')
```

---

## HTML Email Template Structure

The email template includes 11 major sections:

```html
<email-container>
  <header>
    ├─ Logo/Icon
    ├─ "Order Confirmed" Badge
    └─ Thank you message
  </header>
  
  <content>
    ├─ Order Details Section
    │  ├─ Order ID
    │  ├─ Order Date & Time
    │  ├─ Status Badge
    │  └─ Estimated Delivery
    │
    ├─ Items Section
    │  └─ Table with:
    │     ├─ Product Name
    │     ├─ Quantity
    │     ├─ Unit Price
    │     └─ Line Total
    │
    ├─ Price Summary
    │  ├─ Subtotal
    │  ├─ Tax (18%)
    │  ├─ Shipping
    │  └─ TOTAL (highlighted)
    │
    ├─ Payment Details
    │  ├─ Payment Method
    │  ├─ Status: CONFIRMED
    │  └─ Transaction ID
    │
    ├─ Shipping Address
    │  └─ Full address box
    │
    ├─ Billing Address (if different)
    │  └─ Full address box
    │
    ├─ Next Steps Timeline
    │  ├─ Step 1: Verification
    │  ├─ Step 2: Shipment
    │  ├─ Step 3: Tracking
    │  └─ Step 4: Delivery
    │
    ├─ Customer Information
    │  ├─ Name
    │  ├─ Email
    │  └─ Phone
    │
    └─ CTA Button
       └─ "Contact Support"
  
  <footer>
    ├─ Company Name
    ├─ Tagline
    └─ Disclaimer
  </footer>
</email-container>
```

---

## Data Flow Diagram

```
Frontend: app.js
├─ Cart Manager
├─ Stores: items, total, quantities
└─ Calls: processCheckout()
    │
    ├─ Creates Order via OrderService
    │  └─ Order ID, addresses, items
    │
    ├─ Initiates Payment
    │  ├─ Razorpay: Card/Bank/Wallet
    │  └─ UPI Manual: Manual transfer
    │
    └─ On Payment Success
       ├─ Stores payment ID
       ├─ Updates order status
       └─ Calls: completeOrder()
           │
           └─ Prepares Email Data
              ├─ Order: All details
              ├─ User: Contact info
              ├─ Items: Cart items
              │
              └─ Calls: NotificationService
                 │
                 └─ Calls: EmailService
                    │
                    ├─ Generates HTML
                    ├─ Formats data
                    │
                    ├─ Tries: Firebase
                    ├─ Tries: EmailJS
                    ├─ Tries: Custom
                    │
                    └─ Sends to Provider
                       │
                       └─ Customer Email
```

---

## Configuration Checklist

### For EmailJS Setup:
- [ ] Account created at emailjs.com
- [ ] Email service connected
- [ ] Template ID: `template_order_confirmation`
- [ ] Service ID obtained
- [ ] API Key (public) obtained
- [ ] Config updated in js/email.js
- [ ] `enabled: true` set for emailjs

### For Firebase Cloud Function:
- [ ] Cloud Function deployed
- [ ] Function URL obtained
- [ ] Email provider configured (SendGrid/Mailgun/etc)
- [ ] API keys added to environment variables
- [ ] CORS configured
- [ ] Function tested manually
- [ ] Config updated in js/email.js
- [ ] `enabled: true` set for firebaseCloudFunction

### For Custom Backend:
- [ ] API endpoint created
- [ ] Accepts POST requests
- [ ] Validates required fields
- [ ] Integrates email provider
- [ ] Returns proper JSON response
- [ ] CORS headers added
- [ ] URL updated in js/email.js
- [ ] `enabled: true` set for customBackend

---

## Testing Checklist

- [ ] Place test order with all required fields
- [ ] Check browser console for email logs
- [ ] Verify email received in inbox
- [ ] Check email contains all sections
- [ ] Test with different payment methods
- [ ] Test with different addresses
- [ ] Check HTML rendering (desktop & mobile)
- [ ] Verify all links work
- [ ] Test retry mechanism by disabling temporarily
- [ ] Check failed email storage

---

## Performance Considerations

| Aspect | Details |
|--------|---------|
| Email Generation | ~200ms (HTML template generation) |
| Email Send | 500ms - 3s (depends on provider) |
| Total Flow | 1-4 seconds from payment to sent |
| Async | Non-blocking, doesn't hold up UI |
| Retry | Background, doesn't affect user flow |
| Storage | Failed emails stored in localStorage |

---

## Error Handling Strategy

```
Try Firebase Cloud Function
  ↓ (success)
  └─→ EMAIL SENT ✓

  ↓ (failure, if enabled)
  Try EmailJS
    ↓ (success)
    └─→ EMAIL SENT ✓
    
    ↓ (failure, if enabled)
    Try Custom Backend
      ↓ (success)
      └─→ EMAIL SENT ✓
      
      ↓ (failure)
      Store for Retry
        │
        └─→ localStorage['pendingOrderEmails']
            Retry up to 3 times later
            Max 3 retries per email
```

---

## File Structure

```
kloxsys.github.io/
├── index.html                          ← Added EmailJS CDN + email.js script
├── config/
│   └── data.js                         ← Email configuration
├── js/
│   ├── email.js                        ← NEW: Email Service (713 lines)
│   ├── app.js                          ← MODIFIED: completeOrder()
│   ├── backend.js                      ← MODIFIED: NotificationService
│   ├── db.js
│   ├── auth.js
│   ├── razorpay.js
│   ├── utils.js
│   ├── templates.js
│   ├── init.js
│   └── refresh.js
├── EMAIL_FEATURE_SUMMARY.md            ← NEW: Quick reference
└── EMAIL_SETUP_GUIDE.md                ← NEW: Detailed setup
```

---

## API Contracts

### Firebase Cloud Function Payload:

**Request**:
```javascript
POST https://us-central1-project.cloudfunctions.net/sendOrderConfirmationEmail
Content-Type: application/json

{
  to: "customer@example.com",
  subject: "Order Confirmation - ORD-2026022010300000",
  htmlContent: "<html>...</html>",
  orderId: "ORD-2026022010300000",
  userId: "firebase_uid",
  customerName: "John Doe",
  orderTotal: 35398.82
}
```

**Response**:
```javascript
{
  success: true,
  messageId: "message_id_from_provider",
  timestamp: "2026-02-20T10:30:00Z"
}
```

### Custom Backend API Payload:

**Request** & **Response**: Same as Firebase Cloud Function

### EmailJS Payload:

**Sent via**:
```javascript
emailjs.send(
  serviceId,           // "service_klox_system"
  templateId,          // "template_order_confirmation"
  templateParams       // See EmailService code
)
```

---

## Monitoring & Logging

### Console Output Example:
```
========================================
📧 SENDING ORDER CONFIRMATION EMAIL
========================================
Order ID: ORD-1234567890
To: customer@example.com
Items: 2

Attempting firebase...
Try Firebase Cloud Function timeout, attempting next method...

Attempting emailjs...
✓ Email sent via EmailJS: {...}

========================================
✅ EMAIL SENT SUCCESSFULLY
========================================
```

### Failed Email Storage:
```javascript
{
  order: {...},
  user: {...},
  items: [...],
  timestamp: "2026-02-20T10:30:00Z",
  retries: 1
}
```

---

## Future Enhancements

Potential additions:
1. Shipment notification emails
2. Refund confirmation emails
3. Delivery confirmation emails
4. Customer review request emails
5. Email template variations
6. A/B testing different templates
7. Analytics on email opens/clicks
8. Personalized product recommendations
9. Discount codes for next purchase
10. SMS notifications (in addition to email)

---

## Key Files for Reference

- **Main Implementation**: [js/email.js](js/email.js)
- **Setup Guide**: [EMAIL_SETUP_GUIDE.md](EMAIL_SETUP_GUIDE.md)
- **Feature Summary**: [EMAIL_FEATURE_SUMMARY.md](EMAIL_FEATURE_SUMMARY.md)
- **Integration Point**: [js/app.js](js/app.js#L823) - `completeOrder()`
- **Notification Service**: [js/backend.js](js/backend.js#L300)

---

## Support

For questions or issues:
1. Check console logs first
2. Review [EMAIL_SETUP_GUIDE.md](EMAIL_SETUP_GUIDE.md)
3. Check this technical document
4. Verify all credentials are correctly configured
5. Test with custom test code in console
