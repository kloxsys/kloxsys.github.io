/**
 * KLOX SYSTEMS - APPLICATION REFRESH & RESET
 * Complete application state clearing and reinitialization
 * 
 * Usage: Call refreshApplicationState() to completely reset the application
 */

const ApplicationRefresh = {
  /**
   * Clear all browser storage
   */
  clearStorage() {
    try {
      console.log('Clearing localStorage...');
      localStorage.clear();
      console.log('Clearing sessionStorage...');
      sessionStorage.clear();
      console.log('✓ Storage cleared');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  /**
   * Clear all cookies
   */
  clearCookies() {
    try {
      console.log('Clearing cookies...');
      document.cookie.split(';').forEach((c) => {
        const cookieName = c.split('=')[0].trim();
        document.cookie = `${cookieName}=;max-age=-99999999;`;
      });
      console.log('✓ Cookies cleared');
    } catch (error) {
      console.error('Error clearing cookies:', error);
    }
  },

  /**
   * Sign out current user
   */
  async signOutUser() {
    try {
      console.log('Signing out user...');
      if (typeof AuthService !== 'undefined' && AuthService.signOut) {
        await AuthService.signOut();
        console.log('✓ User signed out');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  },

  /**
   * Close all open modals
   */
  closeAllModals() {
    try {
      console.log('Closing all modals...');
      const modals = document.querySelectorAll('.modal');
      modals.forEach((modal) => {
        modal.style.display = 'none';
        modal.classList.remove('show');
      });
      console.log(`✓ Closed ${modals.length} modals`);
    } catch (error) {
      console.error('Error closing modals:', error);
    }
  },

  /**
   * Reset all form inputs
   */
  resetAllForms() {
    try {
      console.log('Resetting all forms...');
      const forms = document.querySelectorAll('form');
      forms.forEach((form) => {
        form.reset();
      });
      console.log(`✓ Reset ${forms.length} forms`);
    } catch (error) {
      console.error('Error resetting forms:', error);
    }
  },

  /**
   * Clear cart and checkout state
   */
  clearCartState() {
    try {
      console.log('Clearing cart state...');
      if (typeof window.cart !== 'undefined') {
        window.cart = [];
      }
      if (typeof window.cartTotal !== 'undefined') {
        window.cartTotal = 0;
      }
      if (typeof window.cartCount !== 'undefined') {
        window.cartCount = 0;
      }
      console.log('✓ Cart state cleared');
    } catch (error) {
      console.error('Error clearing cart state:', error);
    }
  },

  /**
   * Reset global state variables
   */
  resetGlobalState() {
    try {
      console.log('Resetting global state...');
      
      // Reset user state
      window.currentUser = null;
      window.currentUserProfile = null;
      
      // Reset modal manager
      if (typeof ModalManager !== 'undefined') {
        window.modalManager = new ModalManager();
      }
      
      // Reset UI state
      window.activeTab = null;
      window.currentPage = 'home';
      window.scrollPosition = 0;
      
      console.log('✓ Global state reset');
    } catch (error) {
      console.error('Error resetting global state:', error);
    }
  },

  /**
   * Force scroll to top
   */
  scrollToTop() {
    try {
      console.log('Scrolling to top...');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      console.log('✓ Scrolled to top');
    } catch (error) {
      console.error('Error scrolling to top:', error);
    }
  },

  /**
   * Reload page content
   */
  async reloadPageContent() {
    try {
      console.log('Reloading page content...');
      if (typeof initializePage === 'function') {
        initializePage();
        console.log('✓ Page content reloaded');
      }
    } catch (error) {
      console.error('Error reloading page content:', error);
    }
  },

  /**
   * Clear IndexedDB if used
   */
  async clearIndexedDB() {
    try {
      console.log('Clearing IndexedDB...');
      const databases = await indexedDB.databases?.();
      if (databases && Array.isArray(databases)) {
        databases.forEach((db) => {
          indexedDB.deleteDatabase(db.name);
        });
        console.log(`✓ Cleared ${databases.length} IndexedDB databases`);
      }
    } catch (error) {
      console.warn('IndexedDB not available or error occurred:', error);
    }
  },

  /**
   * Remove all event listeners
   * NOTE: Cloning and replacing every DOM element to strip listeners is
   * destructive — it breaks all JS object references and can crash the app.
   * Event listeners are automatically released on page reload, so this
   * method is a no-op for safety. Call hardRefresh() if a full reset is needed.
   */
  clearEventListeners() {
    console.log('ℹ️  clearEventListeners skipped — use hardRefresh() for a full reset');
  },

  /**
   * Complete application refresh
   */
  async refreshApplicationState(skipPageReload = false) {
    console.clear();
    console.log('========================================');
    console.log('🔄 KLOX SYSTEMS - APPLICATION REFRESH');
    console.log('========================================');
    console.log('Starting complete refresh...\n');

    try {
      // Phase 1: Clear authentication
      await this.signOutUser();

      // Phase 2: Clear storage
      this.clearStorage();
      this.clearCookies();

      // Phase 3: Clear UI
      this.closeAllModals();
      this.resetAllForms();

      // Phase 4: Reset state
      this.resetGlobalState();
      this.clearCartState();

      // Phase 5: Clear databases
      await this.clearIndexedDB();

      // Phase 6: Reset position
      this.scrollToTop();

      // Phase 7: Reload content
      if (!skipPageReload) {
        await this.reloadPageContent();
      }

      console.log('\n========================================');
      console.log('✅ APPLICATION REFRESH COMPLETE');
      console.log('========================================');
      console.log('All application state has been cleared.');
      console.log('Please refresh the page manually if needed.\n');

      return { success: true, message: 'Application refresh completed' };
    } catch (error) {
      console.error('\n❌ ERROR DURING REFRESH:', error);
      return { success: false, message: `Refresh failed: ${error.message}` };
    }
  },

  /**
   * Hard refresh - requires page reload
   */
  hardRefresh() {
    console.log('🔄 Performing hard refresh - reloading page...');
    localStorage.clear();
    sessionStorage.clear();
    location.reload(); // forceGet parameter was deprecated and is ignored in modern browsers
  },

  /**
   * Soft refresh - no page reload
   */
  async softRefresh() {
    return await this.refreshApplicationState(true);
  },
};

/**
 * Global convenience function
 */
async function refreshApplicationState(hardMode = false) {
  if (hardMode) {
    return ApplicationRefresh.hardRefresh();
  }
  return await ApplicationRefresh.refreshApplicationState();
}

/**
 * Soft refresh convenience function
 */
async function softRefreshApp() {
  return await ApplicationRefresh.softRefresh();
}

console.log('✓ refresh.js loaded - use refreshApplicationState() or softRefreshApp() to refresh');
