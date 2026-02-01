# User Management API Reference

## Quick Start

### Display User Menu
```javascript
// User dropdown automatically appears in header when logged in
// Shows: Profile, Orders, Settings, Logout
```

### Register New User
```javascript
window.appManager.userManager.register(
  'email@example.com',
  'password123',
  'John Doe'
)
// Returns: true if successful, false if failed
```

### Login
```javascript
const success = window.appManager.userManager.login(
  'email@example.com',
  'password123'
)
// Returns: true if successful, false if failed
```

### Check Login Status
```javascript
if (window.appManager.userManager.isLoggedIn()) {
  // User is logged in
}
```

### Get Current User
```javascript
const user = window.appManager.userManager.user
// {
//   id, email, displayName, phoneNumber,
//   addresses: [...], orders: [...]
// }
```

### Logout
```javascript
window.appManager.userManager.logout()
// Clears all user data and refreshes page
```

---

## Profile Management

### Update Profile
```javascript
window.appManager.userManager.updateProfile(
  'John Smith',  // displayName
  '+1234567890'  // phoneNumber
)
// Returns: true if successful
```

### Open Profile Modal
```javascript
window.appManager.userManager.showProfilePage()
```

---

## Address Management

### Add Address
```javascript
const address = window.appManager.userManager.addAddress({
  name: 'Home',
  phone: '+1234567890',
  line1: '123 Main Street',
  line2: 'Apt 4B',        // optional
  city: 'New York',
  state: 'NY',
  zip: '10001',
  country: 'USA'
})
// Returns: address object with generated ID
```

### Get All Addresses
```javascript
const addresses = window.appManager.userManager.getAddresses()
// Returns: array of address objects
```

### Update Address
```javascript
const success = window.appManager.userManager.updateAddress(
  'addr_xyz123',  // addressId
  {
    phone: '+9876543210',
    city: 'Boston'
  }
)
// Returns: true if successful, false if not found
```

### Delete Address
```javascript
const success = window.appManager.userManager.deleteAddress('addr_xyz123')
// Returns: true if successful, false if not found
```

### Open Address Manager
```javascript
window.appManager.userManager.showAddressPage()
```

---

## Order Management

### Add Order
```javascript
const order = window.appManager.userManager.addOrder({
  items: 'Agni 512 (2x)',
  total: 49998,
  address: 'addr_xyz123' // or address string
})
// Returns: order object with ID and createdAt
// Status defaults to 'pending'
```

### Get Order History
```javascript
const orders = window.appManager.userManager.getOrderHistory()
// Returns: array of order objects, sorted by date
```

### Open Orders Modal
```javascript
window.appManager.userManager.showOrdersPage()
```

---

## Authentication Modal

### Open Auth Modal
```javascript
window.appManager.userManager.openAuth()
// Shows Sign In / Sign Up tabs
```

### Switch Auth Tab
```javascript
window.switchAuthTab('login')   // Show login form
window.switchAuthTab('signup')  // Show registration form
```

### Sign In with Google
```javascript
window.appManager.userManager.signInWithGoogle()
// Simulates OAuth flow
```

### Sign Up with Google
```javascript
window.appManager.userManager.signUpWithGoogle()
// Simulates OAuth flow (same as signInWithGoogle for now)
```

---

## Storage & Persistence

### Get Stored User Data
```javascript
const userData = localStorage.getItem('klox_user')
const user = userData ? JSON.parse(userData) : null
```

### Clear User Data
```javascript
localStorage.removeItem('klox_user')
```

### Check Storage
```javascript
// View all stored data
console.log(JSON.parse(localStorage.getItem('klox_user')))

// View all cart data
console.log(JSON.parse(localStorage.getItem('klox_cart')))
```

---

## UI Components

### User Button (Header)
```
When logged out: "Sign In" button
When logged in: "👤 John Doe" (firstName)
  ├─ 👤 Profile
  ├─ 📦 Orders
  ├─ ⚙️ Settings
  ├─ ─────────────
  └─ 🚪 Logout
```

### Authentication Modal
```
Tabs: Sign In | Sign Up

Sign In Tab:
├─ Email field
├─ Password field
├─ Sign In button
├─ or
└─ Sign In with Google

Sign Up Tab:
├─ Full Name field
├─ Email field
├─ Password field
├─ Confirm Password field
├─ Sign Up button
├─ or
└─ Sign Up with Google
```

### Profile Modal
```
├─ Avatar (placeholder)
├─ Display Name (editable)
├─ Email (read-only)
├─ Phone Number (editable)
└─ Save Changes button
```

### Orders Modal
```
├─ Order #ABC123 [PENDING]
│  ├─ Date: Jan 30, 2026
│  ├─ Items: Agni 512
│  ├─ Total: ₹24,999
│  └─ View Details button
│
├─ Order #XYZ789 [COMPLETED]
│  └─ ...
│
└─ (Empty state if no orders)
```

### Address Modal
```
Add New Address Section:
├─ Full Name
├─ Phone Number
├─ Address Line 1
├─ Address Line 2
├─ City / State / ZIP
├─ Country
└─ Add Address button

Saved Addresses Section:
├─ Address Card
│  ├─ Name
│  ├─ Address
│  ├─ Phone
│  └─ Delete button
└─ ...
```

---

## Events & Hooks

### After Registration
```javascript
// Page auto-refreshes
// User logged in automatically
// Header updates to show user menu
```

### After Login
```javascript
// Auth modal closes
// Page refreshes
// Header updates
// User menu appears
```

