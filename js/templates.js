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
          <button class="buy-button" onclick="openPreOrder('${product.id}')">
            🛒 Pre-Order Now
          </button>
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
      <div class="feature-icon">${feature.icon}</div>
      <h3>${feature.title}</h3>
      <p>${feature.description}</p>
    </div>
  `,

  /**
   * Navigation Links Template
   */
  navLink: (navItem) => `
    <li><a href="${navItem.href}">${navItem.label}</a></li>
  `,

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
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Templates;
}
