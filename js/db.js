/**
 * KLOX SYSTEMS - DATABASE SERVICE (Firestore)
 * Stores user profile, addresses, and orders in Firestore instead of localStorage.
 */

(function () {
  if (typeof CONFIG === 'undefined') {
    console.error('CONFIG not loaded before db.js');
    return;
  }

  let db = null;

  function init() {
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK not loaded for Firestore. Make sure firestore-compat.js is included.');
      return;
    }
    if (!db) {
      try {
        // Reuse initialized app from auth.js
        db = firebase.firestore();
        console.log('Firestore initialized');
      } catch (error) {
        console.error('Failed to initialize Firestore', error);
      }
    }
  }

  function ensureDb() {
    if (!db) {
      init();
    }
    return db;
  }

  const DbService = {
    init,

    /**
     * Load user profile document from Firestore
     */
    async getUserProfile(uid) {
      const database = ensureDb();
      if (!database || !uid) return null;
      const docRef = database.collection('users').doc(uid);
      const snap = await docRef.get();
      return snap.exists ? snap.data() : null;
    },

    /**
     * Save/merge user profile document
     */
    async saveUserProfile(uid, profile) {
      const database = ensureDb();
      if (!database || !uid) return;
      const docRef = database.collection('users').doc(uid);
      await docRef.set(profile, { merge: true });
    },

    /**
     * Add address under user document (subcollection)
     */
    async addAddress(uid, addressData) {
      const database = ensureDb();
      if (!database || !uid) return null;
      const colRef = database.collection('users').doc(uid).collection('addresses');
      const docRef = await colRef.add({
        ...addressData,
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...addressData };
    },

    /**
     * Delete address document
     */
    async deleteAddress(uid, addressId) {
      const database = ensureDb();
      if (!database || !uid || !addressId) return;
      const docRef = database.collection('users').doc(uid).collection('addresses').doc(addressId);
      await docRef.delete();
    },

    /**
     * Get all addresses for a user
     */
    async getAddresses(uid) {
      const database = ensureDb();
      if (!database || !uid) return [];
      const snap = await database.collection('users').doc(uid).collection('addresses').get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },

    /**
     * Add order under user document (subcollection)
     */
    async addOrder(uid, orderData) {
      const database = ensureDb();
      if (!database || !uid) return null;
      const colRef = database.collection('users').doc(uid).collection('orders');
      const docRef = await colRef.add({
        ...orderData,
        status: orderData.status || 'pending',
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...orderData };
    },

    /**
     * Get all orders for a user
     */
    async getOrders(uid) {
      const database = ensureDb();
      if (!database || !uid) return [];
      const snap = await database
        .collection('users')
        .doc(uid)
        .collection('orders')
        .orderBy('createdAt', 'desc')
        .get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  };

  window.DbService = DbService;
})();

