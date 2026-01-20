/**
 * KLOX SYSTEMS - CONFIGURATION & DATA
 * Centralized data management for easy updates and scalability
 * 
 * Usage: Import this file and reference data via CONFIG object
 * Benefits: Single source of truth, easy to migrate to JSON/API, maintainable
 */

const CONFIG = {
  // Site Information
  site: {
    name: 'Klox Systems',
    tagline: 'Portable Power Stations for Every Need',
    description: 'Innovative portable power solutions that combine cutting-edge technology with environmental responsibility',
  },

  // Navigation Links
  navigation: [
    { label: 'Home', href: '#home' },
    { label: 'Products', href: '#products' },
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],

  // Hero Section
  hero: {
    title: 'Power Your Adventures',
    subtitle: 'Portable Power Stations for Every Need',
    image: 'assets/energy-1.jpg',
    imageAlt: 'Energy Image',
    cta: {
      text: 'Explore Products',
      href: '#products',
    },
  },

  // Features Section
  features: [
    {
      icon: '🔋',
      title: 'Long-Lasting Battery',
      description: 'High-capacity lithium batteries that keep you powered for days',
    },
    {
      icon: '⚡',
      title: 'Fast Charging',
      description: 'Charge up to 80% in just 1 hour with our advanced technology',
    },
    {
      icon: '🌿',
      title: 'Eco-Friendly',
      description: 'Clean, renewable energy solutions for a sustainable future',
    },
    {
      icon: '🛡️',
      title: 'Safe & Reliable',
      description: 'Built-in protection systems ensure safe operation always',
    },
  ],

  // Products
  products: [
    {
      id: 'agni-512',
      name: 'Agni 512',
      capacity: '512Wh',
      description: 'Perfect for camping and outdoor activities. 512Wh capacity, multiple outlets.',
      price: 24999,
      currency: '₹',
      image: 'assets/agni-512.jpg',
      features: [
        'Portable & lightweight',
        'Multiple outlets',
        'Long battery life',
        'Solar compatible',
      ],
    },
    {
      id: 'agni-1024',
      name: 'Agni 1024',
      capacity: '1024Wh',
      description: 'For home backup and professional use. 1024Wh capacity, pure sine wave.',
      price: 49999,
      currency: '₹',
      // image: SVG generated
      features: [
        'Home backup power',
        'Pure sine wave',
        'Professional grade',
        'Extended runtime',
      ],
    },
    {
      id: 'agni-2048',
      name: 'Agni 2048',
      capacity: '2048Wh',
      description: 'Maximum power for all needs. 2048Wh capacity, expandable battery.',
      price: 89999,
      currency: '₹',
      // image: SVG generated
      features: [
        'Maximum capacity',
        'Expandable',
        'Industrial use',
        'Dual charging',
      ],
    },
  ],

  // About Section
  about: {
    title: 'About Klox Systems',
    paragraphs: [
      'We\'re dedicated to providing innovative portable power solutions that combine cutting-edge technology with environmental responsibility. Our mission is to keep you powered wherever life takes you, while reducing our carbon footprint.',
      'With over 10 years of experience in renewable energy technology, we\'ve helped thousands of customers stay connected and powered in their adventures, emergencies, and everyday life.',
    ],
  },

  // Footer
  footer: {
    sections: [
      {
        title: 'Product',
        links: [
          { label: 'Features', action: 'scrollTo', target: '#features' },
          { label: 'Pricing', action: 'scrollTo', target: '#products' },
          { label: 'Security', action: 'openModal', target: 'supportModal' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', action: 'scrollTo', target: '#about' },
          { label: 'Support', action: 'openModal', target: 'supportModal' },
          { label: 'Contact', action: 'openModal', target: 'supportModal' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Documentation', action: 'link', target: '#' },
          { label: 'Community', action: 'link', target: '#' },
          { label: 'Blog', action: 'link', target: '#' },
        ],
      },
    ],
    copyright: `© ${new Date().getFullYear()} Klox Systems. All rights reserved.`,
  },

  // Payment Methods
  paymentMethods: [
    { id: 'gpay', label: 'Google Pay', icon: '📱' },
    { id: 'upi', label: 'UPI', icon: '💳' },
    { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  ],

  // Support Categories
  supportCategories: [
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing Inquiry' },
    { value: 'general', label: 'General Question' },
  ],

  // Explore Tabs
  exploreTabs: {
    title: 'Explore Our Products',
    description: 'Discover detailed specifications, features, and use cases for each power station',
    tabs: [
      {
        id: 'specifications',
        name: 'Specifications',
        icon: '📊',
        active: true,
        items: [
          {
            name: 'Agni 512',
            icon: '🔌',
            description: 'Compact 512Wh portable power station',
            specs: {
              'Capacity': '512Wh',
              'Power': '1000W',
              'Weight': '5.2 kg',
              'Charging Time': '1 hour',
            },
          },
          {
            name: 'Agni 1024',
            icon: '⚡',
            description: 'Mid-range 1024Wh power station',
            specs: {
              'Capacity': '1024Wh',
              'Power': '2000W',
              'Weight': '10.5 kg',
              'Charging Time': '1.5 hours',
            },
          },
          {
            name: 'Agni 2048',
            icon: '🔋',
            description: 'Premium 2048Wh power station',
            specs: {
              'Capacity': '2048Wh',
              'Power': '3000W',
              'Weight': '19.8 kg',
              'Charging Time': '2 hours',
            },
          },
        ],
      },
      {
        id: 'features',
        name: 'Features',
        icon: '✨',
        active: false,
        items: [
          {
            name: 'Fast Charging Technology',
            icon: '⚡',
            description: 'Charge up to 80% in just 1 hour with advanced power management',
          },
          {
            name: 'Multiple Outputs',
            icon: '🔌',
            description: 'AC, USB, USB-C, and DC outputs for all your devices',
          },
          {
            name: 'Smart Display',
            icon: '📱',
            description: 'LCD display shows real-time power status and device info',
          },
          {
            name: 'Eco-Friendly',
            icon: '🌱',
            description: 'LiFePO4 batteries with minimal environmental impact',
          },
          {
            name: 'Lightweight Design',
            icon: '📦',
            description: 'Portable and easy to carry for your adventures',
          },
          {
            name: 'UPS Function',
            icon: '🔋',
            description: 'Seamless backup power during outages',
          },
        ],
      },
      {
        id: 'usecases',
        name: 'Use Cases',
        icon: '🎯',
        active: false,
        items: [
          {
            name: 'Camping & Outdoors',
            icon: '⛺',
            description: 'Keep your devices charged during camping trips and outdoor adventures',
          },
          {
            name: 'Emergency Backup',
            icon: '🏠',
            description: 'Reliable backup power during electricity outages and blackouts',
          },
          {
            name: 'Photography',
            icon: '📷',
            description: 'Power your cameras, lights, and editing equipment on location',
          },
          {
            name: 'Remote Work',
            icon: '💻',
            description: 'Work from anywhere with uninterrupted power supply',
          },
          {
            name: 'Events & Festivals',
            icon: '🎪',
            description: 'Run audio equipment, lights, and sound systems at events',
          },
          {
            name: 'Medical Needs',
            icon: '⚕️',
            description: 'Critical backup power for medical devices and equipment',
          },
        ],
      },
      {
        id: 'warranty',
        name: 'Warranty',
        icon: '✅',
        active: false,
        items: [
          {
            name: '5-Year Warranty',
            icon: '📋',
            description: 'Comprehensive 5-year warranty covers all manufacturing defects',
          },
          {
            name: 'Battery Health Guarantee',
            icon: '🔋',
            description: '80% capacity guarantee after 5 years of normal use',
          },
          {
            name: 'Free Replacements',
            icon: '🔄',
            description: 'Free replacement for defective units within warranty period',
          },
          {
            name: '24/7 Support',
            icon: '📞',
            description: 'Round-the-clock customer support for all warranty claims',
          },
          {
            name: 'Extended Coverage',
            icon: '🛡️',
            description: 'Optional extended warranty coverage available for up to 10 years',
          },
          {
            name: 'Accident Protection',
            icon: '💪',
            description: 'Add-on accidental damage protection for peace of mind',
          },
        ],
      },
    ],
  },

  // Constants
  constants: {
    advancePaymentPercent: 0.2, // 20% advance payment
    maxOrderQuantity: 10,
    minOrderQuantity: 1,
  },

  // Cart Configuration
  cart: {
    storageKey: 'klox_cart',
    maxItems: 100,
  },

  // User Configuration
  user: {
    storageKey: 'klox_user',
    sessionStorageKey: 'klox_session',
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
