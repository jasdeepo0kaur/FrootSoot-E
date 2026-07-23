/* js/hero.js */

document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  const slides = [
    {
      title: "The Art of <span>Modern Dining</span>",
      desc: "Every bite tells a story. Taste the craftsmanship of master chefs, delivered with clinical precision to your doorstep.",
      image: "assets/pizza_0.jpg", // Pizza
      video: "assets/pizza.mp4",
      badge: "🍕 Pizza • Truffle Royale",
      rating: "4.9 (142 reviews)",
      time: "20-30 Mins",
      bgColor: "radial-gradient(at 0% 0%, rgba(255, 183, 3, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(255, 107, 53, 0.15) 0px, transparent 50%)"
    },
    {
      title: "Gastronomy <span>Reimagined</span>",
      desc: "Crafted Fresh. Delivered Beautifully. Experience A5 Wagyu cuts and luxury gold toppings cooked by Michelin-starred culinary minds.",
      image: "assets/burger_0.jpg", // Burger
      video: "assets/oven.mp4",
      badge: "🍔 Burger • A5 Wagyu Gold",
      rating: "4.8 (218 reviews)",
      time: "15-25 Mins",
      bgColor: "radial-gradient(at 0% 0%, rgba(56, 176, 0, 0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(255, 107, 53, 0.18) 0px, transparent 50%)"
    },
    {
      title: "Symphony of <span>Flavors</span>",
      desc: "Taste happiness, one plate at a time. Indulge in premium fresh sushi cuts and delicate black caviar dragon rolls.",
      image: "assets/asian_0.jpg", // Sushi
      video: "assets/coffee.mp4",
      badge: "🍣 Sushi • Dragon Caviar Roll",
      rating: "4.9 (198 reviews)",
      time: "20-30 Mins",
      bgColor: "radial-gradient(at 0% 0%, rgba(255, 183, 3, 0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(31, 31, 31, 0.08) 0px, transparent 50%)"
    }
  ];

  let currentHeroIndex = 0;
  const titleEl = heroSection.querySelector('.hero-title');
  const descEl = heroSection.querySelector('.hero-desc');
  
  // Video selectors
  const videoFrameEl = heroSection.querySelector('.hero-video-frame');
  const videoEl = heroSection.querySelector('.hero-video-frame video');
  const videoSourceEl = heroSection.querySelector('.hero-video-frame video source');
  const fallbackImgEl = heroSection.querySelector('.hero-video-frame video img');

  const badgeEl = heroSection.querySelector('.offer-tag span');
  const ratingEl = heroSection.querySelector('.card-rating .floating-card-info h4');
  const timeEl = heroSection.querySelector('.card-delivery .floating-card-info h4');
  const nextBtn = heroSection.querySelector('.hero-next-btn');
  const prevBtn = heroSection.querySelector('.hero-prev-btn');

  // Set initial background image
  if (videoFrameEl && slides[0]) {
    videoFrameEl.style.backgroundImage = `url(${slides[0].image})`;
  }

  // Monitor video playback to trigger opacity transition
  if (videoEl) {
    videoEl.addEventListener('playing', () => {
      videoEl.classList.add('is-playing');
    });
    
    // Trigger play immediately (browsers might block autoplay until user clicks page)
    videoEl.play().then(() => {
      videoEl.classList.add('is-playing');
    }).catch(e => {
      console.log("Autoplay blocked on load, showing image fallback instead.", e);
    });
  }

  const transitionSlide = (index) => {
    // Phase 1: Animate out
    if (titleEl) titleEl.style.transform = 'translateY(-20px)';
    if (titleEl) titleEl.style.opacity = '0';
    if (descEl) descEl.style.transform = 'translateY(15px)';
    if (descEl) descEl.style.opacity = '0';
    
    if (videoFrameEl) {
      videoFrameEl.style.transform = 'scale(0.8) rotate(-15deg)';
      videoFrameEl.style.opacity = '0.2';
    }

    setTimeout(() => {
      // Load index details
      const slide = slides[index];
      
      if (titleEl) titleEl.innerHTML = slide.title;
      if (descEl) descEl.textContent = slide.desc;
      
      // Reset opacity class for transition
      if (videoEl) {
        videoEl.classList.remove('is-playing');
      }

      // Update background fallback image immediately
      if (videoFrameEl) {
        videoFrameEl.style.backgroundImage = `url(${slide.image})`;
      }

      // Swap video source
      if (videoSourceEl && slide.video) {
        videoSourceEl.src = slide.video;
        if (videoEl) {
          videoEl.load();
          videoEl.play().then(() => {
            videoEl.classList.add('is-playing');
          }).catch(e => {
            console.log("Autoplay blocked on transition.", e);
          });
        }
      }
      if (fallbackImgEl) {
        fallbackImgEl.src = slide.image;
      }

      if (badgeEl) badgeEl.textContent = slide.badge;
      if (ratingEl) ratingEl.textContent = slide.rating;
      if (timeEl) timeEl.textContent = slide.time;
      heroSection.style.background = slide.bgColor;

      // Phase 2: Animate in
      setTimeout(() => {
        if (titleEl) {
          titleEl.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
          titleEl.style.transform = 'translateY(0)';
          titleEl.style.opacity = '1';
        }
        if (descEl) {
          descEl.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
          descEl.style.transform = 'translateY(0)';
          descEl.style.opacity = '1';
        }
        if (videoFrameEl) {
          videoFrameEl.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
          videoFrameEl.style.transform = 'scale(1) rotate(0deg)';
          videoFrameEl.style.opacity = '1';
        }
      }, 50);

    }, 400);
  };

  // Add click listeners to slide controls
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentHeroIndex = (currentHeroIndex + 1) % slides.length;
      transitionSlide(currentHeroIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentHeroIndex = (currentHeroIndex - 1 + slides.length) % slides.length;
      transitionSlide(currentHeroIndex);
    });
  }

  // Setup simple click ripple effects on hero primary buttons
  const morphBtn = heroSection.querySelector('.btn-premium');
  if (morphBtn) {
    morphBtn.addEventListener('click', (e) => {
      // Create ripple dot
      const rect = morphBtn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      morphBtn.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
});
