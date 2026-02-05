/**
 * KLOX SYSTEMS - APPLICATION LOGIC
 * Main application logic for modals, forms, and interactions
 * 
 * Depends on: config/data.js, js/utils.js
 */

// ============================================
// MODAL MANAGEMENT
// ============================================

class ModalManager {
  constructor() {
    this.currentModal = null;
    this.init();
  }

  /**
   * Initialize modal event listeners
   */
  init() {
    // Close modal when clicking outside of it
    DOM.on('.modal', 'click', (e) => {
      if (e.target === e.currentTarget) {
        this.closeModal(e.currentTarget.id);
      }
    });

    // Close modal button
    DOM.on('.close-modal', 'click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) {
        this.closeModal(modal.id);
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentModal) {
        this.closeModal(this.currentModal);
      }
    });
  }

  /**
   * Open modal by ID
   */
  openModal(modalId) {
    const modal = DOM.select(`#${modalId}`);
    if (modal) {
      DOM.addClass(modal, 'show');
      this.currentModal = modalId;
      document.body.style.overflow = 'hidden';
      Logger.info(`Modal opened: ${modalId}`);
      Analytics.trackEvent('modal_opened', { modal_id: modalId });
    }
  }

  /**
   * Close modal by ID
   */
  closeModal(modalId) {
    const modal = DOM.select(`#${modalId}`);
    if (modal) {
      DOM.removeClass(modal, 'show');
      this.currentModal = null;
      document.body.style.overflow = '';

      // Reset success messages
      DOM.removeClass(`#${modalId} .success-message`, 'show');

      Logger.info(`Modal closed: ${modalId}`);
    }
  }

  /**
   * Show success message in modal
   */
  showSuccess(modalId, message = null) {
    const successElement = DOM.select(`#${modalId} .success-message`);
    if (successElement) {
      if (message) {
        successElement.textContent = message;
      }
      DOM.addClass(successElement, 'show');

      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.closeModal(modalId);
      }, 3000);
    }
  }
}

// ============================================
// PRE-ORDER FORM MANAGEMENT
// ============================================

class PreOrderManager {
  constructor() {
    this.modalManager = null;
    this.currentProduct = null;
    this.currentPrice = 0;
  }

  /**
   * Set modal manager reference
   */
  setModalManager(modalManager) {
    this.modalManager = modalManager;
  }

  /**
   * Open pre-order form for product
   */
  openPreOrder(productId) {
    const product = CONFIG.products.find(p => p.id === productId);
    if (!product) {
      Logger.error('Product not found', { productId });
      return;
    }

    this.currentProduct = product;
    this.currentPrice = product.price;

    // Update modal with product info
    DOM.select('#orderProduct').textContent = product.name;
    DOM.select('#orderPrice').textContent = Format.currency(product.price);
    DOM.select('#orderAdvance').textContent = Format.currency(
      product.price * CONFIG.constants.advancePaymentPercent
    );
    DOM.select('#orderQuantity').value = 1;

    // Reset form
    this.resetPreOrderForm();

    // Open modal
    this.modalManager.openModal('preOrderModal');
    Analytics.trackEvent('pre_order_opened', { product: product.name });
  }

  /**
   * Update order summary when quantity changes
   */
  updateOrderSummary() {
    const quantity = parseInt(DOM.select('#orderQuantity').value) || 1;
    const total = this.currentPrice * quantity;
    const advance = total * CONFIG.constants.advancePaymentPercent;

    DOM.select('#orderPrice').textContent = Format.currency(total);
    DOM.select('#orderAdvance').textContent = Format.currency(advance);

    Analytics.trackEvent('quantity_changed', { quantity, total });
  }

  /**
   * Validate pre-order form
   */
  validatePreOrderForm() {
    const validation = Validation.validateForm([
      { selector: '#customerName', type: 'text', required: true, message: 'Full Name' },
      { selector: '#customerEmail', type: 'email', required: true, message: 'Email Address' },
      { selector: '#customerPhone', type: 'phone', required: true, message: 'Phone Number' },
      { selector: '#customerAddress', type: 'text', required: true, message: 'Delivery Address' },
    ]);

    if (!validation.isValid) {
      alert('Please fix the following errors:\n' + validation.errors.join('\n'));
      return false;
    }

    return true;
  }

