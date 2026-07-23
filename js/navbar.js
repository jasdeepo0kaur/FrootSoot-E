/* js/navbar.js */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.navbar-header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  // 1. Scroll effect on navbar
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger immediately in case page loads scrolled

  // 2. Mobile Menu Toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Morph hamburger menu icon between bars and times if we want
      if (navLinks.classList.contains('active')) {
        mobileToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
      } else {
        mobileToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        `;
      }
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        `;
      });
    });
  }

  // 3. Highlight Active Link based on pathname
  const highlightActiveLink = () => {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-link');
    
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      // If it's index or home page
      if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('frootsoot%20e/') || currentPath.endsWith('frootsoot/')) {
        if (href === 'index.html' || href === '../index.html') {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      } else {
        // Match path suffix (e.g. pages/menu.html)
        if (currentPath.includes(href) && href !== 'index.html' && href !== '../index.html') {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      }
    });
  };
  highlightActiveLink();

  // 4. Update Badge Counts
  const updateBadges = () => {
    const cartBadge = document.querySelector('.cart-badge');
    const wishlistBadge = document.querySelector('.wishlist-badge');
    
    if (cartBadge) {
      const cart = window.Storage ? window.Storage.getCart() : [];
      const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartBadge.textContent = totalQty;
      cartBadge.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    if (wishlistBadge) {
      const wishlist = window.Storage ? window.Storage.getWishlist() : [];
      wishlistBadge.textContent = wishlist.length;
      wishlistBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
  };

  updateBadges();

  // Listen to Storage update events
  window.addEventListener('cartUpdated', updateBadges);
  window.addEventListener('wishlistUpdated', updateBadges);
});
