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

    if (!saved) {
      this.items = [];
    } else if (Array.isArray(saved)) {
      // New format: Storage.get already returns parsed array
      this.items = saved;
    } else {
      // Backwards compatibility: old format stored JSON string inside JSON
      try {
        this.items = JSON.parse(saved);
      } catch (error) {
        Logger.error('Failed to parse saved cart data', error);
        this.items = [];
      }
    }

    this.updateCartIcon();
  }

  /**
   * Save cart to local storage
   */
  saveCart() {
    // Store as plain array; Storage helper will JSON.stringify
    Storage.set(CONFIG.cart.storageKey, this.items);
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
    try {
      // Validate cart
      const validation = CartServiceBackend.validateCart(this.items);
      if (!validation.valid) {
        alert('Cart validation failed: ' + validation.error);
        return;
      }

      // Calculate totals
      const subtotal = this.getTotal();
      const shippingAddress = {
        country: 'US', // Default, will be updated in checkout form
        state: 'NY',
      };
      const shipping = CartServiceBackend.calculateShipping(shippingAddress, this.items);
      const tax = CartServiceBackend.calculateTax(subtotal, shippingAddress);
      const total = subtotal + shipping + tax;

      const totals = {
        subtotal,
        shipping,
        tax,
        total,
      };

      // Remove any existing checkout modal
      const existingModal = document.getElementById('checkoutModal');
      if (existingModal) {
        existingModal.remove();
      }

      // Show checkout modal
      const modal = document.createElement('div');
      modal.id = 'checkoutModal';
      modal.className = 'modal show';
      modal.innerHTML = `
        <div class="modal-content checkout-modal">
          <div class="modal-header">
            <h2>Checkout</h2>
            <button class="close-modal" onclick="window.appManager.modalManager.closeModal('checkoutModal')">&times;</button>
          </div>
          <div class="modal-body">
            ${Templates.checkout(this.items, totals)}
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      window.appManager.modalManager.openModal('checkoutModal');

      // Store checkout data
      window.checkoutData = {
        items: this.items,
        subtotal,
        shipping,
        tax,
        total,
      };

      console.log('✓ Checkout modal created with Razorpay pre-selected');
      Logger.info('Checkout flow started', { items: this.items.length, total });
    } catch (error) {
      Logger.error('Error showing checkout flow', error);
      alert('Error processing checkout: ' + error.message);
    }
  }

  /**
   * Process checkout (place order)
   */
  processCheckout() {
    try {
      const user = window.appManager.userManager.user;
      
      // Get form data
      const shipName = document.getElementById('shipName').value;
      const shipLine1 = document.getElementById('shipLine1').value;
      const shipLine2 = document.getElementById('shipLine2').value;
      const shipCity = document.getElementById('shipCity').value;
      const shipState = document.getElementById('shipState').value;
      const shipZip = document.getElementById('shipZip').value;
      const shipCountry = document.getElementById('shipCountry').value;
      
      // Get payment method with proper validation
      const paymentRadio = document.querySelector('input[name="payment"]:checked');
      if (!paymentRadio) {
        alert('Please select a payment method');
        return;
      }
      const paymentMethod = paymentRadio.value;
      console.log('Selected payment method:', paymentMethod);

      // Validate form
      if (!shipName || !shipLine1 || !shipCity || !shipState || !shipZip) {
        alert('Please fill in all required address fields');
        return;
      }

      // Validate payment method
      if (!paymentMethod || (paymentMethod !== 'razorpay' && paymentMethod !== 'upi-manual')) {
        alert('Please select a valid payment method (Razorpay or Google Pay Send)');
        return;
      }

      const shippingAddress = {
        name: shipName,
        line1: shipLine1,
        line2: shipLine2,
        city: shipCity,
        state: shipState,
        zip: shipZip,
        country: shipCountry,
      };

      // Re-calculate with actual country
      const checkout = window.checkoutData;
      const shipping = CartServiceBackend.calculateShipping(shippingAddress, checkout.items);
      const tax = CartServiceBackend.calculateTax(checkout.subtotal, shippingAddress);
      const total = checkout.subtotal + shipping + tax;

      // Reserve inventory
      if (InventoryService && InventoryService.reserveInventory) {
        InventoryService.reserveInventory('temp-' + Date.now(), checkout.items);
      }

      // Create order
      const order = OrderService.createOrder(user.id, {
        items: checkout.items,
        subtotal: checkout.subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod,
      });

      // Handle different payment methods
      if (paymentMethod === 'razorpay') {
        this.handleRazorpayPayment(order, user, total, shippingAddress);
      } else if (paymentMethod === 'upi-manual') {
        this.handleGooglePaySend(order, user, total, shippingAddress);
      }

    } catch (error) {
      Logger.error('Error processing checkout', error);
      alert('Error placing order: ' + error.message);
    }
  }

  /**
   * Handle Razorpay payment
   */
  handleRazorpayPayment(order, user, total, shippingAddress) {
    try {
      // Check if Razorpay script is loaded
      if (typeof Razorpay === 'undefined') {
        throw new Error('Razorpay payment gateway not loaded. Please refresh the page.');
      }

      console.log('Initiating Razorpay payment for order:', order.id);
      
      RazorpayPayment.initPayment({
        orderId: order.id,
        amount: total,
        customerName: shippingAddress.name || 'Customer',
        customerEmail: user.email || 'user@example.com',
        customerPhone: user.phone || '9999999999',
        onSuccess: (response) => {
          console.log('✓ Payment successful:', response);
          this.completeOrder(order, user, total, 'razorpay', response);
        },
        onError: (error) => {
          console.error('❌ Payment failed:', error);
          alert('Payment failed. Please try again or use Google Pay Send.');
          if (OrderService && OrderService.updateOrderStatus) {
            OrderService.updateOrderStatus(order.id, 'failed');
          }
        }
      });

    } catch (error) {
      Logger.error('Razorpay payment error', error);
      alert('Error initiating payment: ' + error.message);
    }
  }

  /**
   * Handle Google Pay Send (manual UPI)
   */
  handleGooglePaySend(order, user, total, shippingAddress) {
    try {
      console.log('Initiating Google Pay Send UPI payment for order:', order.id);
      
      const upiRecipientId = document.getElementById('upiRecipientInput')?.value || 'merchant@okaxis';
      
      const upiModalHTML = `
        <div id="upiPaymentModal" class="modal">
          <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
              <h2>Complete UPI Payment</h2>
              <button class="close-modal" onclick="window.appManager.modalManager.closeModal('upiPaymentModal')">&times;</button>
            </div>
            <div class="modal-body" style="padding: 2rem;">
              <div class="upi-payment-modal">
                <div class="upi-payment-header">
                  <h3>Complete Payment via UPI</h3>
                  <p class="order-amount">₹${total.toFixed(2)}</p>
                </div>
                <div class="upi-payment-content">
                  <div class="upi-manual-section">
                    <p class="upi-instruction">Send ₹${total.toFixed(2)} to UPI ID:</p>
                    <div class="upi-id-display">
                      <input type="text" value="${upiRecipientId}" readonly class="upi-id-input">
                      <button class="upi-copy-btn" onclick="navigator.clipboard.writeText('${upiRecipientId}');alert('UPI ID copied!')">Copy</button>
                    </div>
                    <p class="upi-note"><strong>Reference:</strong> ${order.id}</p>
                  </div>
                  <div class="upi-steps">
                    <h4>Steps:</h4>
                    <ol>
                      <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                      <li>Enter the UPI ID above</li>
                      <li>Enter amount: ₹${total.toFixed(2)}</li>
                      <li>Complete the payment</li>
                      <li>Click "Confirm Payment" below</li>
                    </ol>
                  </div>
                </div>
                <div class="upi-payment-actions">
                  <button class="upi-confirm-btn" onclick="alert('Payment confirmed. Order will be processed within 2-3 minutes');">✓ Confirm Payment Sent</button>
                  <button class="upi-cancel-btn" onclick="window.appManager.modalManager.closeModal('upiPaymentModal')">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', upiModalHTML);
      window.appManager.modalManager.openModal('upiPaymentModal');

      // After user confirms, complete the order
      setTimeout(() => {
        this.completeOrder(order, user, total, 'google-pay-send', { orderId: order.id });
      }, 2000);

    } catch (error) {
      Logger.error('Google Pay Send error', error);
      alert('Error with UPI payment: ' + error.message);
    }
  }

  /**
   * Complete order after successful payment
   */
  completeOrder(order, user, total, paymentMethod, paymentData) {
    try {
      // Update order status
      OrderService.updateOrderStatus(order.id, 'processing');

      // Send confirmation
      NotificationService.sendOrderConfirmation(order, user.email);

      // Clear cart
      this.items = [];
      this.saveCart();

      // Close checkout modal
      window.appManager.modalManager.closeModal('checkoutModal');
      if (document.getElementById('upiPaymentModal')) {
        window.appManager.modalManager.closeModal('upiPaymentModal');
      }
      
      alert(`✓ Order placed successfully!\n\nOrder ID: ${order.id}\nTotal: ${Format.currency(total)}\n\nYou will receive a confirmation email shortly.`);

      Logger.info('Order completed', { orderId: order.id, amount: total, paymentMethod });
      Analytics.trackEvent('order_completed', { orderId: order.id, amount: total, paymentMethod });

      // Redirect to dashboard
      if (window.appManager.dashboardManager) {
        setTimeout(() => {
          window.appManager.dashboardManager.openDashboard(user);
        }, 1000);
      }

    } catch (error) {
      Logger.error('Error completing order', error);
      alert('Error finalizing order: ' + error.message);
    }
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
// DASHBOARD MANAGEMENT
// ============================================

class DashboardManager {
  constructor() {
    this.currentUser = null;
  }

  /**
   * Open user dashboard
   */
  openDashboard(user) {
    try {
      if (!user) {
        alert('Please sign in to view your dashboard');
        return;
      }

      this.currentUser = user;
      const modal = DOM.select('#dashboardModal');
      
      if (!modal) {
        const dashboardModal = `
          <div id="dashboardModal" class="modal">
            <div class="modal-content dashboard-modal">
              <div class="modal-header">
                <h2>Dashboard</h2>
                <button class="close-modal" onclick="window.appManager.modalManager.closeModal('dashboardModal')">&times;</button>
              </div>
              <div class="modal-body">
                ${Templates.dashboard(user)}
              </div>
            </div>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dashboardModal);
      }

      window.appManager.modalManager.openModal('dashboardModal');
      this.updateDashboard(user);
    } catch (error) {
      Logger.error('Error opening dashboard', error);
      alert('Error opening dashboard');
    }
  }

  /**
   * Update dashboard data
   */
  updateDashboard(user) {
    try {
      const orders = OrderService.getUserOrders(user.id);
      const recentOrders = orders.slice(-3).reverse();
      
      // Calculate stats
      const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
      const pendingOrders = orders.filter(order => ['pending', 'processing'].includes(order.status)).length;

      // Update stats
      document.getElementById('totalOrders').textContent = orders.length;
      document.getElementById('totalSpent').textContent = Format.currency(totalSpent);
      document.getElementById('pendingOrders').textContent = pendingOrders;

      // Update recent orders
      const recentOrdersList = document.getElementById('recentOrdersList');
      if (recentOrdersList) {
        if (recentOrders.length > 0) {
          recentOrdersList.innerHTML = recentOrders.map(order => Templates.orderItem(order)).join('');
        } else {
          recentOrdersList.innerHTML = '<p class="empty-message">No orders yet. Start shopping!</p>';
        }
      }

      Logger.info('Dashboard updated', { orders: orders.length });
    } catch (error) {
      Logger.error('Error updating dashboard', error);
    }
  }
}

// ============================================
// USER MANAGEMENT
// ============================================

class UserManager {
  constructor() {
    this.user = null;
    this.authUnsubscribe = null;
    this.init();
  }

  /**
   * Initialize user manager
   */
  init() {
    // Subscribe to real auth state if available
    if (window.AuthService && AuthService.onAuthStateChanged) {
      this.authUnsubscribe = AuthService.onAuthStateChanged((firebaseUser) => {
        this.handleAuthChange(firebaseUser);
      });
    } else {
      // Fallback to legacy local user if AuthService not configured
      this.loadUser();
      this.setupAuthUI();
    }
  }

  /**
   * Handle Firebase auth state changes
   */
  handleAuthChange(firebaseUser) {
    if (firebaseUser) {
      // Map Firebase user to local user object
      const previous = this.user || {};
      this.user = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        photoUrl: firebaseUser.photoURL,
        phoneNumber: firebaseUser.phoneNumber || '',
        createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
        // Preserve any already-loaded extended data in memory
        addresses: previous.addresses || [],
        orders: previous.orders || [],
      };

      // Load extended profile and orders/addresses from Firestore
      if (window.DbService) {
        DbService.getUserProfile(firebaseUser.uid)
          .then((profile) => {
            if (profile) {
              this.user = {
                ...this.user,
                phoneNumber: profile.phoneNumber || this.user.phoneNumber,
                addresses: profile.addresses || this.user.addresses || [],
                orders: profile.orders || this.user.orders || [],
              };
            }
            // Persist snapshot locally for faster dashboard rendering
            this.saveUser();
          })
          .catch((error) => {
            console.error('Failed to load user profile from Firestore', error);
          });
      } else {
        // Persist extended profile (local-only) if DbService is unavailable
        this.saveUser();
      }

      Logger.info('Auth state: logged in', { email: this.user.email });
      Analytics.trackEvent('user_signed_in');
    } else {
      Logger.info('Auth state: logged out');
      this.user = null;
      Storage.remove(CONFIG.user.storageKey);
    }

    // Update header widget & dashboard
    this.setupAuthUI();
    try {
      // Re-render user account dashboard if renderer exists
      if (typeof renderUserAccount === 'function') {
        renderUserAccount();
      }
    } catch (e) {
      // Ignore render errors here
    }
  }

  /**
   * Load extended user profile from local storage (non-auth data)
   */
  loadUser() {
    const saved = Storage.get(CONFIG.user.storageKey);

    if (!saved) {
      this.user = null;
    } else if (typeof saved === 'string') {
      // Backwards compatibility: old format stored JSON string inside JSON
      try {
        this.user = JSON.parse(saved);
      } catch (error) {
        Logger.error('Failed to parse saved user data', error);
        this.user = null;
      }
    } else {
      // New format: Storage.get already returns parsed object
      this.user = saved;
    }

    this.updateUserUI();
  }

  /**
   * Save extended user profile to local storage (non-auth data)
   */
  saveUser() {
    if (!this.user) return;
    const snapshot = {
      uid: this.user.uid,
      email: this.user.email,
      displayName: this.user.displayName,
      photoUrl: this.user.photoUrl,
      phoneNumber: this.user.phoneNumber || '',
      addresses: this.user.addresses || [],
      orders: this.user.orders || [],
      createdAt: this.user.createdAt,
    };

    // Store as plain object locally; Storage helper will JSON.stringify
    Storage.set(CONFIG.user.storageKey, snapshot);

    // Mirror profile into Firestore when available (addresses/orders have
    // their own subcollections but we keep a summary copy here for quick reads)
    if (window.DbService && this.user.uid) {
      DbService.saveUserProfile(this.user.uid, snapshot).catch((error) => {
        console.error('Failed to save user profile to Firestore', error);
      });
    }

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
      // Show enhanced user menu widget in header
      const userMenuHTML = `
        <div class="user-widget-wrapper">
          <!-- User Profile Button -->
          <button class="user-widget-button" onclick="window.appManager.userManager.toggleUserMenu()" title="User Menu">
            <div class="user-avatar">
              ${this.user.photoUrl ? `<img src="${this.user.photoUrl}" alt="${this.user.displayName}" class="avatar-img">` : '<span class="avatar-initials">👤</span>'}
            </div>
            <div class="user-info-compact">
              <span class="user-name-compact">${this.user.displayName?.split(' ')[0] || 'User'}</span>
              <span class="user-dropdown-arrow">▼</span>
            </div>
          </button>
          
          <!-- Dropdown Menu -->
          <div id="userMenuDropdown" class="user-menu-dropdown" style="display: none;">
            <!-- Profile Section -->
            <div class="menu-section">
              <div class="menu-header-profile">
                <div class="menu-avatar">
                  ${this.user.photoUrl ? `<img src="${this.user.photoUrl}" alt="${this.user.displayName}">` : '<span class="avatar-large">👤</span>'}
                </div>
                <div class="menu-user-info">
                  <p class="menu-name">${this.user.displayName || 'User'}</p>
                  <p class="menu-email">${this.user.email}</p>
                </div>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="menu-section">
              <a href="#" class="menu-item" onclick="window.appManager.userManager.openProfile(event)">
                <span class="menu-icon">👤</span>
                <span class="menu-label">My Profile</span>
              </a>
              <a href="#" class="menu-item" onclick="window.appManager.dashboardManager.openDashboard(window.appManager.userManager.user)">
                <span class="menu-icon">📊</span>
                <span class="menu-label">Dashboard</span>
              </a>
              <a href="#" class="menu-item" onclick="window.appManager.userManager.openOrders(event)">
                <span class="menu-icon">📦</span>
                <span class="menu-label">My Orders</span>
              </a>
            </div>
            
            <!-- Settings Section -->
            <div class="menu-section">
              <a href="#" class="menu-item" onclick="window.appManager.userManager.openSettings(event)">
                <span class="menu-icon">📍</span>
                <span class="menu-label">Addresses</span>
              </a>
              <a href="#" class="menu-item">
                <span class="menu-icon">⚙️</span>
                <span class="menu-label">Preferences</span>
              </a>
            </div>
            
            <!-- Account Section -->
            <div class="menu-section">
              <a href="#" class="menu-item menu-item-danger" onclick="window.appManager.userManager.logout()">
                <span class="menu-icon">🚪</span>
                <span class="menu-label">Sign Out</span>
              </a>
            </div>
          </div>
        </div>
      `;
      userWidget.innerHTML = userMenuHTML;
      
      // Setup click-outside-to-close handler
      this.setupMenuClickHandler();
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
   * Setup click-outside handler for user menu
   */
  setupMenuClickHandler() {
    // Remove existing listeners to avoid duplicates
    if (this.menuClickListener) {
      document.removeEventListener('click', this.menuClickListener);
    }

    this.menuClickListener = (event) => {
      const wrapper = DOM.select('.user-widget-wrapper');
      const dropdown = DOM.select('#userMenuDropdown');
      
      if (!wrapper || !dropdown) return;
      
      // If click is outside the wrapper, close the menu
      if (!wrapper.contains(event.target)) {
        dropdown.style.display = 'none';
        const button = wrapper.querySelector('.user-widget-button');
        if (button) {
          button.setAttribute('aria-expanded', 'false');
        }
      }
    };

    document.addEventListener('click', this.menuClickListener);
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
    if (!window.AuthService) {
      alert('Authentication service is not configured. Please contact support.');
      Logger.error('AuthService not available for Google sign in');
      return;
    }

    AuthService.signInWithGoogle()
      .then(() => {
        window.appManager.modalManager.closeModal('authModal');
      })
      .catch((error) => {
        console.error('Google sign-in failed', error);
        alert('Google sign-in failed: ' + error.message);
      });
  }

  /**
   * Sign up with Google
   */
  signUpWithGoogle() {
    this.signInWithGoogle();
  }

  /**
   * Logout
   */
  logout(event) {
    if (event) event.preventDefault();
    
    // Close menu before logout
    this.closeMenu();
    
    if (window.AuthService && AuthService.signOut) {
      AuthService.signOut()
        .then(() => {
          this.user = null;
          Storage.remove(CONFIG.user.storageKey);
          Logger.info('User logged out');
          Analytics.trackEvent('user_logged_out');
          alert('You have been signed out');
        })
        .catch((error) => {
          console.error('Error signing out', error);
          alert('Error signing out: ' + error.message);
        });
    } else {
      // Fallback logout if AuthService is unavailable
      this.user = null;
      Storage.remove(CONFIG.user.storageKey);
      Logger.info('User logged out (legacy mode)');
      Analytics.trackEvent('user_logged_out');
      alert('You have been signed out');
      this.refreshUI();
    }
  }

  /**
   * Toggle user menu
   */
  toggleUserMenu() {
    const dropdown = DOM.select('#userMenuDropdown');
    const button = DOM.select('.user-widget-button');
    
    if (dropdown) {
      const isHidden = dropdown.style.display === 'none';
      dropdown.style.display = isHidden ? 'block' : 'none';
      
      // Update aria-expanded for accessibility
      if (button) {
        button.setAttribute('aria-expanded', isHidden);
      }
    }
  }

  /**
   * Open user profile page
   */
  openProfile(event) {
    if (event) event.preventDefault();
    this.closeMenu();
    window.appManager.modalManager.openModal('profileModal') || this.showProfilePage();
  }

  /**
   * Open user orders page
   */
  openOrders(event) {
    if (event) event.preventDefault();
    this.closeMenu();
    window.appManager.modalManager.openModal('ordersModal') || this.showOrdersPage();
  }

  /**
   * Open settings/addresses page
   */
  openSettings(event) {
    if (event) event.preventDefault();
    this.closeMenu();
    window.appManager.modalManager.openModal('addressModal') || this.showAddressPage();
  }

  /**
   * Close the user menu
   */
  closeMenu() {
    const dropdown = DOM.select('#userMenuDropdown');
    const button = DOM.select('.user-widget-button');
    
    if (dropdown) {
      dropdown.style.display = 'none';
      if (button) {
        button.setAttribute('aria-expanded', 'false');
      }
    }
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
    const render = (addresses) => {
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
    };

    // If Firestore is available, prefer live data
    if (window.DbService && this.user?.uid) {
      DbService.getAddresses(this.user.uid)
        .then((addresses) => {
          this.user.addresses = addresses;
          this.saveUser();
          render(addresses);
        })
        .catch((error) => {
          console.error('Failed to load addresses from Firestore', error);
          render(this.getAddresses());
        });
    } else {
      render(this.getAddresses());
    }
  }

  /**
   * Add new address
   */
  addAddress(addressData) {
    if (!this.user || !this.user.uid) {
      alert('You must be signed in to manage addresses.');
      return null;
    }

    const localAdd = (addr) => {
      if (!this.user.addresses) this.user.addresses = [];
      this.user.addresses.push(addr);
      this.saveUser();
      Logger.info('Address added', { id: addr.id });
      return addr;
    };

    // Persist to Firestore when available
    if (window.DbService) {
      return DbService.addAddress(this.user.uid, addressData)
        .then((addr) => localAdd(addr))
        .catch((error) => {
          console.error('Failed to add address to Firestore', error);
          const fallback = {
            id: 'addr_' + Math.random().toString(36).substr(2, 9),
            ...addressData,
            createdAt: new Date().toISOString(),
          };
          return localAdd(fallback);
        });
    }

    const fallback = {
      id: 'addr_' + Math.random().toString(36).substr(2, 9),
      ...addressData,
      createdAt: new Date().toISOString(),
    };
    return localAdd(fallback);
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

    const finish = () => {
      this.saveUser();
      Logger.info('Address deleted', { id: addressId });
      return true;
    };

    if (window.DbService && this.user?.uid) {
      return DbService.deleteAddress(this.user.uid, addressId)
        .then(finish)
        .catch((error) => {
          console.error('Failed to delete address from Firestore', error);
          return finish();
        });
    }

    return finish();
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
    if (!this.user || !this.user.uid) {
      alert('You must be signed in to place orders.');
      return null;
    }

    const localAdd = (ord) => {
      if (!this.user.orders) this.user.orders = [];
      this.user.orders.unshift(ord);
      this.saveUser();
      Logger.info('Order added', { id: ord.id });
      return ord;
    };

    if (window.DbService) {
      return DbService.addOrder(this.user.uid, orderData)
        .then((ord) => localAdd(ord))
        .catch((error) => {
          console.error('Failed to add order to Firestore', error);
          const fallback = {
            id: 'ord_' + Math.random().toString(36).substr(2, 9),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
          };
          return localAdd(fallback);
        });
    }

    const fallback = {
      id: 'ord_' + Math.random().toString(36).substr(2, 9),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    return localAdd(fallback);
  }

  /**
   * Get order history
   */
  getOrderHistory() {
    return this.user?.orders || [];
  }

  /**
   * Register new user (email/password via Firebase Auth)
   */
  register(email, password, displayName) {
    if (!email || !password || !displayName) {
      Logger.error('Missing required fields for registration');
      return false;
    }

    if (!window.AuthService) {
      alert('Authentication service is not configured. Please contact support.');
      Logger.error('AuthService not available for email registration');
      return false;
    }

    return AuthService.signUpWithEmail(displayName, email, password)
      .then((result) => {
        const firebaseUser = result.user;
        this.user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || displayName,
          photoUrl: firebaseUser.photoURL,
          addresses: [],
          orders: [],
          createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
        };
        this.saveUser();
        Logger.info('User registered', { email });
        Analytics.trackEvent('user_registered');
        return true;
      })
      .catch((error) => {
        console.error('Registration failed', error);
        alert('Registration failed: ' + error.message);
        return false;
      });
  }

  /**
   * Login with email and password (Firebase Auth)
   */
  login(email, password) {
    if (!email || !password) {
      Logger.error('Missing login credentials');
      return false;
    }

    if (!window.AuthService) {
      alert('Authentication service is not configured. Please contact support.');
      Logger.error('AuthService not available for email login');
      return false;
    }

    return AuthService.signInWithEmail(email, password)
      .then((result) => {
        const firebaseUser = result.user;
        this.user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoUrl: firebaseUser.photoURL,
          ...(this.user || {}),
        };
        this.saveUser();
        Logger.info('User logged in', { email });
        Analytics.trackEvent('user_logged_in');
        return true;
      })
      .catch((error) => {
        console.error('Login failed', error);
        alert('Login failed: ' + error.message);
        return false;
      });
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
   * View order details
   */
  viewOrderDetails(orderId) {
    try {
      const order = OrderService.getOrder(orderId);
      if (!order) {
        alert('Order not found');
        return;
      }

      const modal = document.createElement('div');
      modal.id = 'orderDetailsModal';
      modal.className = 'modal show';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>Order Details</h2>
            <button class="close-modal" onclick="document.getElementById('orderDetailsModal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            ${Templates.orderDetails(order)}
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      Logger.info('Order details viewed', { orderId });
    } catch (error) {
      Logger.error('Error viewing order details', error);
      alert('Error viewing order details');
    }
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId) {
    try {
      if (confirm('Are you sure you want to cancel this order?')) {
        const order = OrderService.cancelOrder(orderId);
        if (order) {
          alert('Order cancelled successfully');
          this.showOrdersPage();
        }
      }
    } catch (error) {
      Logger.error('Error cancelling order', error);
      alert('Error cancelling order');
    }
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

      this.dashboardManager = new DashboardManager();
      console.log('✓ DashboardManager created');

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
console.log('document.readyState:', document.readyState);

// Create AppManager immediately when script loads
try {
  console.log('Step 2: Creating AppManager...');
  window.appManager = new AppManager();
  console.log('✓ AppManager created and available globally');
  window.appManagerReady = true;
} catch (error) {
  console.error('❌ CRITICAL: Failed to create AppManager:', error);
  console.error('Stack:', error.stack);
  window.appManagerReady = false;
  // Try to show error to user
  setTimeout(() => {
    alert('Critical error: Application failed to initialize. Please refresh the page.\n\nError: ' + error.message);
  }, 1000);
}

// Setup UI when DOM is ready
function setupAppUI() {
  try {
    console.log('Step 3: Setting up UI...');
    if (window.appManager) {
      console.log('  - AppManager exists');
      if (window.appManager.userManager) {
        console.log('  - UserManager exists');
        console.log('  - Calling setupAuthUI()...');
        window.appManager.userManager.setupAuthUI();
        console.log('✓ setupAuthUI completed');
      } else {
        console.error('  - ERROR: UserManager not available');
      }
    } else {
      console.error('  - ERROR: AppManager not available');
    }
  } catch (error) {
    console.error('Error in setupAppUI:', error);
    console.error('Stack:', error.stack);
  }
}

// Wait for DOM to be ready
console.log('Step 2b: Checking document.readyState:', document.readyState);
if (document.readyState === 'loading') {
  console.log('DOM still loading, attaching DOMContentLoaded listener');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    setupAppUI();
  });
} else {
  // DOM is already loaded
  console.log('DOM already loaded, running setupAppUI immediately');
  // Add small delay to ensure scripts are truly loaded
  setTimeout(setupAppUI, 100);
}

console.log('=== APP.JS SCRIPT EXECUTION COMPLETE ===');
