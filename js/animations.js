/* js/animations.js */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll-reveal Observer
  const setupScrollReveal = () => {
    const revealEls = document.querySelectorAll('.reveal-el');
    
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, no need to watch again
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealEls.forEach(el => observer.observe(el));
  };

  // Run scroll reveal setup
  setupScrollReveal();

  // Re-run setup when loader finishes to capture elements that might render late
  window.addEventListener('loaderFinished', () => {
    setupScrollReveal();
  });

  // 2. Parallax Mouse Hover on Hero Section
  const heroSection = document.querySelector('.hero');
  const parallaxLayers = document.querySelectorAll('[data-depth]');

  if (heroSection && parallaxLayers.length > 0) {
    heroSection.addEventListener('mousemove', (e) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const mouseX = e.clientX - width / 2;
      const mouseY = e.clientY - height / 2;

      parallaxLayers.forEach(layer => {
        const depth = parseFloat(layer.getAttribute('data-depth')) || 0.1;
        const moveX = mouseX * depth;
        const moveY = mouseY * depth;
        
        // Apply smooth transition coordinates
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });

    // Reset offsets on mouse leave
    heroSection.addEventListener('mouseleave', () => {
      parallaxLayers.forEach(layer => {
        layer.style.transform = 'translate3d(0, 0, 0)';
        layer.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      });
    });

    // Clear reset transitions on mouse enter
    heroSection.addEventListener('mouseenter', () => {
      parallaxLayers.forEach(layer => {
        layer.style.transition = 'none';
      });
    });
  }

  // 3. Floating particle factory
  const createBgParticles = () => {
    const containers = document.querySelectorAll('[data-particles]');
    
    containers.forEach(container => {
      const count = parseInt(container.getAttribute('data-particles')) || 10;
      
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // Randomize sizes and placement
        const size = Math.random() * 8 + 4;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        Object.assign(particle.style, {
          position: 'absolute',
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--accent-color)',
          borderRadius: '50%',
          opacity: Math.random() * 0.4 + 0.1,
          pointerEvents: 'none',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float-particle ${duration}s linear infinite`,
          animationDelay: `${delay}s`
        });

        container.appendChild(particle);
      }
    });

    // Inject CSS rule for particle movement into style sheet
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float-particle {
        0% {
          transform: translateY(0) translateX(0) rotate(0deg);
          opacity: inherit;
        }
        50% {
          transform: translateY(-80px) translateX(40px) rotate(180deg);
          opacity: 0.6;
        }
        100% {
          transform: translateY(-160px) translateX(0) rotate(360deg);
          opacity: 0;
        }
      }
      .floating-particle {
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
  };

  createBgParticles();
});
