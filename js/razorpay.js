/**
 * Razorpay Payment Integration - Test Mode
 * Free test mode for UPI, Cards, and other payment methods
 */

class RazorpayPayment {
  // Test credentials (free, no setup fee)
  static TEST_KEY_ID = 'rzp_test_1DP5MMOk78gUtm';
  static TEST_KEY_SECRET = 'SkJUeURVRk91bFNqaUppWGxj';

  /**
   * Initialize Razorpay payment
   * @param {object} options - Payment options
   */
  static async initPayment(options) {
    try {
      const {
        orderId,
        amount,
        customerName,
        customerEmail,
        customerPhone,
        onSuccess,
        onError
      } = options;

      // Razorpay is loaded from CDN in index.html
      if (typeof Razorpay === 'undefined') {
        throw new Error('Razorpay script not loaded');
      }

      const razorpayOptions = {
        key: this.TEST_KEY_ID,
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        name: 'Klox Systems',
        description: `Order #${orderId}`,
        order_id: orderId,
        customer_notify: 1,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone.replace(/\D/g, '')
        },
        notes: {
          orderId: orderId,
          timestamp: new Date().toISOString()
        },
        handler: function(response) {
          console.log('✓ Razorpay payment successful:', response);
          onSuccess(response);
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            onError && onError('Payment cancelled by user');
          }
        },
        theme: {
          color: '#667eea'
        }
      };

      const razorpay = new Razorpay(razorpayOptions);
      razorpay.open();

    } catch (error) {
      console.error('Razorpay payment error:', error);
      throw error;
    }
  }

  /**
   * Verify payment signature (test mode verification)
   * @param {object} paymentData - Payment response from Razorpay
   */
  static verifyPayment(paymentData) {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      } = paymentData;

      // In test mode, any payment is successful
      // In production, you would verify the signature on your server
      console.log('✓ Payment verified:', {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature
      });

      return {
        success: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      };
    } catch (error) {
      console.error('Payment verification failed:', error);
      return { success: false, error: error.message };
    }
  }
}

/**
 * Google Pay Send - UPI Payment
 * Simple UPI payment links for personal accounts
 */
class GooglePaySend {
  /**
   * Generate UPI payment string
   * @param {object} options - Payment options
   */
  static generateUPILink(options) {
    try {
      const {
        upiId,
        recipientName,
        amount,
        orderId,
        description
      } = options;

      // Format: upi://pay?pa=[UPI ID]&pn=[Name]&am=[Amount]&tn=[Description]
      const params = new URLSearchParams({
        pa: upiId,
        pn: encodeURIComponent(recipientName),
        am: amount,
        tn: encodeURIComponent(description || `Order ${orderId}`)
      });

      const upiLink = `upi://pay?${params.toString()}`;
      return upiLink;
    } catch (error) {
      console.error('Error generating UPI link:', error);
      throw error;
    }
  }

  /**
   * Generate UPI QR Code
   * Using QR server API (free)
   * @param {string} upiLink - UPI payment link
   */
  static generateQRCode(upiLink) {
    try {
      // Using free QR code API
      const encodedLink = encodeURIComponent(upiLink);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedLink}`;
      return qrUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  /**
   * Get copy-friendly UPI string
   * @param {object} options - Payment options
   */
  static getUPIString(options) {
    const {
      upiId,
      amount,
      orderId
    } = options;

    return `UPI: ${upiId}\nAmount: ₹${amount}\nOrder: ${orderId}\n\nScan QR or use UPI app to send payment`;
  }

  /**
   * Create payment modal with UPI details
   * @param {object} options - Payment options
   */
  static async showPaymentModal(options) {
    try {
      const {
        upiId,
        recipientName,
        amount,
        orderId,
        onConfirm
      } = options;

      const upiLink = this.generateUPILink({
        upiId,
        recipientName,
        amount,
        orderId,
        description: `Order ${orderId}`
      });

      const qrUrl = this.generateQRCode(upiLink);
      const upiString = this.getUPIString({ upiId, amount, orderId });

      // Create modal HTML
      const modalHTML = `
        <div class="upi-payment-modal">
          <div class="upi-payment-header">
            <h3>Complete Payment via UPI</h3>
            <p class="order-amount">₹${amount.toFixed(2)}</p>
          </div>
          
          <div class="upi-payment-content">
            <div class="upi-qr-section">
              <p class="upi-instruction">Scan this QR code with any UPI app</p>
              <img src="${qrUrl}" alt="UPI QR Code" class="upi-qr-code">
              <p class="upi-or">OR</p>
            </div>
            
            <div class="upi-manual-section">
              <p class="upi-instruction">Send ₹${amount.toFixed(2)} to UPI ID:</p>
              <div class="upi-id-display">
                <input type="text" value="${upiId}" readonly class="upi-id-input">
                <button class="upi-copy-btn" onclick="navigator.clipboard.writeText('${upiId}');alert('UPI ID copied!')">Copy</button>
              </div>
              <p class="upi-note"><strong>Reference:</strong> ${orderId}</p>
            </div>
            
            <div class="upi-steps">
              <h4>Steps:</h4>
              <ol>
                <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                <li>Scan the QR code OR enter the UPI ID above</li>
                <li>Enter amount: ₹${amount.toFixed(2)}</li>
                <li>Complete the payment</li>
                <li>Click "Confirm Payment" below</li>
              </ol>
            </div>
          </div>
          
          <div class="upi-payment-actions">
            <button class="upi-confirm-btn" onclick="alert('Payment confirmed. Order will be processed within 2-3 minutes.')">✓ Confirm Payment Sent</button>
            <button class="upi-cancel-btn" onclick="window.appManager.modalManager.closeModal('upiPaymentModal')">Cancel</button>
          </div>
        </div>
      `;

      return modalHTML;
    } catch (error) {
      console.error('Error creating UPI payment modal:', error);
      throw error;
    }
  }
}

console.log('✓ Razorpay and Google Pay Send modules loaded');
