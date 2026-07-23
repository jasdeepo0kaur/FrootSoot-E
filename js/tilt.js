/* js/tilt.js */
/**
 * 3D Tilt Effect for FlavorNest premium interface cards
 * Creates smooth parallax tilting based on mouse coordinate positioning
 */

document.addEventListener('DOMContentLoaded', () => {
  const initTilt = () => {
    // Target both the circular hero video card and normal food product cards
    const tiltElements = document.querySelectorAll('.hero-video-frame, .product-card');
    
    tiltElements.forEach(el => {
      const parent = el.parentElement;
      if (parent) {
        parent.style.perspective = '1000px';
      }
      
      el.style.transformStyle = 'preserve-3d';
      el.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)';
      
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  
        
        const width = rect.width;
        const height = rect.height;
        
        // Calculate rotation ranges (tilting up to 12 degrees)
        const rotateX = ((y / height) - 0.5) * -24; 
        const rotateY = ((x / width) - 0.5) * 24;   
        
        // Apply 3D rotation and dynamic scale
        el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      });
      
      el.addEventListener('mouseleave', () => {
        // Return smoothly to center state
        el.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        el.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
      
      el.addEventListener('mouseenter', () => {
        // Fast response transition for mouse entry
        el.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)';
      });
    });
  };

  initTilt();

  // Recheck for new dynamically injected products (e.g. category toggles)
  document.addEventListener('productsRendered', () => {
    initTilt();
  });
});
