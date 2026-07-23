/* js/wishlist.js */

const Wishlist = {
  toggle(productId, btnEl = null) {
    const p = window.Products ? window.Products.getById(productId) : null;
    if (!p) return;

    let wishlist = window.Storage ? window.Storage.getWishlist() : [];
    const index = wishlist.indexOf(productId);
    let added = false;

    if (index > -1) {
      wishlist.splice(index, 1);
      if (btnEl) btnEl.classList.remove('active');
      if (window.Toast) window.Toast.show(`Removed ${p.name} from wishlist.`, 'info');
    } else {
      wishlist.push(productId);
      added = true;
      if (btnEl) {
        btnEl.classList.add('active');
        // Simple micro-bounce trigger
        btnEl.style.transform = 'scale(1.3)';
        setTimeout(() => {
          btnEl.style.transform = '';
        }, 300);
      }
      if (window.Toast) window.Toast.show(`Added ${p.name} to wishlist!`, 'success');
    }

    if (window.Storage) window.Storage.saveWishlist(wishlist);
    return added;
  },

  contains(productId) {
    const wishlist = window.Storage ? window.Storage.getWishlist() : [];
    return wishlist.includes(productId);
  }
};

window.Wishlist = Wishlist;
