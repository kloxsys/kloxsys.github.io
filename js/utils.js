/**
 * KLOX SYSTEMS - UTILITY FUNCTIONS
 * Reusable functions for DOM manipulation and common operations
 */

// DOM Helpers
const DOM = {
  /**
   * Safely select element
   */
  select: (selector) => {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`Element not found: ${selector}`);
    }
    return element;
  },

  /**
   * Safely select all elements
   */
  selectAll: (selector) => {
    return document.querySelectorAll(selector);
  },

  /**
   * Create element with classes and attributes
   */
  create: (tag, options = {}) => {
    const element = document.createElement(tag);
    if (options.classes) {
      element.className = options.classes;
    }
    if (options.innerHTML) {
      element.innerHTML = options.innerHTML;
    }
    if (options.textContent) {
      element.textContent = options.textContent;
    }
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    return element;
  },

  /**
   * Add event listeners with error handling
   */
  on: (selector, event, callback) => {
    const elements = typeof selector === 'string' ? DOM.selectAll(selector) : [selector];
    elements.forEach((element) => {
      if (element) {
        element.addEventListener(event, callback);
      }
    });
  },

  /**
   * Toggle class on element
   */
  toggleClass: (selector, className) => {
    const element = typeof selector === 'string' ? DOM.select(selector) : selector;
    if (element) {
      element.classList.toggle(className);
    }
  },

  /**
   * Add class to element
   */
  addClass: (selector, className) => {
    const element = typeof selector === 'string' ? DOM.select(selector) : selector;
    if (element) {
      element.classList.add(className);
    }
  },

  /**
   * Remove class from element
   */
  removeClass: (selector, className) => {
    const element = typeof selector === 'string' ? DOM.select(selector) : selector;
    if (element) {
      element.classList.remove(className);
    }
  },
};

// Validation Helpers
const Validation = {
  /**
   * Check if email is valid
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Check if phone is valid
   */
  isValidPhone: (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  /**
   * Validate form fields
   */
  validateForm: (fields) => {
    const errors = [];
    fields.forEach(({ selector, type, required = false, message }) => {
      const element = DOM.select(selector);
      if (!element) return;

      const value = element.value?.trim();

      if (required && !value) {
        errors.push(`${message || selector} is required`);
        return;
      }

      if (value) {
        if (type === 'email' && !Validation.isValidEmail(value)) {
          errors.push(`${message || selector} is invalid`);
        }
        if (type === 'phone' && !Validation.isValidPhone(value)) {
          errors.push(`${message || selector} is invalid`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Format Helpers
const Format = {
  /**
   * Format number as currency
   */
  currency: (amount, currencySymbol = '₹') => {
    return currencySymbol + amount.toLocaleString();
  },

  /**
   * Format date
   */
  date: (date, format = 'short') => {
    const options = format === 'short'
      ? { year: 'numeric', month: 'short', day: 'numeric' }
      : { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-IN', options);
  },

  /**
   * Format phone number
   */
  phone: (phone) => {
    // Converts to format: +91 XXXXX XXXXX
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1,3})(\d{5})(\d{5})$/);
    return match ? `+${match[1]} ${match[2]} ${match[3]}` : phone;
  },
};

// API/Storage Helpers
const Storage = {
  /**
   * Get item from localStorage
   */
  get: (key) => {
    try {
      if (typeof localStorage === 'undefined') return null;
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error getting item from storage: ${key}`, error.message);
      return null;
    }
  },

  /**
   * Set item in localStorage
   */
  set: (key, value) => {
    try {
      if (typeof localStorage === 'undefined') return false;
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error setting item in storage: ${key}`, error.message);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key) => {
    try {
      if (typeof localStorage === 'undefined') return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing item from storage: ${key}`, error.message);
      return false;
    }
  },

  /**
   * Clear all localStorage
   */
  clear: () => {
    try {
      if (typeof localStorage === 'undefined') return false;
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing storage', error.message);
      return false;
    }
  },
};

// Analytics Helper
const Analytics = {
  /**
   * Track event (placeholder for analytics integration)
   */
  trackEvent: (eventName, eventData = {}) => {
    console.log(`Event: ${eventName}`, eventData);
    // TODO: Integrate with Google Analytics, Mixpanel, etc.
    // Example: gtag('event', eventName, eventData);
  },

  /**
   * Track page view
   */
  trackPageView: (pageName) => {
    console.log(`Page View: ${pageName}`);
    // TODO: Integrate with analytics provider
  },
};

// Logger Helper
const Logger = {
  /**
   * Log info message
   */
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, data);
  },

  /**
   * Log warning message
   */
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`, data);
  },

  /**
   * Log error message
   */
  error: (message, error = {}) => {
    console.error(`[ERROR] ${message}`, error);
  },
};

// Performance Helper
const Performance = {
  /**
   * Debounce function for performance
   */
  debounce: (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * Throttle function for performance
   */
  throttle: (func, limit) => {
    let isThrottled;
    return function (...args) {
      if (!isThrottled) {
        func.apply(this, args);
        isThrottled = true;
        setTimeout(() => {
          isThrottled = false;
        }, limit);
      }
    };
  },

  /**
   * Lazy load images
   */
  lazyLoadImages: () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;
            image.src = image.dataset.src;
            image.classList.add('loaded');
            observer.unobserve(image);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach((img) => imageObserver.observe(img));
    }
  },
};
