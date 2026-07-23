/* js/app.js */

document.addEventListener('DOMContentLoaded', () => {
  // Central Page Router Logic
  const path = window.location.pathname;
  
  if (path.endsWith('index.html') || path === '/' || path.endsWith('frootsoot%20e/') || path.endsWith('frootsoot/')) {
    initHomePage();
  } else if (path.includes('menu.html')) {
    initMenuPage();
  } else if (path.includes('product.html')) {
    initProductDetailPage();
  } else if (path.includes('cart.html')) {
    initCartPage();
  } else if (path.includes('checkout.html')) {
    initCheckoutPage();
  } else if (path.includes('profile.html')) {
    initProfilePage();
  } else if (path.includes('offers.html')) {
    if (typeof initOffersPage === 'function') {
      initOffersPage();
    }
  }

  // Common bindings across all pages (Newsletter & Scroll Top)
  initCommonBindings();
});

// --- HOME PAGE LOGIC ---
function initHomePage() {
  // Render Featured Products (first 4 items)
  const featuredContainer = document.getElementById('featured-products-container');
  if (featuredContainer && window.Products) {
    const list = window.Products.getAll();
    window.Products.renderGrid(featuredContainer, list, 4);
  }

  // Category Cards filter triggers
  const catCards = document.querySelectorAll('.category-card');
  catCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      // Navigate to Menu page with category query parameter
      window.location.href = `pages/menu.html?category=${category}`;
    });
  });
}

