/* js/cursor.js */

document.addEventListener('DOMContentLoaded', () => {
  // Desktop check - custom cursor is disabled on mobile/touch screens via CSS and JS
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (isTouchDevice) {
    const cursor = document.getElementById('custom-cursor');
    const dot = document.getElementById('custom-cursor-dot');
    if (cursor) cursor.style.display = 'none';
    if (dot) dot.style.display = 'none';
    return;
  }

  const cursor = document.getElementById('custom-cursor');
  const dot = document.getElementById('custom-cursor-dot');
  
  if (!cursor || !dot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  // Track mouse coordinates
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth trailing logic using lerp (Linear Interpolation)
  const renderCursor = () => {
    // Lerp cursor (outer ring)
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    // Lerp dot (inner pointer)
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;

    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Hover states
  const addHoverEffects = () => {
    const hoverTargets = document.querySelectorAll('a, button, .action-btn, .category-card, .product-card, .wishlist-heart, .qty-btn, [data-hover-expand]');
    
    hoverTargets.forEach(target => {
      // Avoid duplicate listeners
      if (target.dataset.cursorBound) return;
      target.dataset.cursorBound = 'true';

      target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });

      target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        // Reset any magnetic pull
        if (target.classList.contains('magnetic')) {
          target.style.transform = '';
        }
      });

      // Magnetic pull effect on hover (for premium look)
      if (target.classList.contains('magnetic') || target.tagName === 'BUTTON' || target.classList.contains('action-btn')) {
        target.addEventListener('mousemove', (e) => {
          const rect = target.getBoundingClientRect();
          const targetX = rect.left + rect.width / 2;
          const targetY = rect.top + rect.height / 2;
          
          const pullX = (e.clientX - targetX) * 0.25;
          const pullY = (e.clientY - targetY) * 0.25;
          
          target.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.02)`;
        });
        
        target.addEventListener('mouseleave', () => {
          target.style.transform = '';
        });
      }
    });
  };

  // Run hover binds initially
  addHoverEffects();

  // Watch for dynamic DOM modifications to bind new elements
  const observer = new MutationObserver(() => {
    addHoverEffects();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Click pulse animation
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });

  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });
});
