# Application Refresh Guide

## Overview
The Klox Systems application now has comprehensive refresh and reset capabilities to clear all application state and reinitialize from scratch.

## Quick Start

### Console Commands
Open your browser console (F12 or Ctrl+Shift+I) and run:

```javascript
// Soft refresh - clears state without reloading the page
await softRefreshApp();

// Full refresh - clears state and reloads page content
await refreshApplicationState();

// Hard refresh - clears storage and reloads entire page
await refreshApplicationState(true);
```

## What Gets Cleared

### Phase 1: Authentication
- Signs out the current user
- Clears authentication tokens

### Phase 2: Storage
- Clears localStorage
- Clears sessionStorage
- Clears all cookies

### Phase 3: UI State
- Closes all open modals
- Resets all forms

### Phase 4: Application State
- Clears user data (currentUser, currentUserProfile)
- Resets modal manager
- Clears active tabs and pages
- Resets scroll position

### Phase 5: Cart & Checkout
- Clears cart items
- Resets cart total
- Resets cart count

### Phase 6: Databases
- Clears IndexedDB databases (if used)

### Phase 7: Content
- Scrolls to top
- Reinitializes page content

## Methods

### `await softRefreshApp()`
- **Best for:** Quick state reset without losing page structure
- **Effect:** Soft reload - no page refresh
- **Time:** Instant
- **User Experience:** Smooth, no page flicker

### `await refreshApplicationState()`
- **Best for:** Complete reset with page reinitialization
- **Effect:** Full refresh - reloads all content
- **Time:** ~1-2 seconds
- **User Experience:** Page reloads, users returned to home

### `await refreshApplicationState(true)`
- **Best for:** Total reset including storage
- **Effect:** Hard refresh - browser cache cleared
- **Time:** ~2-3 seconds
- **User Experience:** Full page reload, browser cache cleared

### `ApplicationRefresh.hardRefresh()`
- **Best for:** Emergency reset
- **Effect:** Instant hard refresh
- **Time:** Immediate
- **User Experience:** Page reloads, like pressing Ctrl+Shift+Delete

## Individual Operations

If you only need to clear specific parts:

```javascript
// Clear only storage
ApplicationRefresh.clearStorage();

// Sign out only
await ApplicationRefresh.signOutUser();

// Close all modals
ApplicationRefresh.closeAllModals();

// Reset forms
ApplicationRefresh.resetAllForms();

// Clear cart
ApplicationRefresh.clearCartState();

// Scroll to top
ApplicationRefresh.scrollToTop();

// Reload page content
await ApplicationRefresh.reloadPageContent();
```

## Use Cases

### User Signs Out
```javascript
await ApplicationRefresh.signOutUser();
await ApplicationRefresh.reloadPageContent();
```

### Payment Failed - Reset Cart
```javascript
ApplicationRefresh.clearCartState();
// Show error message
```

### Resolve UI Issues
```javascript
ApplicationRefresh.closeAllModals();
ApplicationRefresh.resetAllForms();
ApplicationRefresh.scrollToTop();
await ApplicationRefresh.reloadPageContent();
```

### Debug Session - Full Clean Slate
```javascript
// Open console and run:
await refreshApplicationState(true);
// Then refresh page manually
```

## Console Output

The refresh process logs all steps to the console:

```
========================================
🔄 KLOX SYSTEMS - APPLICATION REFRESH
========================================
Starting complete refresh...

Signing out user...
✓ User signed out
Clearing localStorage...
Clearing sessionStorage...
✓ Storage cleared
Clearing cookies...
✓ Cookies cleared
...

========================================
✅ APPLICATION REFRESH COMPLETE
========================================
All application state has been cleared.
Please refresh the page manually if needed.
```

## Return Value

All refresh functions return a status object:

```javascript
{
  success: true,
  message: "Application refresh completed"
}
```

Or on error:

```javascript
{
  success: false,
  message: "Refresh failed: [error details]"
}
```

## Browser Compatibility

- Chrome/Edge/Firefox/Safari (all modern versions)
- Requires ES6 (async/await)
- IndexedDB clearing requires IndexedDB API support

## Troubleshooting

### Refresh seems to do nothing
- Open console to see detailed logs
- Make sure no errors are being thrown
- Try `await softRefreshApp()` first

### Page doesn't reload
- Check browser console for errors
- Try hard refresh: `await refreshApplicationState(true)`
- Manual refresh: Press Ctrl+F5

### Still logged in after refresh
- Allow 1-2 seconds for Firebase sign out
- Try: `await ApplicationRefresh.signOutUser()` then manual page refresh

## Integration with HTML

The refresh.js file is loaded in `index.html` in the scripts section, so it's automatically available globally.

## Advanced Usage

### Custom Refresh for Specific Flows

```javascript
// For checkout reset after payment:
async function resetAfterPayment() {
  ApplicationRefresh.clearCartState();
  ApplicationRefresh.closeAllModals();
  ApplicationRefresh.resetAllForms();
  await ApplicationRefresh.reloadPageContent();
}

// Then use:
await resetAfterPayment();
```

### Programmatic Refresh in Code

```javascript
// In your app logic:
button.addEventListener('click', async () => {
  try {
    await performAction();
  } catch (error) {
    // Reset on error
    await softRefreshApp();
  }
});
```
