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
    { 
      label: 'Klox', 
      href: '#home',
      children: [
        { label: 'About', href: '#about' },
        { label: 'Management', href: '#management' },
        { label: 'Vision', href: '#vision' },
      ]
    },
    {
      label: 'Products',
      href: '#products',
      children: [
        { label: 'Agni 512', href: '#products' },
        { label: 'Agni 1024', href: '#products' },
        { label: 'Agni 2048', href: '#products' },
      ]
    },
    { 
      label: 'Services', 
      href: '#services',
      children: [
        { label: 'Hardware', href: '#hardware' },
        { label: 'Firmware', href: '#firmware' },
        { label: 'Software', href: '#software' },
      ]
    },
    { 
      label: 'Support', 
      href: '#support',
      children: [
        { label: 'Help Center', href: '#help-center' },
        { label: 'Knowledge base', href: '#knowledge-base' },
        { label: 'Contact', href: '#contact' },
      ]
    },
    { 
      label: 'Store', 
      href: '#store',
      children: []
    },
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

  // Management Team
  management: {
    title: 'Leadership Team',
    description: 'Meet the visionary leaders driving innovation at Klox Systems',
    team: [
      {
        name: 'Rajesh Kumar',
        role: 'Founder & CEO',
        bio: 'Visionary entrepreneur with 15+ years in renewable energy and power systems',
        icon: '👔',
      },
      {
        name: 'Priya Sharma',
        role: 'Chief Technology Officer',
        bio: 'Expert in battery technology and power management systems',
        icon: '⚡',
      },
      {
        name: 'Amit Patel',
        role: 'Chief Operations Officer',
        bio: 'Experienced leader in manufacturing and supply chain optimization',
        icon: '🏭',
      },
      {
        name: 'Sarah Johnson',
        role: 'Chief Marketing Officer',
        bio: 'Strategic marketer focused on sustainable energy solutions',
        icon: '📊',
      },
    ],
  },

  // Vision & Mission
  vision: {
    title: 'Our Vision & Mission',
    mission: {
      title: 'Our Mission',
      description: 'To empower individuals and businesses with reliable, portable power solutions that enable freedom, sustainability, and innovation in energy management.',
      icon: '🎯',
    },
    vision: {
      title: 'Our Vision',
      description: 'To become the global leader in portable power technology, making clean, renewable energy accessible to everyone, everywhere.',
      icon: '🌍',
    },
    values: [
      {
        title: 'Innovation',
        description: 'Continuously pushing boundaries to develop cutting-edge power solutions',
        icon: '💡',
      },
      {
        title: 'Sustainability',
        description: 'Committed to reducing carbon footprint through renewable energy',
        icon: '🌿',
      },
      {
        title: 'Reliability',
        description: 'Building products you can trust in any condition',
        icon: '🔒',
      },
      {
        title: 'Excellence',
        description: 'Pursuing perfection in every aspect of our business',
        icon: '⭐',
      },
    ],
  },

  // Services
  services: {
    title: 'Our Services',
    description: 'Comprehensive support across hardware, firmware, and software solutions',
    categories: [
      {
        title: 'Hardware Services',
        href: '#hardware',
        description: 'Expert maintenance, repairs, and hardware upgrades',
        icon: '🔧',
      },
      {
        title: 'Firmware Services',
        href: '#firmware',
        description: 'Regular updates, optimization, and firmware upgrades',
        icon: '📡',
      },
      {
        title: 'Software Services',
        href: '#software',
        description: 'Mobile apps, monitoring dashboards, and analytics tools',
        icon: '💻',
      },
    ],
  },

  // Hardware Services Details
  hardwareServices: {
    title: 'Hardware Services',
    description: 'Professional maintenance and hardware support for optimal performance',
    features: [
      {
        title: 'Installation & Setup',
        description: 'Professional installation and configuration assistance',
        icon: '⚙️',
      },
      {
        title: 'Preventive Maintenance',
        description: 'Regular check-ups to ensure peak performance and longevity',
        icon: '🔍',
      },
      {
        title: 'Repair Services',
        description: 'Fast and reliable repair services with genuine components',
        icon: '🔨',
      },
      {
        title: 'Component Upgrades',
        description: 'Enhanced batteries and modules for increased capacity',
        icon: '⬆️',
      },
      {
        title: 'Technical Support',
        description: '24/7 expert technical assistance via phone, email, or chat',
        icon: '📞',
      },
      {
        title: 'On-Site Service',
        description: 'Mobile service units available for major installations',
        icon: '🚐',
      },
    ],
  },

  // Firmware Services Details
  firmwareServices: {
    title: 'Firmware Services',
    description: 'Keep your devices optimized with regular firmware updates',
    features: [
      {
        title: 'OTA Updates',
        description: 'Over-the-air firmware updates for seamless upgrades',
        icon: '📥',
      },
      {
        title: 'Security Patches',
        description: 'Regular security updates to protect your device',
        icon: '🔐',
      },
      {
        title: 'Performance Optimization',
        description: 'Updates that enhance efficiency and extend battery life',
        icon: '⚡',
      },
      {
        title: 'Feature Enhancements',
        description: 'New capabilities and improvements through firmware updates',
        icon: '✨',
      },
      {
        title: 'Version Management',
        description: 'Rollback options and version history management',
        icon: '📦',
      },
      {
        title: 'Beta Programs',
        description: 'Early access to new features for beta testers',
        icon: '🧪',
      },
    ],
  },

  // Software Services Details
  softwareServices: {
    title: 'Software Services',
    description: 'Comprehensive software ecosystem for monitoring and control',
    features: [
      {
        title: 'Mobile App',
        description: 'iOS and Android apps for real-time device monitoring',
        icon: '📱',
      },
      {
        title: 'Web Dashboard',
        description: 'Cloud-based dashboard for complete power management',
        icon: '💻',
      },
      {
        title: 'Analytics & Insights',
        description: 'Detailed power usage analytics and optimization recommendations',
        icon: '📊',
      },
      {
        title: 'Smart Scheduling',
        description: 'Automated charging schedules and load management',
        icon: '⏱️',
      },
      {
        title: 'API Integration',
        description: 'Developer API for third-party integrations',
        icon: '🔗',
      },
      {
        title: 'Cloud Sync',
        description: 'Seamless synchronization across all your devices',
        icon: '☁️',
      },
    ],
  },

  // Help Center
  helpCenter: {
    title: 'Help Center',
    description: 'Find answers to common questions and get support',
    faq: [
      {
        question: 'How long does it take to charge a power station?',
        answer: 'Charging time varies by capacity: Agni 512 takes ~1 hour, Agni 1024 takes ~1.5 hours, and Agni 2048 takes ~2.5 hours with standard AC charging.',
        category: 'Charging',
      },
      {
        question: 'Can I use the power station while charging?',
        answer: 'Yes, all Klox power stations support passthrough charging, allowing you to use devices while the station itself is charging.',
        category: 'Usage',
      },
      {
        question: 'What is the warranty period?',
        answer: 'All Klox Systems products come with a standard 2-year warranty covering manufacturing defects and hardware issues.',
        category: 'Warranty',
      },
      {
        question: 'How do I update the firmware?',
        answer: 'Firmware updates are pushed automatically via OTA (Over-The-Air). You can also manually check for updates in the mobile app settings.',
        category: 'Firmware',
      },
      {
        question: 'Is the power station waterproof?',
        answer: 'Our power stations have IP54 rating, making them splash-proof and dust-resistant. Not suitable for submerged use.',
        category: 'Specifications',
      },
      {
        question: 'What devices can I charge?',
        answer: 'You can charge any device with USB, USB-C, AC, or wireless charging via our AC outlets. Compatible with thousands of devices.',
        category: 'Compatibility',
      },
    ],
  },

  // Knowledge Base
  knowledgeBase: {
    title: 'Knowledge Base',
    description: 'Comprehensive guides and documentation for all topics',
    articles: [
      {
        title: 'Getting Started with Your Power Station',
        category: 'Getting Started',
        icon: '📖',
        content: 'Complete guide to unboxing, setting up, and first use of your Klox power station.',
      },
      {
        title: 'Battery Maintenance & Care',
        category: 'Maintenance',
        icon: '🔋',
        content: 'Best practices for extending battery life and maintaining optimal performance.',
      },
      {
        title: 'Solar Panel Installation',
        category: 'Installation',
        icon: '☀️',
        content: 'Step-by-step guide to connecting and using solar panels with your station.',
      },
      {
        title: 'Load Calculations & Planning',
        category: 'Usage',
        icon: '⚖️',
        content: 'Learn how to calculate power requirements and plan your device usage.',
      },
      {
        title: 'Troubleshooting Common Issues',
        category: 'Support',
        icon: '🔧',
        content: 'Solutions to common problems and error messages explained.',
      },
      {
        title: 'Traveling with Your Power Station',
        category: 'Travel',
        icon: '✈️',
        content: 'Tips for safely traveling with power stations on planes and vehicles.',
      },
    ],
  },

  // Store Information
  store: {
    title: 'Klox Store',
    description: 'Shop our complete range of power stations and accessories',
    highlights: [
      {
        title: 'Free Shipping',
        description: 'On all orders over ₹5000 across India',
        icon: '🚚',
      },
      {
        title: 'Easy Returns',
        description: '30-day hassle-free return policy',
        icon: '↩️',
      },
      {
        title: 'Expert Support',
        description: 'Get personalized recommendations from our team',
        icon: '👥',
      },
      {
        title: 'Fast Delivery',
        description: '2-3 business days delivery to major cities',
        icon: '⚡',
      },
    ],
    accessories: [
      {
        name: 'Solar Panel 100W',
        price: 12999,
        description: 'Portable solar panel for efficient charging',
        icon: '☀️',
      },
      {
        name: 'Car Charger',
        price: 2999,
        description: '12V car charging cable and adapter',
        icon: '🚗',
      },
      {
        name: 'Carrying Case',
        price: 4999,
        description: 'Protective carrying case for safe transport',
        icon: '🎒',
      },
      {
        name: 'Expansion Battery Module',
        price: 24999,
        description: 'Add 512Wh extra capacity to any station',
        icon: '🔌',
      },
    ],
  },
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

  // Firebase Configuration (project credentials)
  firebase: {
    apiKey: 'AIzaSyBVJt-p7R056YzvRnM0x4LDX6w0VQIbNRE',
    authDomain: 'kloxsys-dev.firebaseapp.com',
    projectId: 'kloxsys-dev',
    storageBucket: 'kloxsys-dev.firebasestorage.app',
    messagingSenderId: '836789543768',
    appId: '1:836789543768:web:135ab604f11845857e7b2d',
    measurementId: 'G-BFWSMYJZM3',
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