  /**
   * Submit pre-order form
   */
  async submitPreOrder() {
    if (!this.validatePreOrderForm()) {
      return;
    }

    const formData = {
      product: DOM.select('#orderProduct').textContent,
      price: this.currentPrice,
      quantity: parseInt(DOM.select('#orderQuantity').value),
      advance_payment: this.currentPrice * CONFIG.constants.advancePaymentPercent * parseInt(DOM.select('#orderQuantity').value),
      customer_name: DOM.select('#customerName').value,
      customer_email: DOM.select('#customerEmail').value,
      customer_phone: DOM.select('#customerPhone').value,
      customer_address: DOM.select('#customerAddress').value,
      payment_method: document.querySelector('input[name="payment"]:checked')?.value,
      timestamp: new Date().toISOString(),
    };

    Logger.info('Pre-order submitted', formData);
    Analytics.trackEvent('pre_order_submitted', {
      product: formData.product,
      quantity: formData.quantity,
      amount: formData.advance_payment,
    });

    // TODO: Send to backend API
    // await fetch('/api/pre-order', { method: 'POST', body: JSON.stringify(formData) })

    // Save to localStorage for demo
    Storage.set('lastPreOrder', formData);

    // Show success message
    this.modalManager.showSuccess('preOrderModal');
  }

  /**
   * Reset pre-order form
   */
  resetPreOrderForm() {
    DOM.select('#customerName').value = '';
    DOM.select('#customerEmail').value = '';
    DOM.select('#customerPhone').value = '';
    DOM.select('#customerAddress').value = '';
    document.querySelector('input[name="payment"]').checked = true;
  }
}

// ============================================
// SUPPORT FORM MANAGEMENT
// ============================================

class SupportManager {
  constructor() {
    this.modalManager = null;
  }

  /**
   * Set modal manager reference
   */
  setModalManager(modalManager) {
    this.modalManager = modalManager;
  }

  /**
   * Validate support form
   */
  validateSupportForm() {
    const validation = Validation.validateForm([
      { selector: '#supportName', type: 'text', required: true, message: 'Full Name' },
      { selector: '#supportEmail', type: 'email', required: true, message: 'Email Address' },
      { selector: '#supportPhone', type: 'phone', required: true, message: 'Phone Number' },
      { selector: '#supportCategory', type: 'text', required: true, message: 'Issue Category' },
      { selector: '#supportMessage', type: 'text', required: true, message: 'Message' },
    ]);

    if (!validation.isValid) {
      alert('Please fix the following errors:\n' + validation.errors.join('\n'));
      return false;
    }

    return true;
  }

  /**
   * Submit support request
   */
  async submitSupportRequest() {
    if (!this.validateSupportForm()) {
      return;
    }

    const formData = {
      name: DOM.select('#supportName').value,
      email: DOM.select('#supportEmail').value,
      phone: DOM.select('#supportPhone').value,
      product: DOM.select('#supportProduct').value || 'Not specified',
      category: DOM.select('#supportCategory').value,
      message: DOM.select('#supportMessage').value,
      timestamp: new Date().toISOString(),
    };

    Logger.info('Support request submitted', formData);
    Analytics.trackEvent('support_request_submitted', {
      category: formData.category,
      product: formData.product,
    });

    // TODO: Send to backend API
    // await fetch('/api/support', { method: 'POST', body: JSON.stringify(formData) })

    // Save to localStorage for demo
    Storage.set('lastSupportRequest', formData);

    // Show success message
    this.modalManager.showSuccess('supportModal');
  }

  /**
   * Reset support form
   */
  resetSupportForm() {
    DOM.select('#supportName').value = '';
    DOM.select('#supportEmail').value = '';
    DOM.select('#supportPhone').value = '';
    DOM.select('#supportProduct').value = '';
    DOM.select('#supportCategory').value = '';
    DOM.select('#supportMessage').value = '';
  }
}

// ============================================
// PAYMENT OPTIONS
// ============================================

class PaymentManager {
  constructor() {
    this.init();
  }

  /**
   * Initialize payment option selection
   */
  init() {
    DOM.on('.payment-option', 'click', (e) => {
      const option = e.currentTarget;
      const radio = option.querySelector('input[type="radio"]');

      // Remove selected class from all options
      document.querySelectorAll('.payment-option').forEach(opt => {
        DOM.removeClass(opt, 'selected');
      });

      // Add selected class to clicked option
      DOM.addClass(option, 'selected');
      radio.checked = true;

      const paymentMethod = radio.value;
      Analytics.trackEvent('payment_method_selected', { method: paymentMethod });
    });
  }
}