### After Logout
```javascript
// All user data cleared
// Page refreshes
// Header shows "Sign In" button again
```

### After Profile Update
```javascript
// User object updated
// Data persisted to localStorage
// Modal can close
```

### After Address Add/Update/Delete
```javascript
// User.addresses array updated
// Data persisted to localStorage
// UI can refresh
```

### After Order Added
```javascript
// User.orders array updated
// Data persisted to localStorage
// Order appears in history
```

---

## Form Validation

### Registration Form
- **Name**: Required, any length
- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters
- **Confirm Password**: Must match password field

### Address Form
- **Name**: Required
- **Phone**: Required, any format
- **Line 1**: Required
- **Line 2**: Optional
- **City**: Required
- **State**: Required
- **ZIP**: Required
- **Country**: Required

### Profile Form
- **Name**: Required, any length
- **Phone**: Optional, any format

---

## Error Handling

### Login Errors
```javascript
// Invalid email or password
window.appManager.userManager.login('email', 'wrong')
// Returns: false
// Shows: alert('Invalid email or password')

// User should retry or use Google OAuth
```

### Registration Errors
```javascript
// Missing fields
// Returns: false

// Password too short
// Shows: alert('Password must be at least 6 characters')

// Passwords don't match
// Shows: alert('Passwords do not match')
```

### Address Errors
```javascript
// Delete non-existent address
window.appManager.userManager.deleteAddress('invalid_id')
// Returns: false
// No error shown (silent fail)
```

---

## Integration Examples

### Complete Registration Flow
```javascript
// 1. User fills registration form
// 2. Validate inputs
// 3. Register user
window.appManager.userManager.register(email, password, name)

// 4. User auto-logged in
// 5. Header updates
// 6. Can access profile, orders, addresses
```

### Complete Purchase Flow
```javascript
// 1. User adds items to cart
window.appManager.cartManager.addItem('agni-512', 2)

// 2. User clicks Checkout
// 3. If not logged in, auth modal opens
// 4. User logs in/registers
// 5. Address selection modal opens
// 6. User selects or adds address
// 7. Order created
const order = window.appManager.userManager.addOrder({
  items: cartItems,
  total: cartTotal,
  address: selectedAddress.id
})

// 8. Cart cleared
// 9. Order appears in user's order history
```

### Display User Dashboard
```javascript
// Get all user info
const user = window.appManager.userManager.user
const addresses = user.addresses
const orders = user.orders

// Display stats
console.log(`Welcome ${user.displayName}`)
console.log(`Addresses: ${addresses.length}`)
console.log(`Orders: ${orders.length}`)
```

---

## Mobile Considerations

### Responsive Design
- All modals are mobile-optimized
- Forms stack vertically on small screens
- Touch-friendly buttons and inputs
- Optimized for 480px and up

### Mobile Usage
```javascript
// Same API works on mobile
// Touch interactions work
// Modals are full-width on small screens
// Form inputs are mobile-friendly
```

---

## Testing

### Test Registration
```javascript
// Open auth modal
window.appManager.userManager.openAuth()

// Switch to signup
window.switchAuthTab('signup')

// Fill form and submit
// Check: user logged in, profile appears
```

### Test Login
```javascript
// First register a user
window.appManager.userManager.register('test@example.com', 'pass123', 'Test User')

// Logout
window.appManager.userManager.logout()

// Login again
window.appManager.userManager.login('test@example.com', 'pass123')

// Check: user logged in again
```

### Test Address Management
```javascript
// Add address
window.appManager.userManager.addAddress({...})

// Get all addresses
const addrs = window.appManager.userManager.getAddresses()
console.log(addrs)

// Delete address
window.appManager.userManager.deleteAddress(addrs[0].id)
```

### Test Order Management
```javascript
// Add order
window.appManager.userManager.addOrder({...})

// Get order history
const orders = window.appManager.userManager.getOrderHistory()
console.log(orders)

// Check order appears in modal
window.appManager.userManager.showOrdersPage()
```

---

## Debugging

### View Current User
```javascript
console.log(window.appManager.userManager.user)
```

### View All Users Data (localStorage)
```javascript
console.log(JSON.parse(localStorage.getItem('klox_user')))
```

### Check if Logged In
```javascript
console.log(window.appManager.userManager.isLoggedIn())
```

### View User Addresses
```javascript
console.log(window.appManager.userManager.getAddresses())
```

### View User Orders
```javascript
console.log(window.appManager.userManager.getOrderHistory())
```

### Clear All User Data
```javascript
localStorage.removeItem('klox_user')
window.location.reload()
```

---

## Related APIs

### CartManager Integration
```javascript
// Used during checkout
window.appManager.cartManager.items
window.appManager.cartManager.getTotal()
window.appManager.cartManager.checkout()
```

### ModalManager Integration
```javascript
// User management uses modals
window.appManager.modalManager.openModal(modalId)
window.appManager.modalManager.closeModal(modalId)
```

---

## Performance

| Operation | Time | Notes |
|-----------|------|-------|
| Register | <100ms | Creates user object |
| Login | <50ms | localStorage lookup |
| Add Address | <50ms | Array push |
| Add Order | <50ms | Array push |
| Get Orders | <10ms | Array iteration |
| Profile Update | <50ms | Object update |
| All modals | <200ms | DOM rendering |

---

## Version

**API Version**: 1.0  
**Last Updated**: 2026-01-30  
**Compatibility**: Klox Systems v1.x

---

For detailed implementation guide, see: [USER_MANAGEMENT_GUIDE.md](USER_MANAGEMENT_GUIDE.md)
