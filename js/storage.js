/* js/storage.js */

const StorageKeys = {
  CART: 'flavornest_cart',
  WISHLIST: 'flavornest_wishlist',
  CURRENT_PRODUCT: 'flavornest_current_product_id',
  COUPON: 'flavornest_applied_coupon'
};

const Storage = {
  getCart() {
    try {
      const cart = localStorage.getItem(StorageKeys.CART);
      return cart ? JSON.parse(cart) : [];
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
      return [];
    }
  },

  saveCart(cart) {
    try {
      localStorage.setItem(StorageKeys.CART, JSON.stringify(cart));
      // Dispatch a custom event to notify other modules
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  },

  getWishlist() {
    try {
      const wishlist = localStorage.getItem(StorageKeys.WISHLIST);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (e) {
      console.error('Error loading wishlist', e);
      return [];
    }
  },

  saveWishlist(wishlist) {
    try {
      localStorage.setItem(StorageKeys.WISHLIST, JSON.stringify(wishlist));
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: wishlist }));
    } catch (e) {
      console.error('Error saving wishlist', e);
    }
  },

  setProductDetailId(id) {
    localStorage.setItem(StorageKeys.CURRENT_PRODUCT, id);
  },

  getProductDetailId() {
    return localStorage.getItem(StorageKeys.CURRENT_PRODUCT) || '1';
  },

  saveAppliedCoupon(coupon) {
    if (coupon) {
      localStorage.setItem(StorageKeys.COUPON, JSON.stringify(coupon));
    } else {
      localStorage.removeItem(StorageKeys.COUPON);
    }
    window.dispatchEvent(new CustomEvent('couponUpdated'));
  },

  getAppliedCoupon() {
    const coupon = localStorage.getItem(StorageKeys.COUPON);
    return coupon ? JSON.parse(coupon) : null;
  }
};

// Export to window object for global availability
window.Storage = Storage;
