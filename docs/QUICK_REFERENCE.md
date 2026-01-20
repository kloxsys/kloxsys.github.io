# Quick Reference Guide

## 🚀 Common Tasks

### Add a New Product
**File**: `config/data.js`

```javascript
// In CONFIG.products array, add:
{
  id: 'agni-XXXX',
  name: 'Agni XXXX',
  capacity: 'XXXXWh',
  description: 'Product description',
  price: 99999,
  currency: '₹',
  image: 'assets/agni-XXXX.jpg',
  features: ['Feature 1', 'Feature 2', 'Feature 3']
}
```

### Add a New Feature
**File**: `config/data.js`

```javascript
// In CONFIG.features array, add:
{
  icon: '🔧',
  title: 'Feature Title',
  description: 'Feature description'
}
```

### Change Theme Colors
**File**: `css/styles.css`

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-green: #00a86b;
  --accent-dark-green: #008f5a;
  /* Change any value to update theme globally */
}
```

### Add Navigation Link
**File**: `config/data.js`

```javascript
// In CONFIG.navigation array, add:
{
  label: 'Link Name',
  href: '#section-id'
}
```

### Modify Company Info
**File**: `config/data.js`

```javascript
CONFIG.site = {
  name: 'New Name',
  tagline: 'New tagline',
  description: 'New description'
}
```

### Update Hero Section
**File**: `config/data.js`

```javascript
CONFIG.hero = {
  title: 'New Title',
  subtitle: 'New Subtitle',
  image: 'assets/new-image.jpg',
  imageAlt: 'Alt text',
  cta: {
    text: 'Button Text',
    href: '#target'
  }
}
```

### Modify About Section
**File**: `config/data.js`

```javascript
CONFIG.about = {
  title: 'New Title',
  paragraphs: [
    'First paragraph',
    'Second paragraph'
  ]
}
```

### Add Footer Section
**File**: `config/data.js`

```javascript
// In CONFIG.footer.sections array, add:
{
  title: 'Section Title',
  links: [
    { label: 'Link 1', action: 'scrollTo', target: '#section' },
    { label: 'Link 2', action: 'openModal', target: 'supportModal' }
  ]
}
```

### Change Payment Methods
**File**: `config/data.js`

```javascript
CONFIG.paymentMethods = [
  { id: 'gpay', label: 'Google Pay', icon: '📱' },
  { id: 'upi', label: 'UPI', icon: '💳' },
  // Add or modify here
]
```

## 🎨 Styling

### Modify Button Styles
**File**: `css/styles.css`

Search for `.cta-button`, `.buy-button`, or `.submit-button` and edit.

### Adjust Spacing
**File**: `css/styles.css`

```css
:root {
  --spacing-xs: 0.5rem;    /* Small padding */
  --spacing-sm: 1rem;      /* Standard padding */
  --spacing-md: 1.5rem;    /* Medium padding */
  --spacing-lg: 2rem;      /* Large padding */
  --spacing-xl: 3rem;      /* Extra large */
  --spacing-2xl: 4rem;     /* Double extra large */
}
```

### Change Border Radius
**File**: `css/styles.css`

```css
:root {
  --radius-sm: 10px;
  --radius-md: 15px;
  --radius-lg: 20px;
  --radius-full: 50px;
}
```

### Adjust Font Sizes
**File**: `css/styles.css`

```css
:root {
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.1rem;
  --font-size-xl: 1.3rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2.5rem;
  --font-size-4xl: 3rem;
}
```

## 💻 JavaScript

### Track Custom Events
**Add anywhere in code:**
```javascript
Analytics.trackEvent('event_name', {
  key1: 'value1',
  key2: 'value2'
});
```

### Show Success Message
**In any manager:**
```javascript
this.modalManager.showSuccess('modalId', '✓ Message here');
```

### Save Data
**File**: `js/utils.js` - Storage helper
```javascript
Storage.set('key_name', data);
Storage.get('key_name');
Storage.remove('key_name');
```

### Get DOM Element Safely
```javascript
const element = DOM.select('#elementId');
const allElements = DOM.selectAll('.className');
```

### Add Event Listener
```javascript
DOM.on('#elementId', 'click', (event) => {
  // Handle click
});
```

### Validate Form
```javascript
const validation = Validation.validateForm([
  { selector: '#inputId', type: 'email', required: true, message: 'Email' },
  { selector: '#inputId2', type: 'phone', required: true, message: 'Phone' }
]);