// --- MENU PAGE LOGIC ---
function initMenuPage() {
  const menuContainer = document.getElementById('menu-products-container');
  if (!menuContainer || !window.Products) return;

  const urlParams = new URLSearchParams(window.location.search);
  let activeCategory = urlParams.get('category') || 'All';
  let activeSort = 'default';
  let activeSearch = '';

  const allProducts = window.Products.getAll();

  // Highlight Category card in submenu
  const highlightCategoryCard = (catName) => {
    document.querySelectorAll('.category-card').forEach(card => {
      if (card.dataset.category.toLowerCase() === catName.toLowerCase()) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  };

  const filterAndRender = () => {
    let filtered = [...allProducts];

    // Category filter
    if (activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Search filter
    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (activeSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    window.Products.renderGrid(menuContainer, filtered);
  };

  // Bind category button clicks
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      activeCategory = card.dataset.category;
      highlightCategoryCard(activeCategory);
      filterAndRender();
      
      // Update browser query param without reload
      const newUrl = `${window.location.pathname}?category=${activeCategory}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    });
  });

  // Bind Search Input
  const searchInput = document.getElementById('menu-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearch = e.target.value;
      filterAndRender();
    });
  }

  // Bind Sort Dropdown
  const sortSelect = document.getElementById('menu-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      filterAndRender();
    });
  }

  // Initial runs
  highlightCategoryCard(activeCategory);
  filterAndRender();
}

// --- PRODUCT DETAILS PAGE LOGIC ---
function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  // Fallback to cached ID if no query param exists
  const pId = urlParams.get('id') || (window.Storage ? window.Storage.getProductDetailId() : '1');
  
  if (!window.Products) return;
  const p = window.Products.getById(pId);
  if (!p) return;

  // Render detail details
  document.getElementById('p-title').innerHTML = p.name;
  document.getElementById('p-price').textContent = `₹${p.price.toFixed(0)}`;
  if (p.oldPrice) {
    document.getElementById('p-oldprice').textContent = `₹${p.oldPrice.toFixed(0)}`;
    document.getElementById('p-oldprice').style.display = 'inline';
  } else {
    document.getElementById('p-oldprice').style.display = 'none';
  }
  document.getElementById('p-description').textContent = p.description;
  const mainImg = document.getElementById('p-main-img');
  if (mainImg) {
    mainImg.src = window.getLocalImagePath ? window.getLocalImagePath(p.image) : p.image;
  }
  document.getElementById('p-rating').textContent = `${p.rating} (${p.reviews} reviews)`;
  document.getElementById('p-delivery').textContent = p.deliveryTime;
  document.getElementById('p-cooking').textContent = p.cookingTime;

  // Render Ingredients
  const ingContainer = document.getElementById('p-ingredients');
  if (ingContainer) {
    ingContainer.innerHTML = p.ingredients.map(ing => `<li>${ing}</li>`).join('');
  }

  // Render Nutrition
  const nutrContainer = document.getElementById('p-nutrition');
  if (nutrContainer) {
    nutrContainer.innerHTML = `
      <div class="nutr-box"><h4>${p.nutrition.calories}</h4><p>Calories</p></div>
      <div class="nutr-box"><h4>${p.nutrition.protein}</h4><p>Protein</p></div>
      <div class="nutr-box"><h4>${p.nutrition.fat}</h4><p>Fat</p></div>
      <div class="nutr-box"><h4>${p.nutrition.carbs}</h4><p>Carbs</p></div>
    `;
  }

  // Size Options list
  const sizesContainer = document.getElementById('p-sizes');
  if (sizesContainer && p.sizes) {
    sizesContainer.innerHTML = p.sizes.map((s, idx) => `
      <div class="choice-pill size-pill ${idx === 0 ? 'active' : ''}" data-value="${s}">
        ${s}
      </div>
    `).join('');

    // Bind clicks
    sizesContainer.querySelectorAll('.size-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        sizesContainer.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  // Toppings Checkboxes
  const toppingsContainer = document.getElementById('p-toppings');
  if (toppingsContainer && p.toppings) {
    toppingsContainer.innerHTML = p.toppings.map(t => `
      <label class="topping-label">
        <input type="checkbox" class="topping-check" value="${t}">
        <span>${t}</span>
      </label>
    `).join('');
  }

  // Zoom feature on Image Hover
  const imgHolder = document.querySelector('.detail-img-holder');
  if (imgHolder && mainImg) {
    imgHolder.addEventListener('mousemove', (e) => {
      const rect = imgHolder.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const percentageX = (x / rect.width) * 100;
      const percentageY = (y / rect.height) * 100;

      mainImg.style.transformOrigin = `${percentageX}% ${percentageY}%`;
      mainImg.style.transform = 'scale(1.5)';
    });

    imgHolder.addEventListener('mouseleave', () => {
      mainImg.style.transform = '';
      mainImg.style.transformOrigin = 'center center';
    });
  }

  // Detail Quantity logic
  const qtyVal = document.getElementById('p-qty');
  let currentQty = 1;

  document.getElementById('p-dec-qty').addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty--;
      qtyVal.textContent = currentQty;
    }
  });

  document.getElementById('p-inc-qty').addEventListener('click', () => {
    currentQty++;
    qtyVal.textContent = currentQty;
  });

  // Add to Wishlist toggle
  const detailHeart = document.getElementById('p-wishlist-toggle');
  if (detailHeart) {
    const wishlist = window.Storage ? window.Storage.getWishlist() : [];
    if (wishlist.includes(p.id)) detailHeart.classList.add('active');

    detailHeart.addEventListener('click', () => {
      if (window.Wishlist) window.Wishlist.toggle(p.id, detailHeart);
    });
  }

  // Master Add to Cart action button
  document.getElementById('p-add-to-cart').addEventListener('click', () => {
    const selectedSizeEl = sizesContainer?.querySelector('.size-pill.active');
    const size = selectedSizeEl ? selectedSizeEl.dataset.value : 'Regular';
    
    const toppings = [];
    toppingsContainer?.querySelectorAll('.topping-check:checked').forEach(chk => {
      toppings.push(chk.value);
    });

    if (window.Cart) {
      window.Cart.add(p.id, currentQty, size, toppings, mainImg);
    }
  });

  // Recommended list
  const recContainer = document.getElementById('recommended-products-container');
  if (recContainer) {
    const recs = window.Products.getAll().filter(item => item.id !== p.id);
    window.Products.renderGrid(recContainer, recs, 3);
  }

  // --- REVIEWS & RATINGS LOGIC ---
  const reviewsKey = 'product_reviews_' + p.id;
  const defaultReviews = [
    {
      name: "Aria Sterling",
      rating: 5,
      comment: "Absolutely exquisite! The texture of the dish is exceptionally balanced, and the presentation feels like a Michelin-starred gallery. The packaging kept it perfectly warm.",
      date: "2 days ago",
      avatar: "assets/avatar_female_1.jpg"
    },
    {
      name: "Leo Hawthorne",
      rating: 4,
      comment: "Incredible blend of spices and fresh premium ingredients. It arrived exactly on time. A bit rich, but perfect for a gourmet weekend treat.",
      date: "5 days ago",
      avatar: "assets/avatar_male_1.jpg"
    }
  ];

  let currentReviews = JSON.parse(localStorage.getItem(reviewsKey));
  if (!currentReviews) {
    currentReviews = defaultReviews;
    localStorage.setItem(reviewsKey, JSON.stringify(currentReviews));
  }

  const renderReviewsList = (reviews) => {
    const listContainer = document.getElementById('p-reviews-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    
    reviews.forEach(r => {
      const filledStars = '★'.repeat(r.rating);
      const emptyStars = '☆'.repeat(5 - r.rating);
      const card = document.createElement('div');
      card.className = 'review-card glass-panel';
      card.innerHTML = `
        <img src="${window.getLocalImagePath ? window.getLocalImagePath(r.avatar) : r.avatar}" alt="${r.name}" class="review-avatar">
        <div class="review-details">
          <div class="review-header">
            <span class="review-author">${r.name}</span>
            <span class="review-date">${r.date}</span>
          </div>
          <div class="review-rating-stars">${filledStars}${emptyStars}</div>
          <p class="review-text">${r.comment}</p>
        </div>
      `;
      listContainer.appendChild(card);
    });
  };

  const updateProductRatingInfo = (reviews) => {
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = parseFloat((total / reviews.length).toFixed(1));
    const count = reviews.length;
    
    const ratingEl = document.getElementById('p-rating');
    if (ratingEl) {
      ratingEl.textContent = `${avg} (${count} reviews)`;
    }
  };

  // Render initial reviews list & update header details
  renderReviewsList(currentReviews);
  updateProductRatingInfo(currentReviews);

  // Star Picker Interactive Hover / Click logic
  const starPicker = document.getElementById('form-stars-picker');
  let selectedFormRating = 5;
  
  if (starPicker) {
    const stars = starPicker.querySelectorAll('.star-picker-star');
    
    const highlightStars = (rating) => {
      stars.forEach((star, idx) => {
        if (idx < rating) {
          star.style.color = 'var(--accent-color)';
        } else {
          star.style.color = 'var(--text-muted)';
        }
      });
    };
    
    highlightStars(selectedFormRating);
    
    stars.forEach(star => {
      star.addEventListener('click', () => {
        selectedFormRating = parseInt(star.dataset.value);
        highlightStars(selectedFormRating);
      });
      
      star.addEventListener('mouseenter', () => {
        highlightStars(parseInt(star.dataset.value));
      });
    });
    
    starPicker.addEventListener('mouseleave', () => {
      highlightStars(selectedFormRating);
    });
  }

  // Bind Submit Review Form
  const reviewForm = document.getElementById('add-review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = document.getElementById('review-user-name').value.trim();
      const commentVal = document.getElementById('review-comment').value.trim();
      
      if (!nameVal || !commentVal) return;
      
      const newReview = {
        name: nameVal,
        rating: selectedFormRating,
        comment: commentVal,
        date: "Just now",
        avatar: "assets/avatar_female_2.jpg"
      };
      
      let reviewsList = JSON.parse(localStorage.getItem(reviewsKey)) || [];
      reviewsList.unshift(newReview);
      localStorage.setItem(reviewsKey, JSON.stringify(reviewsList));
      
      renderReviewsList(reviewsList);
      updateProductRatingInfo(reviewsList);
      
      // Reset Form State
      reviewForm.reset();
      selectedFormRating = 5;
      if (starPicker) {
        starsArr = starPicker.querySelectorAll('.star-picker-star');
        starsArr.forEach((star, idx) => {
          star.style.color = idx < 5 ? 'var(--accent-color)' : 'var(--text-muted)';
        });
      }
      
      if (window.Toast) {
        window.Toast.show("Thank you! Your review has been added.");
      } else {
        alert("Thank you! Your review has been added.");
      }
    });
  }
}

// --- CART PAGE LOGIC ---
function initCartPage() {
  const itemsContainer = document.getElementById('cart-items-container');
  if (!itemsContainer) return;

  const renderCart = () => {
    const cart = window.Storage ? window.Storage.getCart() : [];
    
    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align:center; padding: 4rem 0;">
          <h2 style="font-family: var(--font-heading); margin-bottom:1rem;">Your nest is empty!</h2>
          <p style="color:var(--text-muted); margin-bottom:2rem;">Explore our premium menu and choose extraordinary dishes.</p>
          <a href="menu.html" class="btn-premium"><span>Browse Menu</span></a>
        </div>
      `;
      // Reset totals
      updateTotalsUI({ subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 });
      return;
    }

    itemsContainer.innerHTML = `
      <div class="cart-table-header">
        <div>Dish</div>
        <div>Specs</div>
        <div>Qty</div>
        <div>Price</div>
        <div>Actions</div>
      </div>
      <div class="cart-items-list"></div>
    `;

    const listContainer = itemsContainer.querySelector('.cart-items-list');

    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item-row reveal-el active';
      row.innerHTML = `
        <div class="cart-item-dish">
          <div class="cart-item-img-wrapper" style="position:relative; width: 60px; height: 60px; border-radius: var(--radius-md); overflow:hidden; flex-shrink:0; display:flex; justify-content:center; align-items:center; background:linear-gradient(135deg, rgba(255,183,3,0.1), rgba(255,0,127,0.1));">
            <img src="${window.getLocalImagePath ? window.getLocalImagePath(item.image) : item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <h4>${item.name}</h4>
        </div>
        <div class="cart-item-specs">
          <span>Size: ${item.size}</span>
          ${item.toppings.length > 0 ? `<p style="font-size:0.75rem; color:var(--text-muted);">Toppings: ${item.toppings.join(', ')}</p>` : ''}
        </div>
        <div class="cart-item-qty">
          <div class="qty-selector">
            <div class="qty-btn dec-qty-btn" data-id="${item.id}" data-size="${item.size}" data-toppings='${JSON.stringify(item.toppings)}'>-</div>
            <div class="qty-val">${item.quantity}</div>
            <div class="qty-btn inc-qty-btn" data-id="${item.id}" data-size="${item.size}" data-toppings='${JSON.stringify(item.toppings)}'>+</div>
          </div>
        </div>
        <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(0)}</div>
        <div class="cart-item-actions">
          <button class="remove-cart-item-btn" data-id="${item.id}" data-size="${item.size}" data-toppings='${JSON.stringify(item.toppings)}'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      `;

      listContainer.appendChild(row);
    });

    // Bind quantity click actions
    listContainer.querySelectorAll('.dec-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const size = btn.dataset.size;
        const toppings = JSON.parse(btn.dataset.toppings);
        if (window.Cart) window.Cart.updateQuantity(id, size, toppings, -1);
      });
    });

    listContainer.querySelectorAll('.inc-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const size = btn.dataset.size;
        const toppings = JSON.parse(btn.dataset.toppings);
        if (window.Cart) window.Cart.updateQuantity(id, size, toppings, 1);
      });
    });

    listContainer.querySelectorAll('.remove-cart-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const size = btn.dataset.size;
        const toppings = JSON.parse(btn.dataset.toppings);
        
        // Animated deletion
        const row = btn.closest('.cart-item-row');
        row.style.transform = 'translateX(50px) scale(0.9)';
        row.style.opacity = '0';
        setTimeout(() => {
          if (window.Cart) window.Cart.remove(id, size, toppings);
        }, 300);
      });
    });

    // Update Totals Panel
    if (window.Cart) {
      updateTotalsUI(window.Cart.calculateTotals());
    }
  };

  const updateTotalsUI = (totals) => {
    document.getElementById('cart-subtotal').textContent = `₹${totals.subtotal.toFixed(0)}`;
    document.getElementById('cart-tax').textContent = `₹${totals.tax.toFixed(0)}`;
    document.getElementById('cart-shipping').textContent = `₹${totals.shipping.toFixed(0)}`;
    document.getElementById('cart-total').textContent = `₹${totals.total.toFixed(0)}`;
    
    const discEl = document.getElementById('cart-discount');
    const discRow = document.getElementById('cart-discount-row');
    if (totals.discount > 0 && discEl && discRow) {
      discEl.textContent = `-₹${totals.discount.toFixed(0)}`;
      discRow.style.display = 'flex';
    } else if (discRow) {
      discRow.style.display = 'none';
    }
  };

  // Bind coupon voucher form submit
  const couponForm = document.getElementById('coupon-form');
  const couponInput = document.getElementById('coupon-input');
  if (couponForm && couponInput) {
    couponForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = couponInput.value;
      if (window.Cart && window.Cart.applyCoupon(code)) {
        couponInput.value = '';
      }
    });
  }

  // Remove Applied Coupon click
  const removeCouponBtn = document.getElementById('remove-coupon-btn');
  if (removeCouponBtn) {
    removeCouponBtn.addEventListener('click', () => {
      if (window.Cart) window.Cart.removeCoupon();
    });
  }

  // Watch for cart modifications to re-render
  window.addEventListener('cartUpdated', renderCart);
  window.addEventListener('couponUpdated', renderCart);
  
  // First render
  renderCart();
}

