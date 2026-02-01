# User Management & Access Features Guide

## Overview

This document covers the comprehensive user management system added to Klox Systems, including registration, login, address management, and order history.

---

## Features Implemented

### 1. Authentication System

#### Registration
- **Email/Password Registration**: Users can create accounts with custom credentials
- **Password Validation**: Minimum 6 characters, confirmation check
- **Google OAuth**: Alternative sign-up via Google (simulated)
- **Data Storage**: User credentials stored in localStorage

#### Login
- **Email/Password Login**: Sign in with registered credentials
- **Persistent Sessions**: Automatic login on page reload
- **Google OAuth**: Alternative login via Google (simulated)
- **Error Handling**: Invalid email/password feedback

#### Account Features
- User profile with avatar, name, email
- Account creation date tracking
- Phone number storage
- Display name management

### 2. User Profile Management

#### Profile Page
- View personal information (name, email, phone)
- Edit full name and phone number
- Account creation date display
- Profile avatar (placeholder)
- Save changes functionality

#### Navigation
- Accessible from user dropdown menu
- Modal-based interface
- Responsive design

### 3. Address Management

#### Add Addresses
- Full address capture:
  - Full name
  - Phone number
  - Address line 1 & 2
  - City, state, postal code
  - Country
- Address validation
- Multiple addresses support
- Default address selection

#### Manage Addresses
- View all saved addresses
- Edit address information
- Delete addresses
- Address organization

### 4. Order History

#### Order Tracking
- Order ID with unique identifier
- Order creation date
- Order status (pending, completed, cancelled)
- Order items summary
- Order total amount
- Delivery address

#### Order Display
- Timeline view of all orders
- Status indicators with color coding
- Quick view details
- Empty state for new users

---

## Technical Implementation

### File Modifications

#### 1. **js/app.js** - UserManager Class Enhancement
```javascript
// New Methods Added:
- register(email, password, displayName) - Create new account
- login(email, password) - Sign in existing user
- addAddress(addressData) - Add new delivery address
- updateAddress(addressId, addressData) - Modify address
- deleteAddress(addressId) - Remove address
- getAddresses() - Retrieve all addresses
- addOrder(orderData) - Add order to history
- getOrderHistory() - Retrieve all orders
- updateProfile(displayName, phoneNumber) - Update user info
- showProfilePage() - Display profile modal
- showOrdersPage() - Display orders modal
- showAddressPage() - Display address modal
```

#### 2. **js/templates.js** - New Templates
```javascript
// Added Templates:
- authModal() - Enhanced with email/password fields + validation
- profilePage(user) - User profile interface
- ordersPage(orders) - Order history display
- addressPage(addresses) - Address management interface
```

#### 3. **css/styles.css** - New Styling
```css
/* Added Sections:
- .profile-page and sub-components
- .orders-page and .order-card styles
- .address-page and .address-card styles
- .auth-divider for sign-up forms
- .form-row for responsive form layouts
- Order status indicators (.status-pending, etc.)
- Empty state styling
*/
```

#### 4. **js/init.js** - Global Functions
```javascript
// Added Functions:
- window.switchAuthTab(tab) - Toggle between login/signup
- window.closeModal(modalId) - Close modal dialogs
```

### Data Structure

#### User Object
```javascript
{
  id: "user_abc123xyz",
  email: "user@example.com",
  displayName: "John Doe",
  password: "encoded_password", // Base64 encoded
  phoneNumber: "+1234567890",
  photoUrl: null,
  addresses: [
    {
      id: "addr_xyz123",
      name: "Home",
      phone: "+1234567890",
      line1: "123 Main St",
      line2: "Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      createdAt: "2026-01-30T10:00:00Z"
    }
  ],
  orders: [
    {
      id: "ord_abc123",
      items: "Agni 512",
      total: 24999,
      address: "123 Main St, New York",
      status: "pending",
      createdAt: "2026-01-30T10:00:00Z"
    }
  ],
  createdAt: "2026-01-30T10:00:00Z"
}
```

#### Storage Keys
```javascript
CONFIG.user.storageKey = 'klox_user' // localStorage key
```

---

## Usage Guide

### For Users

#### Registration
1. Click "Sign In" button in header
2. Select "Sign Up" tab
3. Enter full name, email, password
4. Click "Sign Up" button
5. Account created and logged in automatically

#### Login
1. Click "Sign In" button
2. Select "Sign In" tab
3. Enter email and password
4. Click "Sign In" button
5. Access user menu from header

#### Manage Profile
1. Logged in → Click user button (header)
2. Select "👤 Profile"
3. Edit name, phone number
4. Click "Save Changes"

#### Manage Addresses
1. Logged in → Click user button
2. Select "⚙️ Settings"
3. Add new address or manage existing ones
4. Delete address if needed

#### View Orders
1. Logged in → Click user button
2. Select "📦 Orders"
3. View order history with status
4. Click "View Details" for order info

### For Developers

