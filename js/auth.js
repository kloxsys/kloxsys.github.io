/**
 * KLOX SYSTEMS - AUTH SERVICE (Firebase)
 * Production-ready Google & email/password authentication wrapper.
 *
 * NOTE: You must replace CONFIG.firebase placeholders in config/data.js
 * with your real Firebase project credentials.
 */

(function () {
  if (typeof CONFIG === 'undefined') {
    console.error('CONFIG not loaded before auth.js');
    return;
  }

  const firebaseConfig = CONFIG.firebase;

  if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_FIREBASE_API_KEY') {
    console.warn(
      'Firebase config is not set. AuthService will be disabled until you configure CONFIG.firebase in config/data.js'
    );
  }

  let app = null;
  let auth = null;

  function init() {
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK not loaded. Make sure firebase-app-compat.js and firebase-auth-compat.js are included.');
      return;
    }

    if (!app) {
      try {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        console.log('Firebase initialized');
      } catch (error) {
        console.error('Failed to initialize Firebase app', error);
      }
    }
  }

  function ensureAuth() {
    if (!auth) {
      init();
    }
    return auth;
  }

  const AuthService = {
    init,

    /**
     * Subscribe to auth state changes
     */
    onAuthStateChanged(callback) {
      const a = ensureAuth();
      if (!a) return () => {};
      return a.onAuthStateChanged(callback);
    },

    /**
     * Sign in with Google using a popup
     */
    async signInWithGoogle() {
      const a = ensureAuth();
      if (!a) throw new Error('Auth not initialized');
      const provider = new firebase.auth.GoogleAuthProvider();
      return a.signInWithPopup(provider);
    },

    /**
     * Sign out current user
     */
    async signOut() {
      const a = ensureAuth();
      if (!a) throw new Error('Auth not initialized');
      return a.signOut();
    },

    /**
     * Sign up with email and password
     */
    async signUpWithEmail(name, email, password) {
      const a = ensureAuth();
      if (!a) throw new Error('Auth not initialized');
      const result = await a.createUserWithEmailAndPassword(email, password);
      if (name) {
        await result.user.updateProfile({ displayName: name });
      }
      return result;
    },

    /**
     * Sign in with email and password
     */
    async signInWithEmail(email, password) {
      const a = ensureAuth();
      if (!a) throw new Error('Auth not initialized');
      return a.signInWithEmailAndPassword(email, password);
    },
  };

  window.AuthService = AuthService;
})();

