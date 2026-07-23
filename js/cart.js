/* js/cart.js */

const Cart = {
  add(productId, qty = 1, size = null, toppings = null, imgEl = null) {
    const p = window.Products ? window.Products.getById(productId) : null;
    if (!p) return;

    // Load current cart
    const cart = window.Storage ? window.Storage.getCart() : [];
    
    // Default size/toppings if null (for menu clicks)
    const finalSize = size || p.sizes?.[0] || 'Regular';
    const finalToppings = toppings || [];

    // Check if item with same configuration already in cart
    const existingIndex = cart.findIndex(item => 
      item.id === productId && 
      item.size === finalSize && 
      JSON.stringify(item.toppings) === JSON.stringify(finalToppings)
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        id: productId,
        name: p.name,
        image: p.image,
        price: p.price,
        size: finalSize,
        toppings: finalToppings,
        quantity: qty,
        emoji: p.emoji || '🍕'
      });
    }

    // Save cart
    if (window.Storage) window.Storage.saveCart(cart);

    // Trigger Fly to Cart animation if imgEl is provided
    if (imgEl) {
      this.animateFlyToCart(imgEl);
    } else {
      if (window.Toast) window.Toast.show(`Added ${p.name} to cart!`, 'success');
    }
  },

  remove(productId, size, toppings) {
    let cart = window.Storage ? window.Storage.getCart() : [];
    
    cart = cart.filter(item => !(
      item.id === productId && 
      item.size === size && 
      JSON.stringify(item.toppings) === JSON.stringify(toppings)
    ));

    if (window.Storage) window.Storage.saveCart(cart);
    if (window.Toast) window.Toast.show('Removed item from cart.', 'info');
  },

  updateQuantity(productId, size, toppings, change) {
    const cart = window.Storage ? window.Storage.getCart() : [];
    
    const index = cart.findIndex(item => 
      item.id === productId && 
      item.size === size && 
      JSON.stringify(item.toppings) === JSON.stringify(toppings)
    );

    if (index > -1) {
      cart[index].quantity += change;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      if (window.Storage) window.Storage.saveCart(cart);
    }
  },

  animateFlyToCart(imgEl) {
    const cartIcon = document.querySelector('.nav-actions .action-btn[href*="cart"]');
    if (!cartIcon) {
      if (window.Toast) window.Toast.show('Added to cart!', 'success');
      return;
    }

    const imgRect = imgEl.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // Create moving image clone
    const clone = imgEl.cloneNode(true);
    clone.className = 'flying-cart-item';
    clone.style.left = `${imgRect.left}px`;
    clone.style.top = `${imgRect.top}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    
    document.body.appendChild(clone);

    // Dynamic scale/translate triggers
    setTimeout(() => {
      clone.style.left = `${cartRect.left + cartRect.width / 2 - 35}px`;
      clone.style.top = `${cartRect.top + cartRect.height / 2 - 35}px`;
      clone.style.transform = 'scale(0.1) rotate(720deg)';
      clone.style.opacity = '0.2';
    }, 50);

    // Clean up flyer and bounce cart icon
    setTimeout(() => {
      clone.remove();
      
      // Add custom bounce class to header cart button
      cartIcon.style.transform = 'scale(1.25)';
      setTimeout(() => {
        cartIcon.style.transform = '';
      }, 300);

      const pId = imgEl.closest('.product-card')?.dataset.id || imgEl.closest('.quickview-container')?.querySelector('.qv-add-btn')?.dataset.id;
      const p = pId && window.Products ? window.Products.getById(pId) : null;
      const name = p ? p.name : 'Delicious meal';
      if (window.Toast) window.Toast.show(`Added ${name} to cart!`, 'success');
    }, 950);
  },

  calculateTotals() {
    const cart = window.Storage ? window.Storage.getCart() : [];
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal > 0 ? Math.round(subtotal * 0.05) : 0; // 5% GST in India
    
    const coupon = window.Storage ? window.Storage.getAppliedCoupon() : null;
    let shipping = subtotal > 0 ? 60 : 0; // ₹60 flat delivery charge
    if (coupon && (coupon.code === 'FREEDELIV' || coupon.code === 'FREESHIP')) {
      shipping = 0;
    }

    let discount = 0;
    if (coupon && subtotal > 0) {
      discount = Math.round(subtotal * (coupon.value / 100));
    }

    const total = Math.max(0, subtotal + tax + shipping - discount);

    return {
      subtotal,
      tax,
      shipping,
      discount,
      total
    };
  },

  applyCoupon(code) {
    const coupons = {
      'WELCOME10': { code: 'WELCOME10', value: 10, description: '10% discount on entire order' },
      'GOLDMEAL': { code: 'GOLDMEAL', value: 20, description: '20% gourmet discount' },
      'WELCOME20': { code: 'WELCOME20', value: 20, description: '20% welcome discount' },
      'FLASH30': { code: 'FLASH30', value: 30, description: '30% flash discount' },
      'SAVE25': { code: 'SAVE25', value: 25, description: '25% scratch discount' },
      'HAPPY25': { code: 'HAPPY25', value: 25, description: '25% happy hour discount' },
      'BDAY40': { code: 'BDAY40', value: 40, description: '40% birthday discount' },
      'SPIN10': { code: 'SPIN10', value: 10, description: '10% spin wheel discount' },
      'SPIN15': { code: 'SPIN15', value: 15, description: '15% spin wheel discount' },
      'SPIN20': { code: 'SPIN20', value: 20, description: '20% spin wheel discount' },
      'FREEDRINK': { code: 'FREEDRINK', value: 15, description: 'Free Drink (Flat 15% discount)' },
      'FREEFRIES': { code: 'FREEFRIES', value: 15, description: 'Free Fries (Flat 15% discount)' },
      'FREEDESSERT': { code: 'FREEDESSERT', value: 15, description: 'Free Dessert (Flat 15% discount)' },
      'SCRATCH10': { code: 'SCRATCH10', value: 10, description: '10% scratch card discount' },
      'SCRATCH20': { code: 'SCRATCH20', value: 20, description: '20% scratch card discount' },
      'BOGO': { code: 'BOGO', value: 25, description: 'Buy 1 Get 1 (Flat 25% discount)' },
      'FREEDELIV': { code: 'FREEDELIV', value: 0, description: 'Free Delivery on order' }
    };

    const formattedCode = code.trim().toUpperCase();
    if (coupons[formattedCode]) {
      if (window.Storage) {
        window.Storage.saveAppliedCoupon(coupons[formattedCode]);
      }
      if (window.Toast) window.Toast.show(`Voucher ${formattedCode} applied successfully!`, 'success');
      return true;
    } else {
      if (window.Toast) window.Toast.show('Invalid voucher code.', 'info');
      return false;
    }
  },

  removeCoupon() {
    if (window.Storage) {
      window.Storage.saveAppliedCoupon(null);
    }
    if (window.Toast) window.Toast.show('Voucher removed.', 'info');
  }
};

window.Cart = Cart;
