/**
 * KLOX SYSTEMS - BACKEND SERVICES
 * Handles data persistence, order management, cart operations, and business logic
 * 
 * In production, these would connect to a real backend API
 */

// ============================================
// DATABASE STORAGE KEYS
// ============================================
const DB_KEYS = {
  orders: 'klox_orders',
  cart: 'klox_cart',
  users: 'klox_users',
  addresses: 'klox_addresses',
  payments: 'klox_payments',
};

// ============================================
// ORDER SERVICE
// ============================================
const OrderService = {
  /**
   * Create new order
   */
  createOrder(userId, orderData) {
    try {
      const orders = this.getAllOrders();
      const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
      
      const order = {
        id: orderId,
        userId,
        items: orderData.items,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        shipping: orderData.shipping,
        total: orderData.total,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        paymentMethod: orderData.paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: this.calculateEstimatedDelivery(),
        trackingNumber: null,
      };

      orders.push(order);
      Storage.set(DB_KEYS.orders, JSON.stringify(orders));
      Logger.info('Order created', { orderId });
      
      return order;
    } catch (error) {
      Logger.error('Error creating order', error);
      throw error;
    }
  },

  /**
   * Get user orders
   */
  getUserOrders(userId) {
    try {
      const orders = this.getAllOrders();
      return orders.filter(order => order.userId === userId);
    } catch (error) {
      Logger.error('Error getting user orders', error);
      return [];
    }
  },

  /**
   * Get order by ID
   */
  getOrder(orderId) {
    try {
      const orders = this.getAllOrders();
      return orders.find(order => order.id === orderId);
    } catch (error) {
      Logger.error('Error getting order', error);
      return null;
    }
  },

  /**
   * Update order status
   */
  updateOrderStatus(orderId, status) {
    try {
      const orders = this.getAllOrders();
      const order = orders.find(o => o.id === orderId);
      
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
        
        // Auto-generate tracking when shipped
        if (status === 'shipped' && !order.trackingNumber) {
          order.trackingNumber = 'TRACK-' + Math.random().toString(36).substr(2, 10).toUpperCase();
        }
        
        Storage.set(DB_KEYS.orders, JSON.stringify(orders));
        Logger.info('Order status updated', { orderId, status });
        return order;
      }
      return null;
    } catch (error) {
      Logger.error('Error updating order status', error);
      return null;
    }
  },

  /**
   * Get all orders (admin)
   */
  getAllOrders() {
    try {
      const data = Storage.get(DB_KEYS.orders);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      Logger.error('Error getting all orders', error);
      return [];
    }
  },

  /**
   * Calculate estimated delivery date
   */
  calculateEstimatedDelivery() {
    const date = new Date();
    date.setDate(date.getDate() + 5); // 5 business days
    return date.toISOString().split('T')[0];
  },

  /**
   * Cancel order
   */
  cancelOrder(orderId) {
    try {
      const order = this.getOrder(orderId);
      if (order && ['pending', 'processing'].includes(order.status)) {
        return this.updateOrderStatus(orderId, 'cancelled');
      }
      return null;
    } catch (error) {
      Logger.error('Error cancelling order', error);
      return null;
    }
  },
};

