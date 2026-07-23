/* js/products.js */

window.getLocalImagePath = function(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const isPageSubdir = window.location.pathname.includes('/pages/');
  return (isPageSubdir ? '../' : '') + imagePath;
};

const categoryNames = {
  'Pizza': [
    'Gourmet Truffle Margherita', 'Tandoori Chicken Tikka Pizza', 'Quattro Formaggi Cream', 
    'Paneer Makhani Sensation', 'Spicy Pepperoni Hot Honey', 'Pesto Garden Green Pizza',
    'Burrata Prosciutto Rustica', 'Smoked Salmon Royale Pizza', 'Wild Mushroom Garlic Pizza',
    'Avocado Feta Flatbread Pizza', 'Fiery Ghost Pepper Chicken Pizza', 'Alfredo Crema Chicken Pizza',
    'Caramelized Onion Fig Pizza', 'Classic Margherita Extra', 'Roasted Garlic Basil Pizza',
    'Mediterranean Veggie Pizza', 'Tuscan Sun Roasted Pizza', 'BBQ Pulled Jackfruit Pizza',
    'Spiced Lamb Keema Pizza', 'Saffron Seafood Marinara Pizza', 'Chili Paneer Fusion Pizza'
  ],
  'Burgers': [
    'A5 Wagyu Gold Truffle Burger', 'Spicy Paneer Tikka Burger', 'Double Cheddar Bacon Burger',
    'Mushroom Swiss Butter Burger', 'Avocado Crisp Turkey Burger', 'Crispy Buffalo Chicken Burger',
    'Classic Aloo Tikki Deluxe Burger', 'Lamb Keema Slider Burger', 'Pulled BBQ Jackfruit Burger',
    'Teriyaki Grilled Tofu Burger', 'Smoky Brisket Onion Burger', 'Truffle Butter Crunch Burger',
    'Golden Brie Cranberry Burger', 'Jalapeno Inferno Spicy Burger', 'Blue Cheese Roasted Fig Burger',
    'Atlantic Salmon Patty Burger', 'Falafel Mint Tahini Burger', 'Quinoa Garden Veggie Burger',
    'Beetroot Feta Slider Burger', 'Crisp Shell Crab Burger', 'Mac & Cheese Lava Burger'
  ],
  'Pasta': [
    'Truffle Mushroom Fettuccine', 'Classic Spaghetti Bolognese', 'Penne Arrabbiata Sensation',
    'Gourmet Lobster Ravioli', 'Creamy Pesto Gnocchi', 'Baked Lasagna Classico',
    'Spinach Ricotta Cannelloni', 'Seafood Linguine Marinara', 'Four Cheese Macaroni Lava',
    'Garlic Butter Shrimp Scampi Pasta', 'Smoked Salmon Dill Farfalle', 'Spicy Calabrian Chili Rigatoni',
    'Pumpkin Sage Tortellini', 'Lemon Basil Capellini', 'Alfredo Crema Chicken Fettuccine',
    'Carbonara Rustica Roman', 'Bolognese Baked Ziti', 'Mediterranean Veggie Orzo',
    'Spiced Lamb Keema Penne', 'Creamy Tuscan Sun Tomato Pasta', 'Wild Mushroom Herb Tagliatelle'
  ],
  'Asian Food': [
    'Spicy Tonkotsu Pork Ramen', 'Salmon Aburi Caviar Sushi', 'Dragon Caviar Maki Roll',
    'Tandoori Paneer Tikka Masala', 'Gourmet Butter Chicken Risotto', 'Kashmiri Mutton Rogan Josh',
    'Shahi Zafrani Dum Dum Biryani', 'Pork Gyoza Pan Dumplings', 'Classic Shrimp Pad Thai',
    'Kung Pao Tofu Cashew', 'Sichuan Hot Chili Shrimp', 'Dim Sum Basket Steamed',
    'Garlic Butter Naan Basket', 'Lamb Seekh Kebab Platter', 'Dal Makhani Slow Cooked',
    'Palak Paneer Creamy Cottage', 'Samosa Chaat Deconstructed', 'Chicken Katsu Curry Donburi',
    'Vietnamese Beef Pho Bowl', 'Thai Tom Yum Soup Spicy', 'Green Papaya Peanut Salad'
  ],
  'Salads': [
    'Mediterranean Quinoa Bowl', 'Avocado Sourdough Feta Toast', 'Greek Watermelon Feta Salad',
    'Protein Chia Berry Oats Bowl', 'Acai Berry Power Blast Bowl', 'Caesar Salad Crisp Romaine',
    'Vegan Garden Buddha Bowl', 'Edamame Hummus Crisp Plate', 'Ginger Turmeric Veggie Soup',
    'Grilled Organic Tofu Salad', 'Spinach Berry Walnut Salad', 'Sweet Potato Baked Wedges',
    'Steamed Salmon Broccoli Bowl', 'Super Green Smoothie Bowl', 'Red Lentil Veggie Soup',
    'Quinoa Avocado Veggie Wrap', 'Roasted Spicy Chickpea Salad', 'Zucchini Noodles Pesto',
    'Chia Seed Coconut Pudding', 'Fresh Fruit Sensation Salad', 'Crisp Kale Red Apple Salad'
  ],
  'Desserts': [
    'Belgian Chocolate Lava Cake', 'Tiramisu Classico Espresso', 'New York Berry Cheesecake',
    'Gulab Jamun Rabri Parfait', 'Rasmalai Cardamom Parfait', 'Saffron Pistachio Kulfi Platter',
    'Red Velvet Molten Lava Cake', 'Mango Cream Panna Cotta', 'Warm Cinnamon Apple Pie',
    'Churros Salted Caramel Dip', 'French Macaron Assortment', 'Belgian Waffle Berry Deluxe',
    'Matcha Green Crepe Cake', 'Zesty Lemon Meringue Tart', 'Sticky Toffee Date Pudding',
    'Vanilla Bean Crème Brûlée', 'Chocolate Truffle Silk Mousse', 'Baklava Honey Pistachio Plate',
    'Fresh Fruit Custard Tart', 'Classic Caramel Custard', 'Kaju Katli Gold Leaf'
  ],
  'Drinks': [
    'Mango Lassi Cardamom Mocktail', 'Masala Chai Frappe Cream', 'Cold Brew Espresso Stout',
    'Fresh Lime Mint Mojito', 'Pink Pitaya Berry Smoothie', 'Iced Lavender Honey Latte',
    'Ginger Kombucha Tonic Sparkler', 'Hibiscus Citrus Iced Tea', 'Creamy Avocado Protein Shake',
    'Watermelon Sweet Basil Cooler', 'Ceremonial Matcha Green Latte', 'Golden Turmeric Root Latte',
    'Chocolate Fudge Brownie Shake', 'Fresh Coconut Water Mint', 'Lychee Rose Bubble Sparkler',
    'Indian Mysore Filter Coffee', 'Sparkling Crimson Apple Cider', 'Lemon Grass Citrus Ice Tea',
    'Zesty Kiwi Lime Lemonade', 'Pomegranate Detox Cold Press', 'Blue Curacao Lagoon Fizz'
  ],
  'Sandwiches': [
    'Gourmet Truffle Grilled Cheese', 'Avocado Club Chicken Sandwich', 'Classic Philly Cheesesteak',
    'Caprese Sourdough Panini', 'Smoked Salmon Avocado Bagel', 'Spicy Paneer Tikka Wrap',
    'Wagyu Beef Burger Toast', 'Lobster Roll Butter Brioche', 'Cuban Roasted Pork Sandwich',
    'Teriyaki Tofu Ciabatta', 'Pulled BBQ Chicken Sandwich', 'Falafel Mint Tahini Wrap',
    'Monte Cristo Sweet French Toast', 'Roasted Veggie Pesto Focaccia', 'Ultimate Bacon Egg Sandwich',
    'Buffalo Chicken Blue Cheese Wrap', 'Classic Turkey Cranberry Croissant', 'Italian Prosciutto Mortadella Sub',
    'Spiced Keema Toastie Delight', 'Roasted Garlic Eggplant Panini', 'Pesto Chicken Mozzarella Sub'
  ],
  'Fries': [
    'Gourmet Truffle Parmesan Fries', 'Sweet Potato Maple Cinnamon Wedges', 'Loaded Cheese Lava Fries',
    'Spicy Peri Peri Handcut Fries', 'Garlic Herb Butter Waffle Fries', 'Loaded Chili Keema Fries',
    'Curly Fries Spicy Twister', 'Crispy Onion Ring Basket', 'Polenta Fries Herb Aioli',
    'Bacon Cheddar Baked Potato Skins', 'Tater Tots Cheese Dust', 'Animal Style Loaded Fries',
    'Greek Feta Oregano Fries', 'Poutine Cheese Curds Gravy', 'Ghost Pepper Fiery Fries',
    'Sweet Potato Truffle Fries', 'Cajun Dust Shoestring Fries', 'Salt & Pepper Crinkle Cut Fries',
    'Beer Battered Onion Twists', 'Pesto Garlic Melt Fries', 'Cheesy Bacon Potato Wedges'
  ]
};