if (validation.isValid) {
  // Process form
}
```

### Format Values
```javascript
Format.currency(99999);     // ₹99,999
Format.date(new Date());    // Jan 15, 2026
Format.phone('919876543210'); // +91 98765 43210
```

## 📋 File Reference

| File | Purpose | Edit When |
|------|---------|-----------|
| `config/data.js` | All content & configuration | Adding products, features, links |
| `css/styles.css` | All styling | Changing colors, fonts, layout |
| `js/app.js` | Application logic | Modifying modal behavior, forms |
| `js/utils.js` | Reusable functions | Adding helper functions |
| `js/templates.js` | HTML generators | Creating new component types |
| `js/init.js` | Page rendering | Adding new dynamic sections |
| `index.html` | Page structure | Rarely - use data-driven approach |

## 🔍 Finding Things

**Where is the product price?**
- `config/data.js` → `CONFIG.products[0].price`

**Where are button colors?**
- `css/styles.css` → `--primary-color`, `--accent-green`

**Where is form validation?**
- `js/app.js` → `PreOrderManager.validatePreOrderForm()`

**Where are payment methods?**
- `config/data.js` → `CONFIG.paymentMethods`

**Where is the hero image?**
- `config/data.js` → `CONFIG.hero.image`

**Where are modal titles?**
- `config/data.js` → Modal ID determines title
- Or `index.html` → `<h2>` in modal

**Where is form handling?**
- `js/app.js` → `PreOrderManager` class
- `js/app.js` → `SupportManager` class

## 🧪 Testing Changes

1. **Edit a config value**
   - Refresh browser (F5)
   - See change immediately

2. **Edit CSS**
   - Save file
   - Refresh browser
   - See style change

3. **Edit JavaScript**
   - Save file
   - Open DevTools (F12)
   - Check Console for errors
   - Refresh browser

4. **Test on Mobile**
   - Resize browser
   - Or use DevTools device mode (Ctrl+Shift+M)

## 🐛 Debugging

**Open Developer Console:**
- **Windows/Linux**: F12
- **Mac**: Cmd+Option+I

**Check for errors:**
- Errors appear in red in Console
- Look for typos in config

**Log variables:**
```javascript
console.log('Variable:', variableName);
// In code: Logger.info('Message', data);
```

**Check element in inspector:**
- Right-click element → Inspect
- See HTML structure
- Check applied CSS

## 📱 Responsive Testing

**Mobile breakpoints:**
- **Tablet**: 768px wide (iPad)
- **Mobile**: 480px wide (iPhone)

**Test in DevTools:**
- F12 → Device Mode (Ctrl+Shift+M)
- Test different screen sizes

## 🚀 Performance Tips

**For faster page loads:**
1. Compress images (tinypng.com)
2. Minify CSS when deploying
3. Minify JavaScript when deploying
4. Enable browser caching
5. Use CDN for images

**For better user experience:**
1. Lazy load images
2. Debounce search inputs
3. Show loading indicators
4. Validate forms before submit

## 🆘 Common Issues & Solutions

**Page not loading?**
- Check browser console for errors (F12)
- Verify all script files exist in `js/` folder
- Check config/data.js syntax (valid JSON)

**Styling not working?**
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file path in index.html
- Verify CSS variable names

**Forms not submitting?**
- Check validation in PreOrderManager
- Look for console errors (F12)
- Verify all required fields have values

**Products not appearing?**
- Check config/data.js syntax
- Verify image paths exist
- Check browser console for JS errors

**Mobile looking broken?**
- Check responsive CSS (@media queries)
- Test in DevTools device mode
- Verify viewport meta tag in HTML

## 📞 Support

For help with:
- **Architecture**: Read `docs/SCALABILITY_GUIDE.md`
- **Performance**: Read `docs/PERFORMANCE.md`
- **Specific task**: Check this Quick Reference
- **Code questions**: Check inline comments in files

---

**Last Updated**: January 2026
**Version**: 2.0 Scalable Architecture