// --- CHECKOUT PAGE LOGIC ---
function initCheckoutPage() {
  if (!window.Cart) return;

  const renderSummary = () => {
    const cart = window.Storage ? window.Storage.getCart() : [];
    const summaryContainer = document.getElementById('checkout-items-summary');
    if (!summaryContainer) return;

    if (cart.length === 0) {
      window.location.href = 'cart.html';
      return;
    }

    summaryContainer.innerHTML = cart.map(item => `
      <div class="checkout-summary-row">
        <span>${item.name} (${item.size}) x${item.quantity}</span>
        <span>₹${(item.price * item.quantity).toFixed(0)}</span>
      </div>
    `).join('');

    const totals = window.Cart.calculateTotals();
    document.getElementById('checkout-subtotal').textContent = `₹${totals.subtotal.toFixed(0)}`;
    document.getElementById('checkout-tax').textContent = `₹${totals.tax.toFixed(0)}`;
    document.getElementById('checkout-shipping').textContent = `₹${totals.shipping.toFixed(0)}`;
    document.getElementById('checkout-total').textContent = `₹${totals.total.toFixed(0)}`;

    const discRow = document.getElementById('checkout-discount-row');
    const discVal = document.getElementById('checkout-discount');
    if (totals.discount > 0 && discRow && discVal) {
      discVal.textContent = `-₹${totals.discount.toFixed(0)}`;
      discRow.style.display = 'flex';
    } else if (discRow) {
      discRow.style.display = 'none';
    }
  };

  renderSummary();

  // Credit Card Masking formatting
  const ccInput = document.getElementById('chk-card-num');
  if (ccInput) {
    ccInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formatted = '';
      for (let i = 0; i < val.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formatted += ' ';
        }
        formatted += val[i];
      }
      e.target.value = formatted.substring(0, 19);
    });
  }

  // Credit Card Expiry Masking
  const ccExpiry = document.getElementById('chk-card-expiry');
  if (ccExpiry) {
    ccExpiry.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (val.length >= 2) {
        e.target.value = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
      } else {
        e.target.value = val;
      }
    });
  }

  // Delivery details form submit
  const checkoutForm = document.getElementById('checkout-details-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show payment loading animation screen overlay
      let checkoutLoader = document.getElementById('checkout-loader-overlay');
      if (!checkoutLoader) {
        checkoutLoader = document.createElement('div');
        checkoutLoader.id = 'checkout-loader-overlay';
        checkoutLoader.className = 'loader-overlay-checkout';
        document.body.appendChild(checkoutLoader);
      }

      checkoutLoader.innerHTML = `
        <div class="chk-loader-box glass-panel text-center">
          <div class="loader-plate"></div>
          <h3 style="font-family:var(--font-heading); margin-top:2rem;">Authorizing Transaction...</h3>
          <p style="color:var(--text-muted)">Securing payment details through server node...</p>
        </div>
      `;
      checkoutLoader.style.opacity = '1';
      checkoutLoader.style.visibility = 'visible';

      setTimeout(() => {
        // Change text to cooking
        checkoutLoader.querySelector('h3').textContent = 'Finalizing Order...';
        checkoutLoader.querySelector('p').textContent = 'Transmitting order to the kitchen grid.';
        
        setTimeout(() => {
          // Success Screen
          checkoutLoader.innerHTML = `
            <div class="chk-loader-box glass-panel text-center success-box">
              <div class="success-icon-anim">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style="font-family:var(--font-heading); margin-top:1.5rem;">Order Successfully Placed!</h3>
              <p style="color:var(--text-muted); margin-bottom: 1.5rem;">Your order has been registered at the kitchen grid. Track your fresh dish on your profile dashboard.</p>
              <button class="btn-premium close-chk-success"><span>Go to Dashboard</span></button>
            </div>
          `;

          // Clear Cart
          if (window.Storage) {
            window.Storage.saveCart([]);
            window.Storage.saveAppliedCoupon(null);
          }

          checkoutLoader.querySelector('.close-chk-success').addEventListener('click', () => {
            window.location.href = 'profile.html';
          });

        }, 2000);

      }, 2000);
    });
  }
}