const categoryImagePrefix = {
  'Pizza': 'pizza',
  'Burgers': 'burger',
  'Pasta': 'pasta',
  'Asian Food': 'asian',
  'Salads': 'salad',
  'Desserts': 'desserts',
  'Drinks': 'drinks',
  'Sandwiches': 'sandwiches',
  'Fries': 'fries'
};

const categoryImageIds = {};

// Generate 20+ items for each category dynamically
const ProductData = [];
let idCounter = 1;

Object.entries(categoryNames).forEach(([category, names]) => {
  names.forEach((name, index) => {
    let minPrice = 199, maxPrice = 899;
    if (category === 'Pizza') { minPrice = 399; maxPrice = 1299; }
    else if (category === 'Burgers') { minPrice = 249; maxPrice = 799; }
    else if (category === 'Pasta') { minPrice = 349; maxPrice = 999; }
    else if (category === 'Asian Food') { minPrice = 299; maxPrice = 999; }
    else if (category === 'Salads') { minPrice = 199; maxPrice = 599; }
    else if (category === 'Desserts') { minPrice = 149; maxPrice = 699; }
    else if (category === 'Drinks') { minPrice = 99; maxPrice = 499; }
    else if (category === 'Sandwiches') { minPrice = 199; maxPrice = 649; }
    else if (category === 'Fries') { minPrice = 99; maxPrice = 399; }

    const price = Math.floor(minPrice + (Math.random() * (maxPrice - minPrice)));
    const oldPrice = Math.random() > 0.6 ? Math.floor(price * 1.2) : null;
    
    // Choose a local image from the downloaded list (5 unique images per category)
    const localImgIndex = index % 5;
    const imgPrefix = categoryImagePrefix[category];
    const image = `assets/${imgPrefix}_${localImgIndex}.jpg`;
    
    const rating = parseFloat((4.5 + Math.random() * 0.5).toFixed(1));
    const reviews = Math.floor(40 + Math.random() * 250);

    const hot = index % 3 === 0;
    const badge = index === 0 ? 'Chef Choice' : (index === 1 ? 'Best Seller' : (index === 2 ? 'Popular' : ''));
    const badgeClass = badge === 'Chef Choice' ? 'badge-gold' : (badge === 'Best Seller' ? 'badge-green' : 'badge-gold');

    const emoji = category === 'Pizza' ? '🍕' :
                  category === 'Burgers' ? '🍔' :
                  category === 'Pasta' ? '🍝' :
                  category === 'Asian Food' ? '🍜' :
                  category === 'Salads' ? '🥗' :
                  category === 'Desserts' ? '🍰' :
                  category === 'Drinks' ? '🥤' :
                  category === 'Sandwiches' ? '🥪' :
                  '🍟'; // Fries

    ProductData.push({
      id: idCounter++,
      name: name,
      category: category,
      emoji: emoji,
      image: image,
      description: `A premium, freshly prepared ${name} crafted with the finest luxury local ingredients and cooked to perfection by our culinary artisans.`,
      ingredients: ['Gourmet local produce', 'Special chef spices', 'Premium house sauce', 'Fresh herbs'],
      nutrition: { 
        calories: `${Math.floor(250 + Math.random() * 500)} kcal`, 
        fat: `${Math.floor(10 + Math.random() * 25)}g`, 
        protein: `${Math.floor(5 + Math.random() * 30)}g`, 
        carbs: `${Math.floor(20 + Math.random() * 60)}g` 
      },
      rating: rating,
      reviews: reviews,
      price: price,
      oldPrice: oldPrice,
      deliveryTime: `${Math.floor(15 + Math.random() * 20)} min`,
      cookingTime: `${Math.floor(10 + Math.random() * 15)} min`,
      badge: badge,
      badgeClass: badgeClass,
      hot: hot,
      sizes: ['Regular Serving', 'Chef Platter Extra'],
      toppings: ['Extra Gourmet Dressing', 'Crispy Garlic Topping', 'Premium Butter Drizzle']
    });
  });
});


