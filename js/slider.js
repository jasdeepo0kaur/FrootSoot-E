/* js/slider.js */

const ReviewSlider = {
  init() {
    const slides = document.querySelectorAll('.review-slide');
    const dotsContainer = document.querySelector('.slider-controls');
    
    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;

    // Reset controls dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          this.goToSlide(idx);
          this.resetTimer();
        });
        dotsContainer.appendChild(dot);
      });
    }

    this.showSlide(0);
    this.startTimer();
  },

  showSlide(index) {
    const slides = document.querySelectorAll('.review-slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (slides.length === 0) return;

    slides.forEach((slide, idx) => {
      slide.classList.remove('active');
      if (dots[idx]) dots[idx].classList.remove('active');
    });

    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    this.currentIndex = index;
  },

  nextSlide() {
    const slides = document.querySelectorAll('.review-slide');
    if (slides.length === 0) return;
    const nextIndex = (this.currentIndex + 1) % slides.length;
    this.showSlide(nextIndex);
  },

  goToSlide(index) {
    this.showSlide(index);
  },

  startTimer() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 6000); // Shift reviews every 6 seconds
  },

  resetTimer() {
    clearInterval(this.autoPlayInterval);
    this.startTimer();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ReviewSlider.init();
});