#### Access User Object
```javascript
// Check if logged in
if (window.appManager.userManager.isLoggedIn()) {
  const user = window.appManager.userManager.user;
  console.log(user.displayName, user.email);
}
```

#### Add New Address Programmatically
```javascript
window.appManager.userManager.addAddress({
  name: "Work",
  phone: "+1234567890",
  line1: "456 Office Blvd",
  city: "San Francisco",
  state: "CA",
  zip: "94102",
  country: "USA"
});
```

#### Add Order to History
```javascript
window.appManager.userManager.addOrder({
  items: "Agni 1024 (2x)",
  total: 99998,
  address: "456 Office Blvd, San Francisco"
});
```

#### Update User Profile
```javascript
window.appManager.userManager.updateProfile(
  "Jane Smith",
  "+9876543210"
);
```

#### Retrieve All Orders
```javascript
const orders = window.appManager.userManager.getOrderHistory();
console.log(orders);
```

---

## Security Considerations

⚠️ **Important**: Current implementation uses:
- Base64 encoding for passwords (NOT production-safe)
- localStorage (client-side only storage)

### For Production Use:
1. **Backend Authentication**: Implement proper server-side authentication
2. **HTTPS**: Use encrypted connections
3. **Password Hashing**: Use bcrypt or similar
4. **Token-Based Auth**: JWT or session tokens
5. **API Security**: Rate limiting, CORS, input validation
6. **Data Encryption**: Encrypt sensitive data at rest
7. **Audit Logging**: Track user actions

---

## Modal Management

### Authentication Modal
- ID: `authModal`
- Tabs: Sign In / Sign Up
- Fields: Email, Password, Name (signup only)
- Actions: Sign in/up with email or Google

### Profile Modal
- ID: `profileModal`
- Fields: Full name, email (read-only), phone number
- Actions: Save changes

### Orders Modal
- ID: `ordersModal`
- Display: List of all orders with status
- Actions: View order details

### Address Modal
- ID: `addressModal`
- Form: Add new address
- Display: List of saved addresses
- Actions: Add, delete addresses

---

## CSS Classes Reference

### Profile Components
```css
.profile-page
.profile-header
.profile-avatar
.profile-info
.profile-form
```

### Order Components
```css
.orders-page
.orders-list
.order-card
.order-header
.order-id
.order-status
.order-details
.empty-state
```

### Address Components
```css
.address-page
.add-address-form
.saved-addresses
.address-card
.address-info
.address-actions
.form-row
```

### Status Indicators
```css
.order-status.status-pending    /* Yellow */
.order-status.status-completed  /* Green */
.order-status.status-cancelled  /* Red */
```

---

## Integration Points

### Cart Integration
Orders are automatically added when checkout completes:
```javascript
// After checkout
const order = window.appManager.userManager.addOrder({
  items: cartItems,
  total: cartTotal,
  address: selectedAddress
});
```

### User Menu Integration
Profile dropdown shows all options:
- Profile
- Orders
- Settings (Addresses)
- Logout

### Header Integration
- Shows "Sign In" when logged out
- Shows first name when logged in
- Dropdown menu on click

---

## Future Enhancements

1. **Email Verification**: Send verification emails
2. **Password Reset**: Forgot password functionality
3. **Two-Factor Authentication**: Enhanced security
4. **Social Login**: Integrate real Google OAuth
5. **Order Tracking**: Real-time shipment tracking
6. **Address Autocomplete**: Google Maps integration
7. **Order Notifications**: Email/SMS updates
8. **Wishlist**: Save products for later
9. **Payment Methods**: Saved payment options
10. **Loyalty Program**: Points and rewards

---

## Testing Checklist

- [ ] User registration with valid credentials
- [ ] User registration with invalid password (< 6 chars)
- [ ] User registration with mismatched passwords
- [ ] User login with correct credentials
- [ ] User login with incorrect password
- [ ] Persistent login after page refresh
- [ ] Add new address
- [ ] Edit address
- [ ] Delete address
- [ ] View order history (empty state)
- [ ] Add order and view in history
- [ ] Update user profile
- [ ] Logout functionality
- [ ] Google OAuth flow
- [ ] Mobile responsiveness
- [ ] Form validation
- [ ] Error messages

---

## Troubleshooting

### Issue: User not logging in
**Solution**: Check browser localStorage is enabled and CORS policies

### Issue: Address not saving
**Solution**: Verify all required fields are filled

### Issue: Profile changes not persisting
**Solution**: Check localStorage quota not exceeded

### Issue: Modal not opening
**Solution**: Verify modalManager is initialized in AppManager

### Issue: Form validation not working
**Solution**: Check browser console for JavaScript errors

---

## Support

For questions or issues:
1. Check browser console for errors
2. Verify localStorage contains user data
3. Test with sample data
4. Clear localStorage and re-register

---

## Version History

- **v1.0** (2026-01-30): Initial user management system
  - Registration & Login
  - Profile management
  - Address management
  - Order history
  - Email/password auth
  - Google OAuth simulation

---

## License

Part of Klox Systems © 2026. All rights reserved.