const Products = {
  getAll() {
    return ProductData;
  },

  getById(id) {
    return ProductData.find(p => p.id === id);
  },

  getByCategory(category) {
    if (category === 'All') return ProductData;
    return ProductData.filter(p => p.category === category);
  },

  search(query) {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    return ProductData.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
  },

  renderGrid(container, productsList, limit = null) {
    this.renderList(productsList, container, limit);
  },

  renderList(productsList, container, limit = null) {
    if (!container) return;
    container.innerHTML = '';
    
    let list = [...productsList];
    if (limit) {
      list = list.slice(0, limit);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0;">
          <h3 style="font-family: var(--font-heading); margin-bottom: 0.5rem;">No Dishes Found</h3>
          <p style="color: var(--text-muted);">Try selecting another category or typing another search.</p>
        </div>
      `;
      return;
    }

    const wishlist = window.Storage ? window.Storage.getWishlist() : [];

    list.forEach(p => {
      const isInWishlist = wishlist.includes(p.id);
      const isDiscounted = p.oldPrice > p.price;
      
      const card = document.createElement('div');
      card.className = 'product-card glass-panel reveal-el';
      card.dataset.id = p.id;
      
      let steamHtml = '';
      if (p.hot) {
        steamHtml = `
          <div class="steam-container">
            <div class="steam-line"></div>
            <div class="steam-line"></div>
            <div class="steam-line"></div>
          </div>
        `;
      }

      let badgeHtml = '';
      if (p.badge) {
        badgeHtml = `<div class="badge-tag ${p.badgeClass}">${p.badge}</div>`;
      }

      let discountBadgeHtml = '';
      if (isDiscounted) {
        const pct = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
        discountBadgeHtml = `<div class="badge-tag badge-discount" style="background:#ff4757; color:white;">${pct}% OFF</div>`;
      }

      const filledStars = Math.round(p.rating);
      const starsHtml = '★'.repeat(filledStars) + '☆'.repeat(5 - filledStars);

      card.innerHTML = `
        <div class="product-badges" style="position: absolute; top: 1.5rem; left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; z-index: 10;">
          ${badgeHtml}
          ${discountBadgeHtml}
        </div>
        <div class="wishlist-heart ${isInWishlist ? 'active' : ''}" data-id="${p.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div class="product-img-holder">
          ${steamHtml}
          <img src="${window.getLocalImagePath(p.image)}" alt="${p.name}" loading="lazy">
        </div>
        <div class="product-info">
          <div class="rating-container">
            <span class="star-rating" style="color: var(--accent-color); font-weight: 700; font-size: 0.95rem; margin-right: 0.3rem;">${starsHtml}</span>
            <span>${p.rating}</span>
            <span class="rating-count">(${p.reviews})</span>
          </div>
          <h3 class="product-title"><a href="${window.location.pathname.includes('/pages/') ? 'product.html' : 'pages/product.html'}?id=${p.id}" class="product-detail-link" data-id="${p.id}">${p.name}</a></h3>
          <p class="product-card-desc" style="font-size: 0.8rem; color: var(--text-muted); margin: 0.5rem 0 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4; min-height: 2.8em;">${p.description}</p>
          <div class="product-meta">
            <div class="meta-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${p.deliveryTime}</span>
            </div>
            <span>${p.category}</span>
          </div>
          <div class="product-footer">
            <div class="product-price">
              ₹${p.price.toFixed(0)}
              ${isDiscounted ? `<span>₹${p.oldPrice.toFixed(0)}</span>` : ''}
            </div>
            <div class="btn-card-add magnetic" data-id="${p.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          </div>
        </div>
        <button class="btn-card-quickview" data-id="${p.id}">Quick View</button>
      `;

      container.appendChild(card);
      
      setTimeout(() => {
        card.classList.add('active');
      }, 50);
    });

    this.bindEvents(container);
    
    document.dispatchEvent(new CustomEvent('productsRendered'));
  },

  bindEvents(container) {
    container.querySelectorAll('.product-detail-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.dataset.id;
        if (window.Storage) window.Storage.setProductDetailId(id);
      });
    });

    container.querySelectorAll('.wishlist-heart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        if (window.Wishlist) window.Wishlist.toggle(id, btn);
      });
    });

    container.querySelectorAll('.btn-card-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const img = btn.closest('.product-card').querySelector('.product-img-holder img');
        if (window.Cart) window.Cart.add(id, 1, null, null, img);
      });
    });

    container.querySelectorAll('.btn-card-quickview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        this.showQuickView(id);
      });
    });
  },

  showQuickView(id) {
    const p = this.getById(id);
    if (!p) return;

    let modal = document.getElementById('quickview-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'quickview-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content glass-panel">
        <div class="btn-close-modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <div class="quickview-container">
          <div class="quickview-img-holder" style="position:relative; overflow:hidden; background:linear-gradient(135deg, rgba(255,183,3,0.1), rgba(255,0,127,0.1)); display:flex; justify-content:center; align-items:center;">
            <img src="${window.getLocalImagePath(p.image)}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div class="quickview-details">
            <div class="rating-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>${p.rating} (${p.reviews} reviews)</span>
            </div>
            <h2>${p.name}</h2>
            <div class="quickview-price">₹${p.price.toFixed(0)}</div>
            <p>${p.description}</p>
            <div class="quickview-actions">
              <div class="qty-selector">
                <div class="qty-btn dec-qty">-</div>
                <div class="qty-val">1</div>
                <div class="qty-btn inc-qty">+</div>
              </div>
              <button class="btn-premium qv-add-btn" data-id="${p.id}">
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const decBtn = modal.querySelector('.dec-qty');
    const incBtn = modal.querySelector('.inc-qty');
    const qtyVal = modal.querySelector('.qty-val');
    let qty = 1;

    decBtn.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        qtyVal.textContent = qty;
      }
    });

    incBtn.addEventListener('click', () => {
      qty++;
      qtyVal.textContent = qty;
    });

    const closeModal = () => {
      modal.classList.remove('active');
    };
    modal.querySelector('.btn-close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    modal.querySelector('.qv-add-btn').addEventListener('click', () => {
      const img = modal.querySelector('.quickview-img-holder img');
      if (window.Cart) window.Cart.add(p.id, qty, null, null, img);
      closeModal();
    });

    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }
};

window.Products = Products;