// --- PROFILE PAGE LOGIC ---
function initProfilePage() {
  // Render dummy premium order history list
  const ordersContainer = document.getElementById('profile-orders-list');
  if (!ordersContainer) return;

  const dummyOrders = [
    {
      id: 'FN-98431',
      date: 'July 18, 2026',
      items: '1x Gourmet Truffle Pizza, 1x Herb Truffle Fries',
      total: 36.98,
      status: 'Delivered',
      statusClass: 'status-delivered'
    },
    {
      id: 'FN-95412',
      date: 'June 29, 2026',
      items: '1x Wagyu Gold Truffle Burger, 1x Hibiscus Lime Mocktail',
      total: 44.49,
      status: 'Delivered',
      statusClass: 'status-delivered'
    }
  ];

  ordersContainer.innerHTML = dummyOrders.map(ord => `
    <div class="profile-order-card glass-panel">
      <div class="order-header">
        <div>
          <h4>Order #${ord.id}</h4>
          <p>${ord.date}</p>
        </div>
        <span class="status-badge ${ord.statusClass}">${ord.status}</span>
      </div>
      <div class="order-details">
        <p><strong>Items:</strong> ${ord.items}</p>
        <p><strong>Total Paid:</strong> ₹${ord.total.toFixed(0)}</p>
      </div>
    </div>
  `).join('');
}

// --- COMMON BINDINGS ---
function initCommonBindings() {
  // Newsletter submission Toast
  const newsForm = document.querySelector('.newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsForm.querySelector('input');
      if (input && input.value.trim()) {
        if (window.Toast) {
          window.Toast.show(`Subscribed successfully! Welcome to the flock.`, 'success');
        }
        input.value = '';
      }
    });
  }

  // Scroll to Top trigger
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