// ============================================
// SHOPPING CART MANAGEMENT
// ============================================

class CartManager {
  constructor() {
    this.items = [];
    this.init();
  }

  /**
   * Initialize cart from local storage
   */
  init() {
    this.loadCart();
    this.setupCartIcon();
  }

  /**
   * Load cart from local storage
   */
  loadCart() {
    const saved = Storage.get(CONFIG.cart.storageKey);
    this.items = saved ? JSON.parse(saved) : [];
    this.updateCartIcon();
  }

  /**
   * Save cart to local storage
   */
  saveCart() {
    Storage.set(CONFIG.cart.storageKey, JSON.stringify(this.items));
    this.updateCartIcon();
    Analytics.trackEvent('cart_updated', { itemCount: this.items.length });
  }

  /**
   * Add item to cart
   */
  addItem(productId, quantity = 1) {
    const product = CONFIG.products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = this.items.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      this.items.push({
        id: productId,
        name: product.name,
        price: product.price,
        quantity: parseInt(quantity),
      });
    }

    this.saveCart();
    this.showNotification(`Added ${product.name} to cart`);
    Logger.info('Item added to cart', { productId, quantity });
  }

  /**
   * Remove item from cart
   */
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.renderCartModal();
    Logger.info('Item removed from cart', { productId });
  }

  /**
   * Update item quantity
   */
  updateQuantity(productId, quantityDelta) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;

    const delta = typeof quantityDelta === 'string' ? 
      parseInt(quantityDelta) - item.quantity : 
      parseInt(quantityDelta);

    item.quantity += delta;

    if (item.quantity <= 0) {
      this.removeItem(productId);
    } else if (item.quantity > CONFIG.constants.maxOrderQuantity) {
      item.quantity = CONFIG.constants.maxOrderQuantity;
    } else {
      this.saveCart();
      this.renderCartModal();
    }
  }

  /**
   * Get cart total
   */
  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  /**
   * Get item count
   */
  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Setup cart icon in header
   */
  setupCartIcon() {
    const header = DOM.select('header nav');
    if (!header.querySelector('.cart-icon-wrapper')) {
      const cartIcon = `
        <div class="cart-icon-wrapper">
          <button class="cart-icon" onclick="window.appManager.cartManager.openCart()" title="Shopping Cart">
            🛒
            <span class="cart-badge" id="cartBadge">${this.getItemCount()}</span>
          </button>
        </div>
      `;
      header.insertAdjacentHTML('beforeend', cartIcon);
    }
  }

  /**
   * Update cart icon badge
   */
  updateCartIcon() {
    const badge = DOM.select('#cartBadge');
    if (badge) {
      const count = this.getItemCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  /**
   * Open cart modal
   */
  openCart() {
    const modal = DOM.select('#cartModal');
    if (!modal) {
      const cartModal = `
        <div id="cartModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <h2>Shopping Cart</h2>
              <button class="close-modal" onclick="closeModal('cartModal')">&times;</button>
            </div>
            <div class="modal-body">
              <div id="cartContent"></div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', cartModal);
    }
    
    this.renderCartModal();
    window.appManager.modalManager.openModal('cartModal');
  }

  /**
   * Render cart modal content
   */
  renderCartModal() {
    const cartContent = DOM.select('#cartContent');
    if (cartContent) {
      const total = this.getTotal();
      const itemCount = this.getItemCount();
      cartContent.innerHTML = Templates.cartModal(this.items, total, itemCount);
    }
  }

  /**
   * Proceed to checkout
   */
  checkout() {
    if (this.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!window.appManager.userManager.isLoggedIn()) {
      alert('Please sign in to proceed with checkout');
      window.appManager.modalManager.openModal('authModal');
      return;
    }

    window.appManager.modalManager.closeModal('cartModal');
    this.showCheckoutFlow();
  }

  /**
   * Show checkout flow
   */
  showCheckoutFlow() {
    // This would integrate with payment gateway
    alert('Checkout flow would process here. Items: ' + this.items.length);
    Logger.info('Checkout initiated', { items: this.items.length });
  }

  /**
   * Show notification
   */
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }
}

// ============================================
// USER MANAGEMENT
// ============================================

class UserManager {
  constructor() {
    this.user = null;
    this.init();
  }

  /**
   * Initialize user manager
   */
  init() {
    this.loadUser();
    this.setupAuthUI();
  }

  /**
   * Load user from local storage
   */
  loadUser() {
    const saved = Storage.get(CONFIG.user.storageKey);
    this.user = saved ? JSON.parse(saved) : null;
    this.updateUserUI();
  }

  /**
   * Save user to local storage
   */
  saveUser() {
    Storage.set(CONFIG.user.storageKey, JSON.stringify(this.user));
    this.updateUserUI();
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return this.user !== null;
  }

  /**
   * Setup auth UI in header
   */
  setupAuthUI() {
    const signInBtn = DOM.select('#signInBtn');
    const userWidget = DOM.select('#userWidget');
    console.log('setupAuthUI called, button found:', !!signInBtn, 'widget found:', !!userWidget);
    
    if (!userWidget) {
      console.error('userWidget not found in DOM');
      return;
    }
    
    if (this.isLoggedIn()) {
      // Show user menu widget in header - replace button with user info
      const userMenuHTML = `
        <div class="user-widget-content">
          <div class="user-widget-header">
            <div class="user-avatar-small">
              ${this.user.photoUrl ? `<img src="${this.user.photoUrl}" alt="${this.user.displayName}">` : '👤'}
            </div>
            <div class="user-widget-info">
              <p class="user-widget-name">${this.user.displayName?.split(' ')[0] || 'User'}</p>
              <p class="user-widget-email">${this.user.email}</p>
            </div>
            <button class="user-widget-menu-btn" onclick="window.appManager.userManager.toggleUserMenu()" title="Menu">⋮</button>
          </div>
          <div id="userMenuDropdown" class="user-menu-dropdown" style="display: none;">
            <a href="#" onclick="window.appManager.userManager.openProfile(event)">Profile</a>
            <a href="#" onclick="window.appManager.userManager.openSettings(event)">Addresses</a>
            <a href="#" onclick="window.appManager.userManager.openOrders(event)">Orders</a>
            <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid var(--border);">
            <a href="#" onclick="window.appManager.userManager.logout()">Sign Out</a>
          </div>
        </div>
      `;
      userWidget.innerHTML = userMenuHTML;
    } else if (signInBtn) {
      // Button already exists, just make sure it's visible
      signInBtn.style.display = 'flex';
      // Add click event listener as backup for onclick attribute
      signInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openAuth();
      });
    }
  }

  /**
   * Open auth modal
   */
  openAuth() {
    try {
      console.log('openAuth called');
      
      // Check if Templates is available
      if (!Templates) {
        console.error('Templates object not found');
        alert('Error: Templates not loaded. Please refresh the page.');
        return;
      }
      
      if (!Templates.authModal) {
        console.error('Templates.authModal not found');
        alert('Error: Auth template not available. Please refresh the page.');
        return;
      }
      
      const existingModal = DOM.select('#authModal');
      if (!existingModal) {
        console.log('Creating new auth modal...');
        
        // Generate auth modal content
        let authModalContent;
        try {
          authModalContent = Templates.authModal();
          console.log('✓ Auth modal content generated');
        } catch (error) {
          console.error('Error generating auth modal content:', error);
          alert('Error: Could not generate sign-in form. Please try refreshing.');
          return;
        }
        
        const authModal = `
        <div id="authModal" class="modal">
          <div class="modal-content auth-modal-content">
            <div class="modal-header">
              <h2>Sign In / Sign Up</h2>
              <button class="close-modal" onclick="window.appManager.modalManager.closeModal('authModal')">&times;</button>
            </div>
            <div class="modal-body">
              ${authModalContent}
            </div>
          </div>
        </div>
      `;
        document.body.insertAdjacentHTML('beforeend', authModal);
        console.log('✓ Auth modal inserted into DOM');
      } else {
        console.log('Auth modal already exists, reusing it');
      }
      
      // Ensure modalManager is available
      if (window.appManager && window.appManager.modalManager) {
        window.appManager.modalManager.openModal('authModal');
        console.log('✓ Auth modal opened successfully');
      } else {
        console.error('modalManager not found');
        alert('Error: Modal manager not initialized. Please refresh the page.');
      }
    } catch (error) {
      console.error('❌ Error in openAuth:', error);
      console.error('Stack trace:', error.stack);
      alert('Error opening sign in dialog: ' + error.message);
    }
  }

  /**
   * Sign in with Google
   */
  signInWithGoogle() {
    // Simulate Google OAuth flow
    // In production, use Firebase or proper OAuth implementation
    this.user = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email: 'user@gmail.com',
      displayName: 'John Doe',
      photoUrl: null,
      createdAt: new Date().toISOString(),
    };
    
    this.saveUser();
    window.appManager.modalManager.closeModal('authModal');
    this.refreshUI();
    Logger.info('User signed in', { email: this.user.email });
    Analytics.trackEvent('user_signed_in');
  }

  /**
   * Sign up with Google
   */
  signUpWithGoogle() {
    // Same as sign in for now - in production would differentiate
    this.signInWithGoogle();
  }

  /**
   * Logout
   */
  logout(event) {
    if (event) event.preventDefault();
    
    this.user = null;
    Storage.remove(CONFIG.user.storageKey);
    this.refreshUI();
    Logger.info('User logged out');
    Analytics.trackEvent('user_logged_out');
    alert('You have been signed out');
  }

  /**
   * Toggle user menu
   */
  toggleUserMenu() {
    const dropdown = DOM.select('#userMenuDropdown');
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
  }

  /**
   * Open user profile page
   */
  openProfile(event) {
    if (event) event.preventDefault();
    window.appManager.modalManager.openModal('profileModal') || this.showProfilePage();
  }

  /**
   * Open user orders page
   */
  openOrders(event) {
    if (event) event.preventDefault();
    window.appManager.modalManager.openModal('ordersModal') || this.showOrdersPage();
  }

  /**
   * Open settings/addresses page
   */
  openSettings(event) {
    if (event) event.preventDefault();
    window.appManager.modalManager.openModal('addressModal') || this.showAddressPage();
  }

  /**
   * Show profile page
   */
  showProfilePage() {
    const profileModal = `
      <div id="profileModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>My Profile</h2>
            <button class="close-modal" onclick="closeModal('profileModal')">&times;</button>
          </div>
          <div class="modal-body">
            ${Templates.profilePage(this.user)}
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', profileModal);
    window.appManager.modalManager.openModal('profileModal');
  }

  /**
   * Show orders page
   */
  showOrdersPage() {
    const orders = this.getOrderHistory();
    const ordersModal = `
      <div id="ordersModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>My Orders</h2>
            <button class="close-modal" onclick="closeModal('ordersModal')">&times;</button>
          </div>
          <div class="modal-body">
            ${Templates.ordersPage(orders)}
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', ordersModal);
    window.appManager.modalManager.openModal('ordersModal');
  }

  /**
   * Show address management page
   */
  showAddressPage() {
    const addresses = this.getAddresses();
    const addressModal = `
      <div id="addressModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>My Addresses</h2>
            <button class="close-modal" onclick="closeModal('addressModal')">&times;</button>
          </div>
          <div class="modal-body">
            ${Templates.addressPage(addresses)}
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', addressModal);
    window.appManager.modalManager.openModal('addressModal');
  }

  /**
   * Add new address
   */
  addAddress(addressData) {
    if (!this.user.addresses) {
      this.user.addresses = [];
    }
    const newAddress = {
      id: 'addr_' + Math.random().toString(36).substr(2, 9),
      ...addressData,
      createdAt: new Date().toISOString(),
    };
    this.user.addresses.push(newAddress);
    this.saveUser();
    Logger.info('Address added', { id: newAddress.id });
    return newAddress;
  }

  /**
   * Update address
   */
  updateAddress(addressId, addressData) {
    if (!this.user.addresses) return false;
    const index = this.user.addresses.findIndex(a => a.id === addressId);
    if (index > -1) {
      this.user.addresses[index] = { ...this.user.addresses[index], ...addressData };
      this.saveUser();
      Logger.info('Address updated', { id: addressId });
      return true;
    }
    return false;
  }

  /**
   * Delete address
   */
  deleteAddress(addressId) {
    if (!this.user.addresses) return false;
    this.user.addresses = this.user.addresses.filter(a => a.id !== addressId);
    this.saveUser();
    Logger.info('Address deleted', { id: addressId });
    return true;
  }

  /**
   * Get all addresses
   */
  getAddresses() {
    return this.user?.addresses || [];
  }

  /**
   * Add order to history
   */
  addOrder(orderData) {
    if (!this.user.orders) {
      this.user.orders = [];
    }
    const newOrder = {
      id: 'ord_' + Math.random().toString(36).substr(2, 9),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.user.orders.push(newOrder);
    this.saveUser();
    Logger.info('Order added', { id: newOrder.id });
    return newOrder;
  }

  /**
   * Get order history
   */
  getOrderHistory() {
    return this.user?.orders || [];
  }

  /**
   * Register new user
   */
  register(email, password, displayName) {
    if (!email || !password || !displayName) {
      Logger.error('Missing required fields');
      return false;
    }
    
    this.user = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      displayName,
      password: btoa(password), // Simple encoding (not production-safe)
      photoUrl: null,
      addresses: [],
      orders: [],
      createdAt: new Date().toISOString(),
    };
    
    this.saveUser();
    Logger.info('User registered', { email });
    Analytics.trackEvent('user_registered');
    return true;
  }

  /**
   * Login with email and password
   */
  login(email, password) {
    // In production, this would call a backend API
    // For now, we'll check if user exists and password matches
    const savedUser = Storage.get(CONFIG.user.storageKey);
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.email === email && user.password === btoa(password)) {
        this.user = user;
        Logger.info('User logged in', { email });
        Analytics.trackEvent('user_logged_in');
        return true;
      }
    }
    Logger.error('Invalid email or password');
    return false;
  }

  /**
   * Update profile
   */
  updateProfile(displayName, phoneNumber) {
    if (this.user) {
      this.user.displayName = displayName;
      this.user.phoneNumber = phoneNumber;
      this.saveUser();
      Logger.info('Profile updated');
      return true;
    }
    return false;
  }

  /**
   * Update user UI after state change
   */
  updateUserUI() {
    // This will be called after login/logout
  }

  /**
   * Refresh entire UI
   */
  refreshUI() {
    window.location.reload();
  }
}


