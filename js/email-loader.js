/**
 * KLOX SYSTEMS - EMAIL SERVICE LOADER
 * Handles multiple strategies to load and initialize email service
 * Runs before email.js
 */

(function() {
  console.log('📧 Email Service Loader initializing...');

  // Strategy 1: Use localStorage to cache loaded state
  const CACHE_KEY = 'klox_emailjs_loaded';
  
  // Check if we've successfully loaded EmailJS before
  const wasPreviouslyLoaded = localStorage.getItem(CACHE_KEY) === 'true';
  
  if (wasPreviouslyLoaded) {
    console.log('✓ EmailJS was previously loaded, attempting to load from CDN again...');
  }

  // Strategy 2: Multiple CDN sources with sequential fallback
  // Loading in parallel caused emailjs to be defined multiple times and
  // wasted bandwidth. We now try each CDN in order, only moving to the
  // next one if the previous fails.
  const cdnSources = [
    'https://cdn.emailjs.com/sdk/3.10.0/email.min.js',
    'https://cdn.jsdelivr.net/npm/@emailjs/browser@3.10.0/dist/email.min.js',
    'https://unpkg.com/@emailjs/browser@3.10.0/dist/email.min.js',
  ];

  function tryLoadCDN(index) {
    if (index >= cdnSources.length) {
      console.warn('⚠️  All EmailJS CDNs failed to load');
      return;
    }

    const url = cdnSources[index];
    const script = document.createElement('script');
    script.src = url;

    script.onload = function () {
      console.log(`✓ EmailJS loaded from CDN ${index + 1}: ${url}`);
      localStorage.setItem(CACHE_KEY, 'true');
    };

    script.onerror = function () {
      console.warn(`⚠️  CDN ${index + 1} failed: ${url}, trying next...`);
      tryLoadCDN(index + 1);
    };

    document.head.appendChild(script);
  }

  tryLoadCDN(0);

  // Strategy 3: Check for EmailJS after all scripts load
  window.addEventListener('load', function() {
    if (typeof emailjs !== 'undefined') {
      console.log('✓ EmailJS is available globally');
    } else {
      console.warn('⚠️  EmailJS still not available after page load');
      console.warn('Please check:');
      console.warn('  1. Network connectivity');
      console.warn('  2. Firewall/proxy settings blocking CDNs');
      console.warn('  3. Browser console for specific errors');
      console.warn('\nFallback: You can enable Firebase Cloud Function instead');
    }
  });

  // Make sure email.js knows about loading strategies
  window.EmailServiceLoader = {
    isEmailJSAvailable: function() {
      return typeof emailjs !== 'undefined';
    },
    
    forceReload: function() {
      console.log('Forcing EmailJS reload...');
      localStorage.removeItem(CACHE_KEY);
      location.reload();
    },
    
    getSwitchedToFirebase: function() {
      return localStorage.getItem('klox_use_firebase') === 'true';
    },
    
    switchToFirebase: function() {
      console.log('Switching to Firebase Cloud Function...');
      localStorage.setItem('klox_use_firebase', 'true');
      localStorage.setItem(CACHE_KEY, 'false');
    }
  };

  console.log('✓ Email Service Loader ready');
})();
