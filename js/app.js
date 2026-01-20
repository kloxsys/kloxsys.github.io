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
      DOM.addClass(modal, 'active');
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
      DOM.removeClass(modal, 'active');
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
// NAVIGATION
// ============================================

class NavigationManager {
  constructor() {
    this.init();
  }

  /**
   * Initialize navigation
   */
  init() {
    // Smooth scroll on link click
    DOM.on('a[href^="#"]', 'click', (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href === '#contact') {
        // Open support modal instead
        e.preventDefault();
        window.appManager.modalManager.openModal('supportModal');
      }
    });
  }
}

// ============================================
// APPLICATION INITIALIZATION
// ============================================

class AppManager {
  constructor() {
    this.modalManager = new ModalManager();
    this.preOrderManager = new PreOrderManager();
    this.supportManager = new SupportManager();
    this.paymentManager = new PaymentManager();
    this.navigationManager = new NavigationManager();

    // Set up manager references
    this.preOrderManager.setModalManager(this.modalManager);
    this.supportManager.setModalManager(this.modalManager);

    this.init();
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

    // Initialize lazy loading
    Performance.lazyLoadImages();

    Analytics.trackPageView(document.title);
  }
}

// ============================================
// APP STARTUP
// ============================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.appManager = new AppManager();
  });
} else {
  window.appManager = new AppManager();
}
