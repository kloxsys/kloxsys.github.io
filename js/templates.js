/**
 * COMPONENT TEMPLATES
 * Reusable HTML template generators for scalable component rendering
 * 
 * Usage: Use template functions to generate dynamic content
 * Benefits: DRY principle, easy to maintain, data-driven rendering
 */

const Templates = {
  /**
   * Product Card Template
   */
  productCard: (product) => {
    const advancePrice = product.price * 0.2;
    const imageHTML = product.image
      ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
      : Templates.productSVG(product.id);

    return `
      <div class="product-card">
        <div class="product-image">
          ${imageHTML}
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="price">${Format.currency(product.price)}</div>
          <div class="product-actions">
            <button class="buy-button" onclick="window.appManager.cartManager.addItem('${product.id}', 1)" title="Add to Cart">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Product SVG Generator for missing images
   */
  productSVG: (productId) => {
    const svgs = {
      'agni-512': `
        <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="device1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#2d3748"/>
              <stop offset="100%" style="stop-color:#1a202c"/>
            </linearGradient>
          </defs>
          <rect x="40" y="30" width="120" height="90" rx="8" fill="url(#device1)"/>
          <rect x="50" y="40" width="100" height="60" fill="#f0f0f0" opacity="0.2"/>
          <circle cx="100" cy="75" r="15" fill="#00a86b" opacity="0.8"/>
          <text x="100" y="140" font-size="12" fill="#00d4ff" text-anchor="middle" font-weight="bold">512Wh</text>
        </svg>
      `,
      'agni-1024': `
        <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="device2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#2d3748"/>
              <stop offset="100%" style="stop-color:#1a202c"/>
            </linearGradient>
          </defs>
          <rect x="35" y="25" width="130" height="100" rx="10" fill="url(#device2)"/>
          <rect x="48" y="37" width="50" height="35" rx="4" fill="#00d4ff" opacity="0.6"/>
          <circle cx="135" cy="54" r="10" fill="#00a86b" opacity="0.9"/>
          <rect x="48" y="80" width="104" height="10" rx="5" fill="#34495e"/>
          <rect x="48" y="97" width="104" height="10" rx="5" fill="#34495e"/>
          <text x="100" y="145" font-size="12" fill="#00d4ff" text-anchor="middle" font-weight="bold">1024Wh</text>
        </svg>
      `,
      'agni-2048': `
        <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="device3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1a202c"/>
              <stop offset="100%" style="stop-color:#000000"/>
            </linearGradient>
          </defs>
          <rect x="30" y="20" width="140" height="110" rx="12" fill="url(#device3)"/>
          <rect x="45" y="35" width="60" height="40" rx="5" fill="#f093fb" opacity="0.7"/>
          <circle cx="140" cy="55" r="12" fill="#00a86b"/>
          <rect x="45" y="85" width="110" height="12" rx="6" fill="#34495e"/>
          <rect x="45" y="103" width="110" height="12" rx="6" fill="#34495e"/>
          <text x="100" y="145" font-size="12" fill="#f5576c" text-anchor="middle" font-weight="bold">2048Wh</text>
        </svg>
      `,
    };

    return svgs[productId] || '';
  },

  /**
   * Feature Card Template
   */
  featureCard: (feature) => `
    <div class="feature-card">
      <span class="icon">${feature.icon}</span>
      <h3>${feature.title}</h3>
      <p>${feature.description}</p>
    </div>
  `,

  /**
   * Navigation Links Template (with dropdown support)
   */
  navLink: (navItem) => {
    if (navItem.children && navItem.children.length > 0) {
      // Parent menu item with children
      const childrenHTML = navItem.children.map(child => {
        if (child.children && child.children.length > 0) {
          // Nested submenu (3-level)
          const nestedChildren = child.children
            .map(nested => `<li><a href="${nested.href}">${nested.label}</a></li>`)
            .join('');
          return `
            <li class="nav-submenu-parent">
              <span class="nav-submenu-title">${child.label}</span>
              <ul class="nav-submenu-nested">
                ${nestedChildren}
              </ul>
            </li>
          `;
        } else {
          // Regular submenu item
          return `<li><a href="${child.href}">${child.label}</a></li>`;
        }
      }).join('');

      return `
        <li class="nav-item-parent">
          <a href="${navItem.href}" class="nav-parent-link">${navItem.label}</a>
          <ul class="nav-dropdown">
            ${childrenHTML}
          </ul>
        </li>
      `;
    } else {
      // Simple menu item without children
      return `<li><a href="${navItem.href}">${navItem.label}</a></li>`;
    }
  },

  /**
   * Footer Section Template
   */
  footerSection: (section) => {
    const linksHTML = section.links
      .map(link => `<a onclick="handleFooterLink(${JSON.stringify(link).replace(/"/g, '&quot;')})">${link.label}</a>`)
      .join('');

    return `
      <div class="footer-section">
        <h4>${section.title}</h4>
        ${linksHTML}
      </div>
    `;
  },

  /**
   * Success Message Template
   */
  successMessage: (message) => `
    <div class="success-message show">
      ✓ ${message}
    </div>
  `,

  /**
   * Error Message Template
   */
  errorMessage: (message) => `
    <div class="error-message show">
      ✗ ${message}
    </div>
  `,

  /**
   * Loading Spinner Template
   */
  spinner: () => `
    <div class="spinner">
      <div class="spinner-border"></div>
      <p>Loading...</p>
    </div>
  `,

  /**
   * Modal Backdrop Template
   */
  modalBackdrop: (modalId, title, subtitle, content) => `
    <div id="${modalId}" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close-modal" onclick="closeModal('${modalId}')">&times;</button>
          <h2>${title}</h2>
          <p>${subtitle}</p>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    </div>
  `,

  /**
   * Form Group Template
   */
  formGroup: (options) => {
    const {
      label,
      name,
      id,
      type = 'text',
      placeholder = '',
      required = false,
      value = '',
      options: selectOptions = [],
    } = options;

    const requiredAttr = required ? 'required' : '';
    const idAttr = id || name;

    if (type === 'textarea') {
      return `
        <div class="form-group">
          <label for="${idAttr}">${label}${required ? ' *' : ''}</label>
          <textarea id="${idAttr}" name="${name}" placeholder="${placeholder}" ${requiredAttr}>${value}</textarea>
        </div>
      `;
    }

    if (type === 'select') {
      const optionsHTML = selectOptions
        .map(opt => `<option value="${opt.value}">${opt.label}</option>`)
        .join('');

      return `
        <div class="form-group">
          <label for="${idAttr}">${label}${required ? ' *' : ''}</label>
          <select id="${idAttr}" name="${name}" ${requiredAttr}>
            <option value="">Select an option</option>
            ${optionsHTML}
          </select>
        </div>
      `;
    }

    return `
      <div class="form-group">
        <label for="${idAttr}">${label}${required ? ' *' : ''}</label>
        <input type="${type}" id="${idAttr}" name="${name}" placeholder="${placeholder}" value="${value}" ${requiredAttr}>
      </div>
    `;
  },

  /**
   * Payment Option Template
   */
  paymentOption: (method, checked = false) => `
    <label class="payment-option${checked ? ' selected' : ''}">
      <input type="radio" name="payment" value="${method.id}"${checked ? ' checked' : ''}>
      <div class="payment-icon">${method.icon}</div>
      <div>${method.label}</div>
    </label>
  `,

  /**
   * Order Summary Template
   */
  orderSummary: (product, quantity = 1, price) => {
    const total = price * quantity;
    const advance = total * 0.2;

    return `
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Product:</span>
          <span>${product}</span>
        </div>
        <div class="summary-row">
          <span>Quantity:</span>
          <span>${quantity}</span>
        </div>
        <div class="summary-row">
          <span>Unit Price:</span>
          <span>${Format.currency(price)}</span>
        </div>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${Format.currency(total)}</span>
        </div>
        <div class="summary-row">
          <span>Advance Payment (20%):</span>
          <span>${Format.currency(advance)}</span>
        </div>
      </div>
    `;
  },

  /**
   * Tabs Container Template
   */
  tabsContainer: (title, description, tabs) => {
    const tabButtons = tabs.map(tab =>
      `<button class="tab-button ${tab.active ? 'active' : ''}" data-tab="${tab.id}">
        ${tab.icon ? `<span>${tab.icon}</span> ` : ''}${tab.name}
      </button>`
    ).join('');

    const tabContents = tabs.map(tab =>
      `<div id="tab-${tab.id}" class="tab-content ${tab.active ? 'active' : ''}">
        <div class="tab-grid">
          ${tab.items.map(item => Templates.tabItem(item)).join('')}
        </div>
      </div>`
    ).join('');

    return `
      <div class="tabs-container">
        <div class="tabs-header">
          <h2>${title}</h2>
          <p>${description}</p>
        </div>
        <nav class="tabs-navigation">
          ${tabButtons}
        </nav>
        <div class="tabs-content">
          ${tabContents}
        </div>
      </div>
    `;
  },

  /**
   * Tab Item Template
   */
  tabItem: (item) => {
    const specs = item.specs ? Object.entries(item.specs).map(([label, value]) =>
      `<div class="spec-row">
        <span class="spec-label">${label}</span>
        <span class="spec-value">${value}</span>
      </div>`
    ).join('') : '';

    return `
      <div class="tab-item">
        ${item.icon ? `<div class="tab-item-icon">${item.icon}</div>` : ''}
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        ${specs ? `<div class="tab-item-specs">${specs}</div>` : ''}
      </div>
    `;
  },

  /**
   * Shopping Cart Item Template
   */
  cartItem: (item) => `
    <div class="cart-item" data-product-id="${item.id}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p class="item-price">${Format.currency(item.price)}</p>
      </div>
      <div class="cart-item-quantity">
        <button class="qty-btn" onclick="window.appManager.cartManager.updateQuantity('${item.id}', -1)" title="Decrease">−</button>
        <input type="number" class="qty-input" value="${item.quantity}" min="1" max="10" data-product-id="${item.id}" onchange="window.appManager.cartManager.updateQuantity('${item.id}', this.value)">
        <button class="qty-btn" onclick="window.appManager.cartManager.updateQuantity('${item.id}', 1)" title="Increase">+</button>
      </div>
      <div class="cart-item-total">
        <p class="item-total">${Format.currency(item.price * item.quantity)}</p>
      </div>
      <button class="cart-item-remove" onclick="window.appManager.cartManager.removeItem('${item.id}')" title="Remove">✕</button>
    </div>
  `,

  /**
   * Shopping Cart Modal Template
   */
  cartModal: (items, total, itemCount) => {
    const itemsHTML = items.length > 0 
      ? items.map(item => Templates.cartItem(item)).join('')
      : '<p class="empty-cart">Your cart is empty. Start adding products!</p>';

    return `
      <div class="cart-summary">
        <div class="cart-header">
          <h3>Shopping Cart</h3>
          <span class="cart-count">${itemCount} items</span>
        </div>
        <div class="cart-items">
          ${itemsHTML}
        </div>
        <div class="cart-totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>${Format.currency(total)}</span>
          </div>
          <div class="totals-row">
            <span>Advance Payment (20%):</span>
            <span>${Format.currency(total * 0.2)}</span>
          </div>
          <div class="totals-row total">
            <span>Total Due:</span>
            <span>${Format.currency(total * 0.2)}</span>
          </div>
        </div>
        <button class="checkout-button" ${items.length === 0 ? 'disabled' : ''} onclick="window.appManager.cartManager.checkout()">
          Proceed to Checkout
        </button>
      </div>
    `;
  },

  /**
   * User Menu Template
   */
  userMenu: (user) => `
    <div class="user-menu">
      <div class="user-info">
        ${user.photoUrl ? `<img src="${user.photoUrl}" alt="${user.displayName}" class="user-avatar">` : '<div class="user-avatar-placeholder">👤</div>'}
        <div>
          <p class="user-name">${user.displayName || 'User'}</p>
          <p class="user-email">${user.email}</p>
        </div>
      </div>
      <div class="user-menu-items">
        <a href="#profile" onclick="window.appManager.userManager.openProfile(event)">👤 Profile</a>
        <a href="#orders" onclick="window.appManager.userManager.openOrders(event)">📦 Orders</a>
        <a href="#settings" onclick="window.appManager.userManager.openSettings(event)">⚙️ Settings</a>
        <hr>
        <a href="#logout" onclick="window.appManager.userManager.logout(event)" class="logout-link">🚪 Logout</a>
      </div>
    </div>
  `,

  /**
   * Auth Modal Template
   */
  authModal: () => `
    <div class="auth-tabs">
      <button class="auth-tab-btn active" data-tab="login" onclick="window.switchAuthTab('login')">Sign In</button>
      <button class="auth-tab-btn" data-tab="signup" onclick="window.switchAuthTab('signup')">Sign Up</button>
    </div>
    <div id="login-tab" class="auth-tab-content active">
      <p class="auth-description">Sign in to your account</p>
      
      <div class="form-group">
        <label for="loginEmail">Email</label>
        <input type="email" id="loginEmail" placeholder="Enter your email">
      </div>
      <div class="form-group">
        <label for="loginPassword">Password</label>
        <input type="password" id="loginPassword" placeholder="Enter your password">
      </div>
      <button class="submit-button" onclick="if(window.appManager.userManager.login(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value)) { window.appManager.userManager.saveUser(); window.appManager.modalManager.closeModal('authModal'); window.appManager.userManager.refreshUI(); } else { alert('Invalid email or password'); }">
        Sign In
      </button>

      <div class="auth-divider">or</div>

      <button class="google-auth-btn" id="googleLoginBtn" onclick="window.appManager.userManager.signInWithGoogle()">
        🔐 Sign In with Google
      </button>
    </div>
    <div id="signup-tab" class="auth-tab-content">
      <p class="auth-description">Create a new account</p>
      
      <div class="form-group">
        <label for="signupName">Full Name</label>
        <input type="text" id="signupName" placeholder="Enter your full name">
      </div>
      <div class="form-group">
        <label for="signupEmail">Email</label>
        <input type="email" id="signupEmail" placeholder="Enter your email">
      </div>
      <div class="form-group">
        <label for="signupPassword">Password</label>
        <input type="password" id="signupPassword" placeholder="Create a password (min 6 chars)">
      </div>
      <div class="form-group">
        <label for="signupConfirm">Confirm Password</label>
        <input type="password" id="signupConfirm" placeholder="Confirm your password">
      </div>
      <button class="submit-button" onclick="
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const pwd = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;
        
        if(!name || !email || !pwd) { 
          alert('All fields are required');
          return;
        }
        if(pwd.length < 6) { 
          alert('Password must be at least 6 characters');
          return;
        }
        if(pwd !== confirm) { 
          alert('Passwords do not match');
          return;
        }
        
        if(window.appManager.userManager.register(email, pwd, name)) {
          window.appManager.userManager.saveUser();
          window.appManager.modalManager.closeModal('authModal');
          window.appManager.userManager.refreshUI();
          alert('Registration successful! Welcome ' + name);
        }
      ">
        Sign Up
      </button>

      <div class="auth-divider">or</div>

      <button class="google-auth-btn" id="googleSignupBtn" onclick="window.appManager.userManager.signUpWithGoogle()">
        🔐 Sign Up with Google
      </button>
    </div>
  `,

  /**
   * Team Member Card Template
   */
  teamMember: (member) => `
    <div class="team-member-card">
      <div class="member-icon">${member.icon}</div>
      <h3>${member.name}</h3>
      <p class="member-role">${member.role}</p>
      <p class="member-bio">${member.bio}</p>
    </div>
  `,

  /**
   * Vision Section Template
   */
  visionSection: (vision) => `
    <div class="vision-container">
      <div class="vision-box mission-box">
        <h3>${vision.mission.icon} ${vision.mission.title}</h3>
        <p>${vision.mission.description}</p>
      </div>
      <div class="vision-box vision-box">
        <h3>${vision.vision.icon} ${vision.vision.title}</h3>
        <p>${vision.vision.description}</p>
      </div>
      <div class="values-grid">
        ${vision.values.map(value => `
          <div class="value-card">
            <div class="value-icon">${value.icon}</div>
            <h4>${value.title}</h4>
            <p>${value.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `,

  /**
   * Service Card Template
   */
  serviceCard: (service) => `
    <div class="service-card">
      <div class="service-icon">${service.icon}</div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
      <a href="${service.href}" class="service-link">Learn More →</a>
    </div>
  `,

  /**
   * Service Detail Section Template
   */
  serviceDetailSection: (service) => `
    <div class="service-detail-container">
      <p class="service-description">${service.description}</p>
      <div class="service-features-grid">
        ${service.features.map(feature => `
          <div class="feature-item">
            <div class="feature-icon">${feature.icon}</div>
            <h4>${feature.title}</h4>
            <p>${feature.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `,

  /**
   * FAQ Section Template
   */
  faqSection: (faqs) => `
    <div class="faq-container">
      ${faqs.map((faq, index) => `
        <div class="faq-item">
          <div class="faq-question" onclick="toggleFAQ(${index})">
            <span>${faq.question}</span>
            <span class="faq-toggle">+</span>
          </div>
          <div class="faq-answer" id="faq-${index}">
            <p>${faq.answer}</p>
            <span class="faq-category">${faq.category}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `,

  /**
   * Knowledge Base Article Template
   */
  kbArticle: (article) => `
    <div class="kb-article-card">
      <div class="kb-icon">${article.icon}</div>
      <h4>${article.title}</h4>
      <p class="kb-category">${article.category}</p>
      <p>${article.content}</p>
      <a href="#" class="kb-link">Read Full Article →</a>
    </div>
  `,

  /**
   * Store Section Template
   */
  storeSection: (store) => `
    <div class="store-container">
      <div class="store-highlights">
        ${store.highlights.map(highlight => `
          <div class="highlight-card">
            <div class="highlight-icon">${highlight.icon}</div>
            <h4>${highlight.title}</h4>
            <p>${highlight.description}</p>
          </div>
        `).join('')}
      </div>
      <div class="store-section">
        <h3>Featured Accessories</h3>
        <div class="accessories-grid">
          ${store.accessories.map(accessory => `
            <div class="accessory-card">
              <div class="accessory-icon">${accessory.icon}</div>
              <h4>${accessory.name}</h4>
              <p>${accessory.description}</p>
              <div class="accessory-footer">
                <span class="price">${Format.currency(accessory.price)}</span>
                <button class="add-btn" onclick="window.appManager.cartManager.addItem('${accessory.name.toLowerCase().replace(/\\s+/g, '-')}', 1)">Add</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `,

  /**
   * Profile Page Template
   */
  profilePage: (user) => `
    <div class="profile-page">
      <div class="profile-header">
        <div class="profile-avatar">
          ${user.photoUrl ? `<img src="${user.photoUrl}" alt="${user.displayName}">` : '<div class="avatar-placeholder">👤</div>'}
        </div>
        <div class="profile-info">
          <h3>${user.displayName}</h3>
          <p>${user.email}</p>
          <p class="account-since">Member since ${new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div class="profile-form">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="displayName" value="${user.displayName}" placeholder="Enter your full name">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="email" value="${user.email}" disabled placeholder="Your email">
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" id="phoneNumber" value="${user.phoneNumber || ''}" placeholder="Enter your phone number">
        </div>
        <button class="submit-button" onclick="window.appManager.userManager.updateProfile(document.getElementById('displayName').value, document.getElementById('phoneNumber').value); alert('Profile updated successfully!'); closeModal('profileModal')">
          Save Changes
        </button>
      </div>
    </div>
  `,

  /**
   * Orders Page Template
   */
  ordersPage: (orders) => `
    <div class="orders-page">
      ${orders.length > 0 ? `
        <div class="orders-list">
          ${orders.map(order => `
            <div class="order-card">
              <div class="order-header">
                <span class="order-id">Order #${order.id.substring(4, 10).toUpperCase()}</span>
                <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span>
              </div>
              <div class="order-details">
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Items:</strong> ${order.items || 'N/A'}</p>
                <p><strong>Total:</strong> ${Format.currency(order.total || 0)}</p>
                ${order.address ? `<p><strong>Delivery:</strong> ${order.address}</p>` : ''}
              </div>
              <button class="buy-button" onclick="alert('Order details: ${order.id}')">View Details</button>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <p>📦 No orders yet</p>
          <p>Your orders will appear here once you make a purchase</p>
          <a href="#products" class="cta-button" onclick="closeModal('ordersModal')">Start Shopping</a>
        </div>
      `}
    </div>
  `,

  /**
   * Address Management Page Template
   */
  addressPage: (addresses) => `
    <div class="address-page">
      <div class="add-address-form">
        <h3>Add New Address</h3>
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="addrName" placeholder="Enter your name">
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" id="addrPhone" placeholder="Enter phone number">
        </div>
        <div class="form-group">
          <label>Address Line 1</label>
          <input type="text" id="addrLine1" placeholder="Street address">
        </div>
        <div class="form-group">
          <label>Address Line 2</label>
          <input type="text" id="addrLine2" placeholder="Apartment, suite, etc. (optional)">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>City</label>
            <input type="text" id="addrCity" placeholder="City">
          </div>
          <div class="form-group">
            <label>State/Province</label>
            <input type="text" id="addrState" placeholder="State">
          </div>
          <div class="form-group">
            <label>Postal Code</label>
            <input type="text" id="addrZip" placeholder="ZIP/Postal code">
          </div>
        </div>
        <div class="form-group">
          <label>Country</label>
          <input type="text" id="addrCountry" placeholder="Country">
        </div>
        <button class="submit-button" onclick="window.appManager.userManager.addAddress({
          name: document.getElementById('addrName').value,
          phone: document.getElementById('addrPhone').value,
          line1: document.getElementById('addrLine1').value,
          line2: document.getElementById('addrLine2').value,
          city: document.getElementById('addrCity').value,
          state: document.getElementById('addrState').value,
          zip: document.getElementById('addrZip').value,
          country: document.getElementById('addrCountry').value,
        }); alert('Address added successfully!'); window.appManager.userManager.showAddressPage()">
          Add Address
        </button>
      </div>

      <div class="saved-addresses">
        <h3>Saved Addresses</h3>
        ${addresses.length > 0 ? `
          ${addresses.map(addr => `
            <div class="address-card">
              <div class="address-info">
                <p><strong>${addr.name}</strong></p>
                <p>${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}</p>
                <p>${addr.city}, ${addr.state} ${addr.zip}</p>
                <p>${addr.country}</p>
                <p>📱 ${addr.phone}</p>
              </div>
              <div class="address-actions">
                <button class="buy-button secondary" onclick="window.appManager.userManager.deleteAddress('${addr.id}'); window.appManager.userManager.showAddressPage()">Delete</button>
              </div>
            </div>
          `).join('')}
        ` : `
          <p class="empty-message">No saved addresses yet. Add one above.</p>
        `}
      </div>
    </div>
  `,
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Templates;
}
