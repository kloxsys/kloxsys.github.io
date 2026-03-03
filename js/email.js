/**
 * KLOX SYSTEMS - EMAIL SERVICE
 * Sends transactional emails (order confirmations, shipment updates, etc.)
 * 
 * Supports:
 * 1. Firebase Cloud Functions with SendGrid
 * 2. EmailJS (frontend JavaScript email service)
 * 3. Custom backend API
 */

(function () {
  if (typeof CONFIG === 'undefined') {
    console.error('CONFIG not loaded before email.js');
    return;
  }

  const EmailService = {
    // Configuration
    config: {
      // EmailJS Config (free, no backend required)
      emailjs: {
        serviceId: 'service_qqhmbib', // Create at emailjs.com
        templateId: 'template_order_confirmation', // VERIFY THIS MATCHES YOUR EMAILJS DASHBOARD
        // SECURITY WARNING: This key is visible in client-side JS.
        // Restrict it to your domain in the EmailJS dashboard under
        // Account → API Keys → Allowed Origins to prevent abuse.
        apiKey: 'J0bEaSBI3egeMc60w',
        enabled: true, // Set to true after setting up EmailJS
      },
      // Firebase Cloud Function endpoint
      firebaseCloudFunction: {
        url: 'https://us-central1-kloxsys-dev.cloudfunctions.net/sendOrderConfirmationEmail',
        enabled: false, // Set to true after deploying Cloud Function
      },
      // Custom backend API
      customBackend: {
        url: 'https://your-backend.com/api/send-email',
        enabled: false,
      }
    },

    // Console logging fallback (for development/debugging)
    consoleLoggingEnabled: false,

    /**
     * Wait for EmailJS to load with timeout
     */
    async waitForEmailJS(timeout = 10000) {
      const startTime = Date.now();
      while (typeof emailjs === 'undefined') {
        if (Date.now() - startTime > timeout) {
          console.error('❌ EmailJS loading timeout after ' + timeout + 'ms');
          return false;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      console.log('✓ EmailJS loaded and ready');
      return true;
    },

    /**
     * Initialize EmailJS (if using that service)
     */
    async initEmailJS() {
      if (!this.config.emailjs.enabled) {
        console.log('ℹ️ EmailJS not enabled in config');
        return false;
      }

      try {
        // Wait for EmailJS library to load
        const loaded = await this.waitForEmailJS(10000);
        
        if (!loaded) {
          console.error('❌ EmailJS failed to load from CDN');
          return false;
        }

        if (typeof emailjs === 'undefined') {
          console.error('❌ EmailJS library is not available');
          return false;
        }

        // Initialize with API key
        emailjs.init(this.config.emailjs.apiKey);
        console.log('✓ EmailJS initialized successfully');
        return true;
      } catch (error) {
        console.error('❌ Error initializing EmailJS:', error);
        return false;
      }
    },

    /**
     * Format currency value
     */
    formatCurrency(value) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(value);
    },

    /**
     * Generate order confirmation email HTML
     */
    generateOrderConfirmationHTML(order, user, items) {
      const itemsHTML = items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px; text-align: left;">${item.name || 'Product'}</td>
          <td style="padding: 12px; text-align: center;">×${item.quantity || 1}</td>
          <td style="padding: 12px; text-align: right;">${this.formatCurrency(item.price || 0)}</td>
          <td style="padding: 12px; text-align: right;"><strong>${this.formatCurrency((item.price || 0) * (item.quantity || 1))}</strong></td>
        </tr>
      `).join('');

      const shippingAddr = order.shippingAddress || {};
      const billingAddr = order.billingAddress || {};

      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #333;
              background: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .header p {
              margin: 8px 0 0 0;
              font-size: 14px;
              opacity: 0.9;
            }
            .content {
              padding: 30px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section h2 {
              font-size: 16px;
              font-weight: 600;
              color: #667eea;
              margin: 0 0 15px 0;
              border-bottom: 2px solid #667eea;
              padding-bottom: 10px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #f0f0f0;
            }
            .detail-label {
              font-weight: 500;
              color: #555;
            }
            .detail-value {
              color: #333;
              text-align: right;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              font-size: 14px;
            }
            .items-table th {
              background: #f8f9fa;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              color: #333;
              border-bottom: 2px solid #e9ecef;
            }
            .items-table td {
              padding: 12px;
            }
            .price-section {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 6px;
              margin-top: 15px;
            }
            .price-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 14px;
            }
            .price-row.total {
              border-top: 2px solid #e9ecef;
              padding-top: 15px;
              margin-top: 15px;
              font-size: 16px;
              font-weight: 600;
              color: #667eea;
            }
            .address-box {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 6px;
              margin-top: 10px;
              font-size: 14px;
              line-height: 1.8;
            }
            .address-box strong {
              display: block;
              margin-bottom: 8px;
              color: #333;
            }
            .status-badge {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              margin: 10px 0;
            }
            .next-steps {
              background: #e8f5e9;
              border-left: 4px solid #4caf50;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              font-size: 14px;
            }
            .next-steps h3 {
              margin: 0 0 10px 0;
              color: #2e7d32;
              font-size: 14px;
            }
            .next-steps ul {
              margin: 0;
              padding: 0 0 0 20px;
            }
            .next-steps li {
              margin: 6px 0;
              color: #333;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 30px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 600;
              font-size: 14px;
              margin-top: 15px;
              text-align: center;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #999;
              border-top: 1px solid #eee;
            }
            .footer p {
              margin: 5px 0;
            }
            .divider {
              height: 1px;
              background: #eee;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              <h1>✓ Order Confirmed</h1>
              <p>Thank you for your order!</p>
            </div>

            <!-- Content -->
            <div class="content">
              <!-- Order Details -->
              <div class="section">
                <h2>Order Details</h2>
                <div class="detail-row">
                  <span class="detail-label">Order ID:</span>
                  <span class="detail-value" style="font-family: monospace; font-weight: 600;">${order.id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Order Date:</span>
                  <span class="detail-value">${new Date(order.createdAt).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value"><div class="status-badge">${order.status?.toUpperCase() || 'PROCESSING'}</div></span>
                </div>
                ${order.estimatedDelivery ? `
                <div class="detail-row">
                  <span class="detail-label">Estimated Delivery:</span>
                  <span class="detail-value">${new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                  })}</span>
                </div>
                ` : ''}
              </div>

              <!-- Items -->
              <div class="section">
                <h2>Order Items</h2>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style="text-align: center;">Qty</th>
                      <th style="text-align: right;">Unit Price</th>
                      <th style="text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHTML}
                  </tbody>
                </table>
              </div>

              <!-- Price Summary -->
              <div class="section">
                <div class="price-section">
                  <div class="price-row">
                    <span>Subtotal:</span>
                    <span>${this.formatCurrency(order.subtotal || 0)}</span>
                  </div>
                  ${order.tax > 0 ? `
                  <div class="price-row">
                    <span>Tax (${typeof order.taxRate !== 'undefined' ? order.taxRate : 18}%):</span>
                    <span>${this.formatCurrency(order.tax || 0)}</span>
                  </div>
                  ` : ''}
                  ${order.shipping > 0 ? `
                  <div class="price-row">
                    <span>Shipping:</span>
                    <span>${this.formatCurrency(order.shipping || 0)}</span>
                  </div>
                  ` : `
                  <div class="price-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  `}
                  <div class="price-row total">
                    <span>Total Amount:</span>
                    <span>${this.formatCurrency(order.total || 0)}</span>
                  </div>
                </div>
              </div>

              <!-- Payment Details -->
              <div class="section">
                <h2>Payment Details</h2>
                <div class="detail-row">
                  <span class="detail-label">Payment Method:</span>
                  <span class="detail-value">${this.formatPaymentMethod(order.paymentMethod)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment Status:</span>
                  <span class="detail-value"><div class="status-badge" style="background: #4caf50;">CONFIRMED</div></span>
                </div>
                ${order.paymentId ? `
                <div class="detail-row">
                  <span class="detail-label">Transaction ID:</span>
                  <span class="detail-value" style="font-family: monospace; font-size: 12px;">${order.paymentId}</span>
                </div>
                ` : ''}
              </div>

              <!-- Shipping Address -->
              <div class="section">
                <h2>Shipping Address</h2>
                <div class="address-box">
                  <strong>${shippingAddr.name || 'N/A'}</strong>
                  ${shippingAddr.address1 ? `${shippingAddr.address1}<br>` : ''}
                  ${shippingAddr.address2 ? `${shippingAddr.address2}<br>` : ''}
                  ${shippingAddr.city ? `${shippingAddr.city}, ` : ''}
                  ${shippingAddr.state ? `${shippingAddr.state}` : ''}<br>
                  ${shippingAddr.postalCode ? `${shippingAddr.postalCode}<br>` : ''}
                  ${shippingAddr.country ? `${shippingAddr.country}<br>` : ''}
                  ${shippingAddr.phone ? `<strong>Phone:</strong> ${shippingAddr.phone}` : ''}
                </div>
              </div>

              <!-- Billing Address (if different) -->
              ${billingAddr.address1 && billingAddr.address1 !== shippingAddr.address1 ? `
              <div class="section">
                <h2>Billing Address</h2>
                <div class="address-box">
                  <strong>${billingAddr.name || 'N/A'}</strong>
                  ${billingAddr.address1 ? `${billingAddr.address1}<br>` : ''}
                  ${billingAddr.address2 ? `${billingAddr.address2}<br>` : ''}
                  ${billingAddr.city ? `${billingAddr.city}, ` : ''}
                  ${billingAddr.state ? `${billingAddr.state}` : ''}<br>
                  ${billingAddr.postalCode ? `${billingAddr.postalCode}<br>` : ''}
                  ${billingAddr.country ? `${billingAddr.country}<br>` : ''}
                </div>
              </div>
              ` : ''}

              <!-- Next Steps -->
              <div class="next-steps">
                <h3>What happens next?</h3>
                <ul>
                  <li><strong>Step 1:</strong> We will verify your order and prepare your items (1-2 business days)</li>
                  <li><strong>Step 2:</strong> Your order will ship and you'll receive a tracking number via email</li>
                  <li><strong>Step 3:</strong> Track your shipment in real-time</li>
                  <li><strong>Step 4:</strong> Receive your order and enjoy your new Klox Systems product!</li>
                </ul>
              </div>

              <!-- Customer Info -->
              <div class="section">
                <h2>Customer Information</h2>
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${user.displayName || user.name || 'N/A'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${user.email}</span>
                </div>
                ${user.phone ? `
                <div class="detail-row">
                  <span class="detail-label">Phone:</span>
                  <span class="detail-value">${user.phone}</span>
                </div>
                ` : ''}
              </div>

              <!-- Support CTA -->
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; margin-bottom: 15px;">Questions about your order?</p>
                <a href="https://kloxsys.github.io#help-center" class="cta-button">Contact Support</a>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p><strong>Klox Systems</strong> - Portable Power Stations for Every Need</p>
              <p>Thank you for your business!</p>
              <p style="margin-top: 15px; color: #ccc;">This is an automated email. Please do not reply to this address.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    },

    /**
     * Format payment method for display
     */
    formatPaymentMethod(method) {
      const methods = {
        'razorpay': 'Razorpay (Card/Bank/Wallet)',
        'upi-manual': 'UPI Transfer',
        'google-pay-send': 'Google Pay',
        'stripe': 'Stripe (Card)',
        'paypal': 'PayPal',
      };
      return methods[method] || method || 'Unknown';
    },

    /**
     * Send order confirmation via EmailJS
     */
    async sendViaEmailJS(order, user, items) {
      try {
        console.log('📧 Sending email via EmailJS...');
        
        if (!this.config.emailjs.enabled) {
          console.warn('⚠️  EmailJS not enabled. Configure it in EmailService.config.emailjs');
          return { success: false, method: 'emailjs', reason: 'not_enabled' };
        }

        // Wait for EmailJS to load (with timeout)
        console.log('⏳ Waiting for EmailJS library to load...');
        const loaded = await this.waitForEmailJS(8000);
        
        if (!loaded || typeof emailjs === 'undefined') {
          console.error('❌ EmailJS library failed to load. Please check:');
          console.error('   1. Network connectivity');
          console.error('   2. CDN availability');
          console.error('   3. Browser console for CORS errors');
          return { success: false, method: 'emailjs', reason: 'not_loaded_timeout' };
        }

        console.log('✓ EmailJS library available, initializing...');
        
        // Initialize if not already done
        if (typeof emailjs.init === 'function') {
          try {
            emailjs.init(this.config.emailjs.apiKey);
            console.log('✓ EmailJS initialized');
          } catch (error) {
            console.warn('⚠️  EmailJS init failed (may already be initialized):', error.message);
          }
        }

        console.log('🔧 Generating email HTML...');
        const emailHTML = this.generateOrderConfirmationHTML(order, user, items);

        // Check if email is empty FIRST
        if (!user.email) {
          console.error('❌ USER EMAIL IS EMPTY - Cannot send');
          return { success: false, method: 'emailjs', error: 'User email is empty' };
        }

        // Standard parameter names - most common first
        const templateParams = {
          to_email: user.email,
          customer_name: user.displayName || user.name || 'Valued Customer',
          order_id: order.id,
          order_total: this.formatCurrency(order.total || 0),
          order_html: emailHTML,
        };

        console.log('📤 Sending via EmailJS...');
        console.log('   Service ID:', this.config.emailjs.serviceId);
        console.log('   Template ID:', this.config.emailjs.templateId);
        console.log('   Recipient Email:', user.email);
        console.log('   📋 Template Parameters Sent:');
        Object.keys(templateParams).forEach(key => {
          const value = templateParams[key];
          if (key === 'order_html') {
            console.log(`      ${key}: [HTML content - ${value.length} chars]`);
          } else {
            console.log(`      ${key}: ${value}`);
          }
        });

        const response = await emailjs.send(
          this.config.emailjs.serviceId,
          this.config.emailjs.templateId,
          templateParams
        );

        console.log('✅ Email sent successfully via EmailJS:', response);
        return { success: true, method: 'emailjs', response };
      } catch (error) {
        console.error('❌ EmailJS Error Details:');
        console.error('   Status Code:', error.status || 'N/A');
        console.error('   Error Message:', error.message);
        console.error('   Full Error:', error);
        
        // Provide troubleshooting for specific errors
        if (error.status === 400) {
          console.error('\n🔍 ERROR 400 - Bad Request');
          console.error('   This usually means parameter names don\'t match your template');
          console.error('   Check your template at emailjs.com');
          console.error('   Look for {{to_email}}, {{to}}, {{email}}, or {{recipient_email}}');
          console.error('   Reply with the EXACT parameter names used in your template');
        } else if (error.status === 422) {
          console.error('\n🔍 ERROR 422 - Recipients Address Empty');
          console.error('   Your template may use different parameter names');
          console.error('   Check emailjs.com template editor for {{variable}} names');
        }
        
        return { success: false, method: 'emailjs', error: error.message, status: error.status };
      }
    },

    /**
     * Send order confirmation via Firebase Cloud Function
     */
    async sendViaFirebaseCloudFunction(order, user, items) {
      try {
        console.log('📧 Sending email via Firebase Cloud Function...');
        
        if (!this.config.firebaseCloudFunction.enabled) {
          console.warn('Firebase Cloud Function not enabled');
          return { success: false, method: 'firebase', reason: 'not_enabled' };
        }

        const emailHTML = this.generateOrderConfirmationHTML(order, user, items);

        const payload = {
          to: user.email,
          subject: `Order Confirmation - ${order.id}`,
          htmlContent: emailHTML,
          orderId: order.id,
          userId: user.uid,
          customerName: user.displayName || user.name || 'Customer',
          orderTotal: order.total,
        };

        const response = await fetch(this.config.firebaseCloudFunction.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✓ Email sent via Firebase Cloud Function:', data);
        return { success: true, method: 'firebase', response: data };
      } catch (error) {
        console.error('❌ Firebase Cloud Function error:', error);
        return { success: false, method: 'firebase', error: error.message };
      }
    },

    /**
     * Send order confirmation via custom backend API
     */
    async sendViaCustomBackend(order, user, items) {
      try {
        console.log('📧 Sending email via custom backend...');
        
        if (!this.config.customBackend.enabled) {
          console.warn('Custom backend not enabled');
          return { success: false, method: 'custom', reason: 'not_enabled' };
        }

        const emailHTML = this.generateOrderConfirmationHTML(order, user, items);

        const payload = {
          to: user.email,
          subject: `Order Confirmation - ${order.id}`,
          htmlContent: emailHTML,
          orderId: order.id,
          customerName: user.displayName || user.name || 'Customer',
          orderTotal: order.total,
        };

        const response = await fetch(this.config.customBackend.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✓ Email sent via custom backend:', data);
        return { success: true, method: 'custom', response: data };
      } catch (error) {
        console.error('❌ Custom backend error:', error);
        return { success: false, method: 'custom', error: error.message };
      }
    },

    /**
     * Send order confirmation via Console Logging (Development/Debug Fallback)
     */
    async sendViaConsoleLogging(order, user, items) {
      try {
        console.log('📧 Logging email to console and storage (debug mode)...');
        
        const emailHTML = this.generateOrderConfirmationHTML(order, user, items);
        
        const emailRecord = {
          to: user.email,
          from: 'orders@kloxsystems.com',
          subject: `Order Confirmation - ${order.id}`,
          htmlContent: emailHTML,
          timestamp: new Date().toISOString(),
          orderId: order.id,
          customerName: user.displayName || user.name,
          orderTotal: this.formatCurrency(order.total || 0),
        };

        // Log to console
        console.log('%c📧 EMAIL RECORD ', 'background: #667eea; color: white; padding: 5px 10px; font-weight: bold;');
        console.log('To:', emailRecord.to);
        console.log('Subject:', emailRecord.subject);
        console.log('Order ID:', emailRecord.orderId);
        console.log('Total:', emailRecord.orderTotal);
        console.log('Timestamp:', emailRecord.timestamp);
        console.log('%cHTML Preview (first 500 chars):', 'font-weight: bold;');
        console.log(emailRecord.htmlContent.substring(0, 500) + '...');

        // Store in localStorage for debugging
        try {
          const sentEmails = JSON.parse(localStorage.getItem('klox_sent_emails_debug') || '[]');
          sentEmails.push(emailRecord);
          localStorage.setItem('klox_sent_emails_debug', JSON.stringify(sentEmails));
          console.log(`✓ Email logged to localStorage (total: ${sentEmails.length})`);
        } catch (storageError) {
          console.warn('Could not store in localStorage:', storageError.message);
        }

        console.log('%c✅ EMAIL LOGGED SUCCESSFULLY ', 'background: #4caf50; color: white; padding: 5px 10px; font-weight: bold;');
        console.log('📝 Note: Running in console logging mode (debug). Emails are NOT actually sent.');
        console.log('To enable real email sending, configure EmailJS or Firebase Cloud Function.');

        return { success: true, method: 'console', message: 'Email logged to console and storage' };
      } catch (error) {
        console.error('❌ Console logging error:', error);
        return { success: false, method: 'console', error: error.message };
      }
    },

    /**
     * Send order confirmation - tries all available methods
     */
    async sendOrderConfirmation(order, user, items = []) {
      try {
        console.log('========================================');
        console.log('📧 SENDING ORDER CONFIRMATION EMAIL');
        console.log('========================================');
        console.log('Order ID:', order.id);
        console.log('To:', user.email);
        console.log('Items:', items.length);
        
        console.log('\n📋 AVAILABLE METHODS:');
        console.log('  Firebase Cloud Function:', this.config.firebaseCloudFunction.enabled ? '✓ ENABLED' : '✗ disabled');
        console.log('  EmailJS:', this.config.emailjs.enabled ? '✓ ENABLED' : '✗ disabled');
        console.log('  Custom Backend:', this.config.customBackend.enabled ? '✓ ENABLED' : '✗ disabled');
        
        console.log('\n🔍 LIBRARY STATUS:');
        console.log('  EmailJS loaded:', typeof emailjs !== 'undefined' ? '✓ YES' : '✗ NO');

        // Try methods in order of preference
        const methods = [];
        if (this.config.firebaseCloudFunction.enabled) methods.push('firebase');
        if (this.config.emailjs.enabled) methods.push('emailjs');
        if (this.config.customBackend.enabled) methods.push('custom');
        if (this.consoleLoggingEnabled) methods.push('console');

        if (methods.length === 0) {
          console.warn('\n❌ NO EMAIL SERVICE CONFIGURED');
          console.warn('⚠️  No email service is enabled. Please configure one:');
          console.log('\n1️⃣  OPTION 1: Use Firebase Cloud Function (Recommended)');
          console.log('   - Set firebaseCloudFunction.enabled = true');
          console.log('   - Deploy a Cloud Function to send emails');
          console.log('   - Update the URL with your actual function');
          console.log('\n2️⃣  OPTION 2: Use EmailJS');
          console.log('   - Check if EmailJS CDN is loading');
          console.log('   - Currently:', typeof emailjs !== 'undefined' ? '✓ Loaded' : '✗ Not loaded');
          console.log('   - Check firewall/proxy/CDN blocks');
          console.log('\n3️⃣  OPTION 3: Use Custom Backend');
          console.log('   - Set up your own email API endpoint');
          console.log('   - Set customBackend.enabled = true');
          console.log('   - Update customBackend.url');
          console.log('\n💡 For now, you can still test by checking the console logs above.');
          return { success: false, reason: 'no_service_configured' };
        }

        console.log(`\n🔄 ATTEMPTING ${methods.length} METHOD(S): ${methods.join(', ')}`);
        
        // Try each method
        for (const method of methods) {
          console.log(`\n  ▶️  Trying: ${method}...`);
          let result;
          
          if (method === 'firebase') {
            result = await this.sendViaFirebaseCloudFunction(order, user, items);
          } else if (method === 'emailjs') {
            result = await this.sendViaEmailJS(order, user, items);
          } else if (method === 'custom') {
            result = await this.sendViaCustomBackend(order, user, items);
          } else if (method === 'console') {
            result = await this.sendViaConsoleLogging(order, user, items);
          }

          if (result.success) {
            console.log('\n✅ SUCCESS ✅');
            console.log('Email sent successfully via:', method.toUpperCase());
            return result;
          } else {
            console.log(`  ✗ ${method} failed:`, result.reason || result.error);
          }
        }

        // All methods failed
        console.warn('\n❌ ALL METHODS FAILED');
        console.warn('⚠️  All attempted email methods failed. Storing for later retry.');
        console.log('\nMethods tried:', methods.join(', '));
        this.storeForRetry(order, user, items);
        return { success: false, reason: 'all_methods_failed', methods_tried: methods };

      } catch (error) {
        console.error('Fatal error in sendOrderConfirmation:', error);
        return { success: false, error: error.message };
      }
    },

    /**
     * Store failed email for retry later
     */
    storeForRetry(order, user, items) {
      try {
        const pendingEmails = JSON.parse(localStorage.getItem('pendingOrderEmails') || '[]');
        pendingEmails.push({
          order,
          user,
          items,
          timestamp: new Date().toISOString(),
          retries: 0,
        });
        localStorage.setItem('pendingOrderEmails', JSON.stringify(pendingEmails));
        console.log('Stored email for retry. Total pending:', pendingEmails.length);
      } catch (error) {
        console.error('Error storing email for retry:', error);
      }
    },

    /**
     * Send shipment notification email
     * @param {object} order - Order data
     * @param {object} user - User data (email, name, etc.)
     * @param {string} trackingNumber - Shipment tracking number
     */
    async sendShipmentEmail(order, user, trackingNumber) {
      try {
        console.log('📧 Sending shipment email...');

        const templateParams = {
          to_email: user.email,
          customer_name: user.displayName || user.name || 'Valued Customer',
          order_id: order.id,
          tracking_number: trackingNumber,
          estimated_delivery: order.estimatedDelivery || 'N/A',
        };

        if (this.config.emailjs.enabled && typeof emailjs !== 'undefined') {
          const response = await emailjs.send(
            this.config.emailjs.serviceId,
            'template_shipment_notification', // configure this template in EmailJS dashboard
            templateParams
          );
          console.log('✅ Shipment email sent via EmailJS:', response);
          return { success: true, method: 'emailjs', response };
        }

        // Fallback: log to console
        console.log('📦 SHIPMENT NOTIFICATION (no email service active)');
        console.log('  To:', user.email);
        console.log('  Order:', order.id);
        console.log('  Tracking:', trackingNumber);
        return { success: false, reason: 'no_service_configured' };
      } catch (error) {
        console.error('❌ Error sending shipment email:', error);
        return { success: false, error: error.message };
      }
    },

    /**
     * Retry pending emails
     */
    async retryPendingEmails() {
      try {
        const pendingEmails = JSON.parse(localStorage.getItem('pendingOrderEmails') || '[]');
        if (pendingEmails.length === 0) return;

        console.log(`Retrying ${pendingEmails.length} pending emails...`);

        const remaining = [];
        for (const item of pendingEmails) {
          if (item.retries >= 3) {
            console.warn('Max retries exceeded for order:', item.order.id);
            continue;
          }

          const result = await this.sendOrderConfirmation(item.order, item.user, item.items);
          if (!result.success) {
            item.retries++;
            remaining.push(item);
          }
        }

        if (remaining.length > 0) {
          localStorage.setItem('pendingOrderEmails', JSON.stringify(remaining));
        } else {
          localStorage.removeItem('pendingOrderEmails');
        }

        console.log(`✓ Retry complete. ${remaining.length} still pending.`);
      } catch (error) {
        console.error('Error retrying pending emails:', error);
      }
    }
  };

  // Make available globally
  window.EmailService = EmailService;
  
  // Initialize EmailJS asynchronously
  console.log('📧 Initializing EmailService...');
  (async () => {
    try {
      // Check if EmailJS is available
      let emailJSAvailable = typeof emailjs !== 'undefined';
      
      if (!emailJSAvailable) {
        // Wait a bit for it to load
        console.log('⏳ Waiting for EmailJS CDN to load...');
        for (let i = 0; i < 20; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          if (typeof emailjs !== 'undefined') {
            emailJSAvailable = true;
            console.log('✓ EmailJS loaded from CDN');
            break;
          }
        }
      }

      // If EmailJS is still not available, auto-switch to Firebase
      if (!emailJSAvailable) {
        console.warn('⚠️  EmailJS CDN not loading');
        console.log('\n🔧 SWITCHING TO FALLBACK MODE:');
        
        // Check if Firebase URL looks valid
        const firebaseUrl = EmailService.config.firebaseCloudFunction.url;
        const isValidFirebaseUrl = firebaseUrl && firebaseUrl.includes('cloudfunctions.net');
        
        if (isValidFirebaseUrl) {
          console.log('✓ Firebase Cloud Function URL is configured');
          EmailService.config.emailjs.enabled = false;
          EmailService.config.firebaseCloudFunction.enabled = true;
          console.log('✓ Switched to Firebase Cloud Function for email delivery');
        } else {
          console.warn('⚠️  Firebase URL not configured (looks like placeholder)');
          console.log('ℹ️  Enabling console logging mode as fallback');
          console.log('   Emails will be logged to console and localStorage');
          
          // Enable console logging fallback
          EmailService.config.emailjs.enabled = false;
          EmailService.config.firebaseCloudFunction.enabled = false;
          EmailService.consoleLoggingEnabled = true;
          
          console.log('\n📝 To enable email sending:');
          console.log('1. Set up Firebase Cloud Function and update URL');
          console.log('2. Fix EmailJS CDN loading issue');
          console.log('3. Or use custom backend API');
        }
        
        window.addEventListener('error', function(event) {
          if (event.message && event.message.includes('emailjs')) {
            console.log('ℹ️  emails will use Firebase Cloud Function instead');
          }
        });
      } else {
        const initialized = await EmailService.initEmailJS();
        if (initialized) {
          console.log('✅ EmailService ready - emails via EmailJS');
        }
      }
    } catch (error) {
      console.warn('⚠️  Error during EmailService initialization:', error.message);
      console.log('   Switching to Firebase Cloud Function...');
      EmailService.config.emailjs.enabled = false;
      EmailService.config.firebaseCloudFunction.enabled = true;
    }
  })();

  console.log('✓ email.js loaded - EmailService ready');

})();
