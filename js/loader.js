/* js/loader.js */

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader-overlay');
  
  if (loader) {
    // Array of fun food emojis to cycle through on the loader plate
    const foodEmojis = ['🍕', '🍔', '🍜', '🥗', '🍩', '🍰', '🍟', '🥤', '🌮', '🍣', '🍛', '🥘', '🍦'];
    const foodEl = loader.querySelector('.loader-food');
    
    let emojiIndex = 0;
    const emojiInterval = setInterval(() => {
      if (foodEl) {
        foodEl.textContent = foodEmojis[emojiIndex];
        emojiIndex = (emojiIndex + 1) % foodEmojis.length;
      }
    }, 220);

    // Fade out loader after 1500ms (ensures animations feel premium and users get wowed by the plate-spin)
    setTimeout(() => {
      clearInterval(emojiInterval);
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      
      // Dispatch event that loader has finished
      window.dispatchEvent(new CustomEvent('loaderFinished'));
      
      // Clean up loader from DOM after transition completes to save resources
      setTimeout(() => {
        loader.remove();
      }, 800);
    }, 1600);
  }
});