// ============================================
// PAYMENT SERVICE
// ============================================
const PaymentService = {
  /**
   * Process payment
   */
  processPayment(paymentData) {
    try {
      const payment = {
        id: 'PAY-' + Date.now(),
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        method: paymentData.method,
        status: 'completed', // In production, connect to payment gateway
        transactionId: 'TXN-' + Math.random().toString(36).substr(2, 12).toUpperCase(),
        timestamp: new Date().toISOString(),
      };

      const payments = this.getAllPayments();
      payments.push(payment);
      Storage.set(DB_KEYS.payments, JSON.stringify(payments));
      
      Logger.info('Payment processed', { paymentId: payment.id, amount: payment.amount });
      return payment;
    } catch (error) {
      Logger.error('Error processing payment', error);
      throw error;
    }
  },

  /**
   * Get order payment
   */
  getOrderPayment(orderId) {
    try {
      const payments = this.getAllPayments();
      return payments.find(p => p.orderId === orderId);
    } catch (error) {
      Logger.error('Error getting order payment', error);
      return null;
    }
  },

  /**
   * Get all payments
   */
  getAllPayments() {
    try {
      const data = Storage.get(DB_KEYS.payments);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Refund payment
   */
  refundPayment(paymentId, amount) {
    try {
      const payments = this.getAllPayments();
      const payment = payments.find(p => p.id === paymentId);
      
      if (payment) {
        payment.status = 'refunded';
        payment.refundedAmount = amount;
        payment.refundedAt = new Date().toISOString();
        Storage.set(DB_KEYS.payments, JSON.stringify(payments));
        
        Logger.info('Payment refunded', { paymentId, amount });
        return payment;
      }
      return null;
    } catch (error) {
      Logger.error('Error refunding payment', error);
      return null;
    }
  },
};

// ============================================
// INVENTORY SERVICE
// ============================================
const InventoryService = {
  /**
   * Get product stock
   */
  getStock(productId) {
    try {
      // In production, connect to inventory database
      const defaultStock = {
        'agni-512': 50,
        'agni-1024': 30,
        'agni-2048': 20,
      };
      return defaultStock[productId] || 0;
    } catch (error) {
      Logger.error('Error getting stock', error);
      return 0;
    }
  },

  /**
   * Check stock availability
   */
  isAvailable(productId, quantity = 1) {
    const stock = this.getStock(productId);
    return stock >= quantity;
  },

  /**
   * Reserve inventory for order
   */
  reserveInventory(orderId, items) {
    try {
      // In production, this would update the inventory database
      for (const item of items) {
        const stock = this.getStock(item.id);
        if (stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }
      }
      
      Logger.info('Inventory reserved', { orderId, items: items.length });
      return true;
    } catch (error) {
      Logger.error('Error reserving inventory', error);
      throw error;
    }
  },

  /**
   * Release reserved inventory
   */
  releaseInventory(orderId) {
    try {
      // In production, return inventory to available stock
      Logger.info('Inventory released', { orderId });
      return true;
    } catch (error) {
      Logger.error('Error releasing inventory', error);
      return false;
    }
  },
};

// ============================================
// NOTIFICATION SERVICE
// ============================================
const NotificationService = {
  /**
   * Send order confirmation
   */
  sendOrderConfirmation(order, userEmail) {
    try {
      const notification = {
        id: 'NOTIF-' + Date.now(),
        type: 'order_confirmation',
        orderId: order.id,
        email: userEmail,
        subject: `Order Confirmation - ${order.id}`,
        message: `Your order has been confirmed. You will receive tracking information shortly.`,
        status: 'sent',
        timestamp: new Date().toISOString(),
      };
      
      Logger.info('Order confirmation sent', { orderId: order.id, email: userEmail });
      return notification;
    } catch (error) {
      Logger.error('Error sending order confirmation', error);
      return null;
    }
  },

  /**
   * Send shipment notification
   */
  sendShipmentNotification(order, trackingNumber) {
    try {
      const notification = {
        id: 'NOTIF-' + Date.now(),
        type: 'shipment',
        orderId: order.id,
        trackingNumber,
        subject: `Your order is on the way - ${trackingNumber}`,
        message: `Your order ${order.id} has been shipped. Track your package here.`,
        status: 'sent',
        timestamp: new Date().toISOString(),
      };
      
      Logger.info('Shipment notification sent', { orderId: order.id, trackingNumber });
      return notification;
    } catch (error) {
      Logger.error('Error sending shipment notification', error);
      return null;
    }
  },

  /**
   * Send delivery notification
   */
  sendDeliveryNotification(order) {
    try {
      const notification = {
        id: 'NOTIF-' + Date.now(),
        type: 'delivery',
        orderId: order.id,
        subject: `Order delivered - ${order.id}`,
        message: `Your order has been delivered. Thank you for your purchase!`,
        status: 'sent',
        timestamp: new Date().toISOString(),
      };
      
      Logger.info('Delivery notification sent', { orderId: order.id });
      return notification;
    } catch (error) {
      Logger.error('Error sending delivery notification', error);
      return null;
    }
  },
};

// ============================================
// CART SERVICE (Enhanced)
// ============================================
const CartServiceBackend = {
  /**
   * Validate cart before checkout
   */
  validateCart(cartItems) {
    try {
      for (const item of cartItems) {
        if (!InventoryService.isAvailable(item.id, item.quantity)) {
          return {
            valid: false,
            error: `${item.name} is out of stock. Only ${InventoryService.getStock(item.id)} available.`,
          };
        }
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  },

  /**
   * Calculate shipping cost
   */
  calculateShipping(address, items) {
    try {
      const baseShipping = 5;
      const distanceFactor = address.country !== 'US' ? 1.5 : 1;
      const weightFactor = items.length * 0.5;
      
      return Math.round((baseShipping + weightFactor) * distanceFactor * 100) / 100;
    } catch (error) {
      Logger.error('Error calculating shipping', error);
      return 5;
    }
  },

  /**
   * Calculate tax
   */
  calculateTax(subtotal, address) {
    try {
      const taxRates = {
        'US': 0.08,
        'CA': 0.13,
        'UK': 0.20,
        'IN': 0.18,
      };
      
      const rate = taxRates[address.country] || 0;
      return Math.round(subtotal * rate * 100) / 100;
    } catch (error) {
      return 0;
    }
  },
};