// ============================================
// TABS MANAGEMENT
// ============================================

class TabManager {
  constructor() {
    this.currentTab = null;
    this.init();
  }

  /**
   * Initialize tabs
   */
  init() {
    // Set up tab button click handlers
    DOM.on('.tab-button', 'click', (e) => {
      const tabName = e.currentTarget.getAttribute('data-tab');
      this.switchTab(tabName);
    });
  }

  /**
   * Switch active tab
   */
  switchTab(tabName) {
    // Remove active class from all buttons and content
    DOM.selectAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });
    DOM.selectAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    // Add active class to clicked button and corresponding content
    const activeButton = DOM.select(`.tab-button[data-tab="${tabName}"]`);
    const activeContent = DOM.select(`#tab-${tabName}`);

    if (activeButton) {
      activeButton.classList.add('active');
    }
    if (activeContent) {
      activeContent.classList.add('active');
    }

    this.currentTab = tabName;
    Logger.info(`Switched to tab: ${tabName}`);
  }
}

// ============================================
// APPLICATION INITIALIZATION
// ============================================

class AppManager {
  constructor() {
    try {
      console.log('AppManager constructor starting...');
      this.modalManager = new ModalManager();
      console.log('✓ ModalManager created');
      
      this.preOrderManager = new PreOrderManager();
      console.log('✓ PreOrderManager created');
      
      this.supportManager = new SupportManager();
      console.log('✓ SupportManager created');
      
      this.paymentManager = new PaymentManager();
      console.log('✓ PaymentManager created');
      
      this.tabManager = new TabManager();
      console.log('✓ TabManager created');
      
      this.cartManager = new CartManager();
      console.log('✓ CartManager created');
      
      this.userManager = new UserManager();
      console.log('✓ UserManager created');

      // Set up manager references
      this.preOrderManager.setModalManager(this.modalManager);
      this.supportManager.setModalManager(this.modalManager);
      console.log('✓ Manager references set');

      this.init();
      console.log('✓ AppManager fully initialized');
    } catch (error) {
      console.error('❌ CRITICAL: Error in AppManager constructor:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  /**
   * Initialize application
   */
  init() {
    Logger.info('Application initialized');

    // Set up global functions for backward compatibility
    window.openPreOrder = (productId) => this.preOrderManager.openPreOrder(productId);
    window.closeModal = (modalId) => this.modalManager.closeModal(modalId);
    window.updateOrderSummary = () => this.preOrderManager.updateOrderSummary();
    window.submitPreOrder = () => this.preOrderManager.submitPreOrder();
    window.submitSupportRequest = () => this.supportManager.submitSupportRequest();
    window.switchTab = (tabName) => this.tabManager.switchTab(tabName);
    window.switchAuthTab = (tabName) => this.switchAuthTab(tabName);

    // Initialize lazy loading
    Performance.lazyLoadImages();

    Analytics.trackPageView(document.title);
  }

  /**
   * Switch auth tab
   */
  switchAuthTab(tabName) {
    DOM.selectAll('.auth-tab-btn').forEach(btn => btn.classList.remove('active'));
    DOM.selectAll('.auth-tab-content').forEach(content => content.classList.remove('active'));
    
    DOM.select(`.auth-tab-btn[data-tab="${tabName}"]`)?.classList.add('active');
    DOM.select(`#${tabName}-tab`)?.classList.add('active');
  }
}

// ============================================
// GLOBAL UTILITY FUNCTIONS
// ============================================

/**
 * Toggle FAQ item
 */
window.toggleFAQ = function(index) {
  const answer = DOM.select(`#faq-${index}`);
  const question = answer?.previousElementSibling;
  
  if (answer && question) {
    answer.classList.toggle('open');
    const toggle = question.querySelector('.faq-toggle');
    if (toggle) {
      toggle.textContent = answer.classList.contains('open') ? '−' : '+';
    }
  }
};

/**
 * Global function to handle sign in button click
 * Used as fallback if onclick attribute fails
 */
window.handleSignInClick = function() {
  const btn = document.getElementById('signInBtn');
  
  try {
    console.log('handleSignInClick called');
    console.log('window.appManager exists:', !!window.appManager);
    console.log('window.appManagerReady:', window.appManagerReady);
    
    // Check if AppManager exists
    if (!window.appManager) {
      console.warn('AppManager not initialized');
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'wait';
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '⏳ Initializing...';
        setTimeout(() => {
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
          btn.innerHTML = originalHTML;
        }, 3000);
      }
      console.log('Retrying in 3 seconds...');
      return;
    }
    
    if (!window.appManager.userManager) {
      console.error('UserManager not available');
      alert('Error: User manager not initialized. Please refresh the page.');
      return;
    }
    
    console.log('Calling openAuth...');
    // AppManager is ready, open auth
    window.appManager.userManager.openAuth();
    
  } catch (error) {
    console.error('❌ Error in handleSignInClick:', error);
    console.error('Stack trace:', error.stack);
    alert('Error: ' + error.message);
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    }
  }
};

// ============================================
// APP STARTUP
// ============================================

console.log('=== APP STARTUP SEQUENCE ===');
console.log('Step 1: Checking if DOM is already loaded...');

// Create AppManager immediately when script loads
try {
  console.log('Step 2: Creating AppManager...');
  window.appManager = new AppManager();
  console.log('✓ AppManager created and available globally');
  window.appManagerReady = true;
} catch (error) {
  console.error('❌ CRITICAL: Failed to create AppManager:', error);
  window.appManagerReady = false;
  // Try to show error to user
  setTimeout(() => {
    alert('Critical error: Application failed to initialize. Please refresh the page.');
  }, 1000);
}

// Setup UI when DOM is ready
function setupAppUI() {
  try {
    console.log('Step 3: Setting up UI...');
    if (window.appManager && window.appManager.userManager) {
      window.appManager.userManager.setupAuthUI();
      console.log('✓ setupAuthUI completed');
    } else {
      console.error('AppManager or UserManager not available for UI setup');
    }
  } catch (error) {
    console.error('Error in setupAppUI:', error);
  }
}

// Wait for DOM to be ready
console.log('Step 2b: Checking document.readyState:', document.readyState);
if (document.readyState === 'loading') {
  console.log('DOM still loading, attaching DOMContentLoaded listener');
  document.addEventListener('DOMContentLoaded', setupAppUI);
} else {
  // DOM is already loaded
  console.log('DOM already loaded, running setupAppUI immediately');
  setupAppUI();
}
