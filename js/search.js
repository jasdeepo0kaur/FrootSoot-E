/* js/search.js */

document.addEventListener('DOMContentLoaded', () => {
  const searchTriggers = document.querySelectorAll('.search-trigger');
  
  // Set up modal elements if not in HTML
  let searchOverlay = document.getElementById('search-overlay');
  
  if (!searchOverlay) {
    searchOverlay = document.createElement('div');
    searchOverlay.id = 'search-overlay';
    searchOverlay.className = 'search-modal-overlay'; // Or reuse a standard modal-overlay class
    document.body.appendChild(searchOverlay);
  }

  // Populate search markup dynamically if empty
  if (searchOverlay.innerHTML.trim() === '') {
    searchOverlay.innerHTML = `
      <div class="search-box-wrapper">
        <div class="search-input-container glass-panel">
          <div class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input type="text" id="search-input" placeholder="Type a dish, flavor or category..." autocomplete="off">
          <div class="btn-close-modal search-close-btn" style="position: static; width:36px; height:36px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
        <div class="search-results-container glass-panel" style="display: none;">
          <div class="search-results-list"></div>
        </div>
      </div>
    `;
  }

  const searchInput = searchOverlay.querySelector('#search-input');
  const resultsContainer = searchOverlay.querySelector('.search-results-container');
  const resultsList = searchOverlay.querySelector('.search-results-list');
  const closeBtn = searchOverlay.querySelector('.search-close-btn');

  const openSearch = () => {
    searchOverlay.style.opacity = '0';
    searchOverlay.style.visibility = 'visible';
    searchOverlay.id = 'search-overlay';
    searchOverlay.className = 'active'; // We toggle classes for styling
    searchOverlay.style.opacity = '';
    searchOverlay.style.visibility = '';
    
    setTimeout(() => {
      searchInput.focus();
    }, 200);
  };

  const closeSearch = () => {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    resultsContainer.style.display = 'none';
  };

  // Bind trigger buttons
  searchTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  // Escape key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
  });

  // Live input filtering
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length < 2) {
      resultsContainer.style.display = 'none';
      return;
    }

    const items = window.Products ? window.Products.search(val) : [];
    resultsContainer.style.display = 'block';
    resultsList.innerHTML = '';

    if (items.length === 0) {
      resultsList.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
          No dishes match "${val}". Try "Pizza", "Salad", or "Cake".
        </div>
      `;
      return;
    }

    const highlightText = (text, query) => {
      if (!query) return text;
      const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      return text.replace(regex, '<span class="search-highlight">$1</span>');
    };

    items.forEach(p => {
      const itemEl = document.createElement('div');
      itemEl.className = 'search-result-item';
      
      const linkPath = window.location.pathname.includes('/pages/') ? 'product.html' : 'pages/product.html';
      const highlightedName = highlightText(p.name, val);
      const highlightedCategory = highlightText(p.category, val);
      
      itemEl.innerHTML = `
        <div class="search-result-img-wrapper" style="position:relative; width: 48px; height: 48px; border-radius: var(--radius-sm); overflow:hidden; flex-shrink:0; display:flex; justify-content:center; align-items:center; background:linear-gradient(135deg, rgba(255,183,3,0.1), rgba(255,0,127,0.1));">
          <img src="${window.getLocalImagePath ? window.getLocalImagePath(p.image) : p.image}" class="search-result-img" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div class="search-result-info">
          <h4>${highlightedName}</h4>
          <p>${highlightedCategory} • ₹${p.price.toFixed(0)}</p>
        </div>
      `;

      itemEl.addEventListener('click', () => {
        if (window.Storage) window.Storage.setProductDetailId(p.id);
        window.location.href = `${linkPath}?id=${p.id}`;
      });

      resultsList.appendChild(itemEl);
    });
  });
});
