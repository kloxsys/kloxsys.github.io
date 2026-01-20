/**
 * KLOX SYSTEMS - INITIALIZATION & DYNAMIC RENDERING
 * Renders dynamic content on page load using CONFIG and Templates
 */

/**
 * Initialize page with dynamic content
 */
function initializePage() {
  // Render Navigation
  renderNavigation();

  // Render Hero Section
  renderHeroSection();

  // Render Features
  renderFeatures();

  // Render Products
  renderProducts();

  // Render About Section
  renderAboutSection();

  // Render Payment Options
  renderPaymentOptions();

  // Render Footer
  renderFooter();

  // Set up form handlers
  setupFormHandlers();

  Logger.info('Page initialization complete');
}

/**
 * Render navigation links
 */
function renderNavigation() {
  const navLinks = DOM.select('#navLinks');
  if (!navLinks) return;

  navLinks.innerHTML = CONFIG.navigation
    .map(item => Templates.navLink(item))
    .join('');
}

/**
 * Render hero section
 */
function renderHeroSection() {
  const heroTitle = DOM.select('#heroTitle');
  const heroSubtitle = DOM.select('#heroSubtitle');

  if (heroTitle) heroTitle.textContent = CONFIG.hero.title;
  if (heroSubtitle) heroSubtitle.textContent = CONFIG.hero.subtitle;
}

/**
 * Render features
 */
function renderFeatures() {
  const featuresSection = DOM.select('#features');
  if (!featuresSection) return;

  featuresSection.innerHTML = CONFIG.features
    .map(feature => Templates.featureCard(feature))
    .join('');
}

/**
 * Render products
 */
function renderProducts() {
  const productGrid = DOM.select('#productGrid');
  if (!productGrid) return;

  productGrid.innerHTML = CONFIG.products
    .map(product => Templates.productCard(product))
    .join('');
}

/**
 * Render about section
 */
function renderAboutSection() {
  const aboutTitle = DOM.select('#aboutTitle');
  const aboutContent = DOM.select('#aboutContent');

  if (aboutTitle) aboutTitle.textContent = CONFIG.about.title;

  if (aboutContent) {
    aboutContent.innerHTML = CONFIG.about.paragraphs
      .map(para => `<p>${para}</p>`)
      .join('');
  }
}

/**
 * Render payment options in modal
 */
function renderPaymentOptions() {
  const paymentOptions = DOM.select('#paymentOptions');
  if (!paymentOptions) return;

  paymentOptions.innerHTML = CONFIG.paymentMethods
    .map((method, index) => Templates.paymentOption(method, index === 0))
    .join('');
}

/**
 * Render footer
 */
function renderFooter() {
  const footerContent = DOM.select('#footerContent');
  const footerCopyright = DOM.select('#footerCopyright');

  if (footerContent) {
    footerContent.innerHTML = CONFIG.footer.sections
      .map(section => Templates.footerSection(section))
      .join('');
  }

  if (footerCopyright) {
    footerCopyright.textContent = CONFIG.footer.copyright;
  }
}

/**
 * Setup form event handlers
 */
function setupFormHandlers() {
  // Pre-order form submit
  const preOrderForm = DOM.select('#preOrderForm');
  if (preOrderForm) {
    preOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.appManager.preOrderManager.submitPreOrder();
    });
  }

  // Support form submit
  const supportForm = DOM.select('#supportForm');
  if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.appManager.supportManager.submitSupportRequest();
    });
  }

  // Quantity change
  const orderQuantity = DOM.select('#orderQuantity');
  if (orderQuantity) {
    orderQuantity.addEventListener('change', updateOrderSummary);
  }
}

/**
 * Global wrapper for opening pre-order modal with product ID
 */
window.openPreOrder = function (productId) {
  if (window.appManager && window.appManager.preOrderManager) {
    window.appManager.preOrderManager.openPreOrder(productId);
  }
};

/**
 * Global wrapper for closing modals
 */
window.closeModal = function (modalId) {
  if (window.appManager && window.appManager.modalManager) {
    window.appManager.modalManager.closeModal(modalId);
  }
};

/**
 * Global wrapper for updating order summary
 */
window.updateOrderSummary = function () {
  if (window.appManager && window.appManager.preOrderManager) {
    window.appManager.preOrderManager.updateOrderSummary();
  }
};

/**
 * Global wrapper for form submission
 */
window.submitPreOrder = function (event) {
  if (event) event.preventDefault();
  if (window.appManager && window.appManager.preOrderManager) {
    window.appManager.preOrderManager.submitPreOrder();
  }
};

/**
 * Global wrapper for support form submission
 */
window.submitSupportRequest = function (event) {
  if (event) event.preventDefault();
  if (window.appManager && window.appManager.supportManager) {
    window.appManager.supportManager.submitSupportRequest();
  }
};

/**
 * Handle footer link clicks
 */
window.handleFooterLink = function (link) {
  if (!link) return;

  if (link.action === 'scrollTo') {
    const element = DOM.select(link.target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else if (link.action === 'openModal') {
    if (window.appManager && window.appManager.modalManager) {
      window.appManager.modalManager.openModal(link.target);
    }
  } else if (link.action === 'link') {
    window.location.href = link.target;
  }
};

// ============================================
// INITIALIZATION ON PAGE LOAD
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  // DOM is already loaded
  setTimeout(initializePage, 100); // Give app.js time to initialize
}
