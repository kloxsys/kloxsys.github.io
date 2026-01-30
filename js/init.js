/**
 * KLOX SYSTEMS - INITIALIZATION & DYNAMIC RENDERING
 * Renders dynamic content on page load with smooth interactions
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

  // Render Management
  renderManagement();

  // Render Vision
  renderVision();

  // Render Services
  renderServices();

  // Render Hardware Services
  renderHardwareServices();

  // Render Firmware Services
  renderFirmwareServices();

  // Render Software Services
  renderSoftwareServices();

  // Render Help Center
  renderHelpCenter();

  // Render Knowledge Base
  renderKnowledgeBase();

  // Render Store
  renderStore();

  // Render Payment Options
  renderPaymentOptions();

  // Render Footer
  renderFooter();

  // Set up form handlers
  setupFormHandlers();

  // Setup smooth scroll interactions
  setupSmoothScrolling();

  // Setup navigation dropdowns
  setupNavigationDropdowns();

  Logger.info('Page initialization complete');
}

/**
 * Setup smooth scrolling for navigation
 */
function setupSmoothScrolling() {
  DOM.on('a[href^="#"]', 'click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#contact') return; // Support modal handled by nav manager
    
    const targetId = href.substring(1);
    const target = DOM.select(`#${targetId}`);
    
    if (target && targetId !== 'contact') {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/**
 * Setup navigation dropdown interactions
 */
function setupNavigationDropdowns() {
  // Handle click events on parent navigation items
  DOM.on('.nav-parent-link', 'click', function(e) {
    const parentItem = this.closest('.nav-item-parent');
    if (parentItem) {
      const dropdown = parentItem.querySelector('.nav-dropdown');
      if (dropdown) {
        // On mobile, toggle the dropdown
        if (window.innerWidth <= 768) {
          e.preventDefault();
          parentItem.classList.toggle('active');
        }
      }
    }
  });

  // Close all dropdowns when a link is clicked
  DOM.on('.nav-dropdown a', 'click', function(e) {
    const parentItem = this.closest('.nav-item-parent');
    if (parentItem) {
      parentItem.classList.remove('active');
    }
  });

  // Close dropdowns when clicking outside on mobile
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      if (!e.target.closest('.nav-item-parent')) {
        DOM.selectAll('.nav-item-parent.active').forEach(item => {
          item.classList.remove('active');
        });
      }
    }
  });

  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      DOM.selectAll('.nav-item-parent.active').forEach(item => {
        item.classList.remove('active');
      });
    }
  });
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
 * Render management team
 */
function renderManagement() {
  const managementContent = DOM.select('#managementContent');
  if (!managementContent || !CONFIG.management) return;

  managementContent.innerHTML = CONFIG.management.team
    .map(member => Templates.teamMember(member))
    .join('');
}

/**
 * Render vision section
 */
function renderVision() {
  const visionContent = DOM.select('#visionContent');
  if (!visionContent || !CONFIG.vision) return;

  visionContent.innerHTML = Templates.visionSection(CONFIG.vision);
}

/**
 * Render services
 */
function renderServices() {
  const servicesContent = DOM.select('#servicesContent');
  if (!servicesContent || !CONFIG.services) return;

  servicesContent.innerHTML = CONFIG.services.categories
    .map(service => Templates.serviceCard(service))
    .join('');
}

/**
 * Render hardware services
 */
function renderHardwareServices() {
  const hardwareContent = DOM.select('#hardwareContent');
  if (!hardwareContent || !CONFIG.hardwareServices) return;

  hardwareContent.innerHTML = Templates.serviceDetailSection(CONFIG.hardwareServices);
}

/**
 * Render firmware services
 */
function renderFirmwareServices() {
  const firmwareContent = DOM.select('#firmwareContent');
  if (!firmwareContent || !CONFIG.firmwareServices) return;

  firmwareContent.innerHTML = Templates.serviceDetailSection(CONFIG.firmwareServices);
}

/**
 * Render software services
 */
function renderSoftwareServices() {
  const softwareContent = DOM.select('#softwareContent');
  if (!softwareContent || !CONFIG.softwareServices) return;

  softwareContent.innerHTML = Templates.serviceDetailSection(CONFIG.softwareServices);
}

/**
 * Render help center
 */
function renderHelpCenter() {
  const helpCenterContent = DOM.select('#helpCenterContent');
  if (!helpCenterContent || !CONFIG.helpCenter) return;

  helpCenterContent.innerHTML = Templates.faqSection(CONFIG.helpCenter.faq);
}

/**
 * Render knowledge base
 */
function renderKnowledgeBase() {
  const knowledgeBaseContent = DOM.select('#knowledgeBaseContent');
  if (!knowledgeBaseContent || !CONFIG.knowledgeBase) return;

  knowledgeBaseContent.innerHTML = CONFIG.knowledgeBase.articles
    .map(article => Templates.kbArticle(article))
    .join('');
}

/**
 * Render store section
 */
function renderStore() {
  const storeContent = DOM.select('#storeContent');
  if (!storeContent || !CONFIG.store) return;

  storeContent.innerHTML = Templates.storeSection(CONFIG.store);
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
