/* js/offers.js */

// Global Init for Offers Page
function initOffersPage() {
  console.log("FlavorNest Stacked Offers Page Initializing...");
  
  // Register combo product dynamically so that Cart system recognizes it
  registerComboProduct();

  // 1. Confetti Engine Setup
  initConfettiEngine();

  // 2. Background floating items & glows
  setupFloatingBackground();

  // 3. Spin & Win Wheel Setup
  setupSpinWheel();

  // 4. Invite Friend Link Setup
  setupInviteFriend();

  // 5. Copy binds and Order triggers
  setupCopyBindings();

  // 6. Scroll reveal styling classes trigger
  setupScrollReveal();
}

// -----------------------------------------------------------------
// REGISTER COMBO PRODUCT IN FLAVORNEST PRODUCT DATABASE
// -----------------------------------------------------------------
function registerComboProduct() {
  if (window.Products && typeof window.Products.getAll === 'function') {
    const list = window.Products.getAll();
    if (!list.some(p => p.id === 9999)) {
      list.push({
        id: 9999, // use numeric ID
        name: 'Tummy Full Combo',
        category: 'Burgers',
        emoji: '🍔',
        image: 'assets/burger_0.jpg',
        price: 399,
        oldPrice: 579,
        description: 'Tummy Full Combo: Signature Burger + Crispy Fries + Chilled Soft Drink + Dessert',
        sizes: ['Regular Serving'],
        toppings: ['Standard Combo Extras']
      });
    }
  }
}

// -----------------------------------------------------------------
// SCROLL REVEAL ACTIVATION
// -----------------------------------------------------------------
function setupScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-el');
  revealEls.forEach(el => {
    el.classList.add('active');
  });
}

// -----------------------------------------------------------------
// CONFETTI ENGINE
// -----------------------------------------------------------------
let confettiActive = false;
let confettiParticles = [];
const confettiColors = ['#FF6B35', '#FFD166', '#FF4D4F', '#2ECC71', '#3498db', '#9b59b6'];

function initConfettiEngine() {
  let canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -canvas.height - 20;
      this.r = Math.random() * 6 + 4;
      this.d = Math.random() * canvas.height;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.tilt = Math.random() * 10 - 5;
      this.tiltAngleIncremental = Math.random() * 0.07 + 0.02;
      this.tiltAngle = 0;
      this.speed = Math.random() * 3 + 4;
    }
    
    update() {
      this.tiltAngle += this.tiltAngleIncremental;
      this.y += this.speed;
      this.x += Math.sin(this.tiltAngle) * 2;
      this.tilt = Math.sin(this.tiltAngle - this.r/2) * 5;
    }
  }

  window.triggerConfetti = function() {
    if (confettiActive) return;
    confettiActive = true;
    confettiParticles = [];
    for (let i = 0; i < 150; i++) {
      confettiParticles.push(new Particle());
    }
    
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let particlesRunning = false;
      confettiParticles.forEach(p => {
        if (p.y < canvas.height) {
          particlesRunning = true;
          p.update();
          ctx.beginPath();
          ctx.lineWidth = p.r;
          ctx.strokeStyle = p.color;
          ctx.moveTo(p.x + p.tilt + p.r/2, p.y);
          ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r/2);
          ctx.stroke();
        }
      });

      if (particlesRunning && confettiActive) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiActive = false;
      }
    }
    draw();

    setTimeout(() => {
      confettiActive = false;
    }, 4500);
  };
}

// -----------------------------------------------------------------
// BACKGROUND FLOATING AND GLOW ELEMENTS
// -----------------------------------------------------------------
function setupFloatingBackground() {
  const container = document.querySelector('.bg-floating-container');
  if (!container) return;

  const emojis = ['🍔', '🍕', '🍟', '✨', '🥤', '🍰', '🍟', '✨'];
  const count = 15;

  for (let i = 0; i < count; i++) {
    const item = document.createElement('div');
    item.className = 'bg-floating-item';
    item.textContent = emojis[i % emojis.length];
    
    const size = Math.random() * 1.5 + 1.2; // 1.2rem - 2.7rem
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * -20;
    const duration = Math.random() * 15 + 15; // 15s to 30s
    const rotation = Math.random() * 360;

    Object.assign(item.style, {
      fontSize: `${size}rem`,
      left: `${left}%`,
      top: `${top}%`,
      transform: `rotate(${rotation}deg)`,
      animation: `float-slow ${duration}s infinite ease-in-out`,
      animationDelay: `${delay}s`
    });

    container.appendChild(item);
  }

  // Inject keyframe dynamically if not present
  if (!document.getElementById('floating-keyframe-style')) {
    const style = document.createElement('style');
    style.id = 'floating-keyframe-style';
    style.textContent = `
      @keyframes float-slow {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-25px) rotate(15deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

// -----------------------------------------------------------------
// SPIN & WIN WHEEL
// -----------------------------------------------------------------
function setupSpinWheel() {
  const canvas = document.getElementById('wheel-canvas');
  const spinBtn = document.getElementById('wheel-spin-btn');
  
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const segments = [
    { text: '10% OFF', color: '#FF6B35', code: 'SPIN10' },
    { text: '15% OFF', color: '#FFD166', code: 'SPIN15' },
    { text: '20% OFF', color: '#FF4D4F', code: 'SPIN20' },
    { text: 'FREE Fries 🍟', color: '#2ECC71', code: 'FREEFRIES' },
    { text: 'FREE Drink 🥤', color: '#3498db', code: 'FREEDRINK' },
    { text: 'Buy 1 Get 1 🍔', color: '#9b59b6', code: 'BOGO' },
    { text: 'Better Luck', color: '#95a5a6', code: null }
  ];

  const size = 300;
  canvas.width = size;
  canvas.height = size;
  const center = size / 2;
  const radius = size / 2 - 8;
  const anglePerSegment = (Math.PI * 2) / segments.length;

  function drawWheel() {
    ctx.clearRect(0, 0, size, size);
    
    segments.forEach((seg, i) => {
      const startAngle = i * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 11px "Outfit", sans-serif';
      
      const textX = radius - 15;
      if (seg.text.includes(' ') && seg.text.length > 8) {
        const parts = seg.text.split(' ');
        ctx.fillText(parts[0], textX, -5);
        ctx.fillText(parts.slice(1).join(' '), textX, 7);
      } else {
        ctx.fillText(seg.text, textX, 4);
      }
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#1F1F1F';
    ctx.lineWidth = 3.5;
    ctx.stroke();
  }

  drawWheel();

  let hasSpunSession = false;

  spinBtn.addEventListener('click', () => {
    if (hasSpunSession) return;
    
    hasSpunSession = true;
    spinBtn.classList.add('disabled');
    
    const winningIndex = Math.floor(Math.random() * segments.length);
    const winItem = segments[winningIndex];

    const segmentDeg = 360 / segments.length;
    const offset = segmentDeg / 2;
    const targetDegrees = 360 - (winningIndex * segmentDeg) - offset + 270;
    const finalSpinDeg = 2160 + (targetDegrees % 360);

    const wheelWrapper = document.getElementById('wheel-wrapper');
    wheelWrapper.style.transition = 'transform 5.5s cubic-bezier(0.1, 0.8, 0.2, 1)';
    wheelWrapper.style.transform = `rotate(${finalSpinDeg}deg)`;

    setTimeout(() => {
      showSpinWinningAlert(winItem);
      
      setTimeout(() => {
        wheelWrapper.style.transition = 'none';
        wheelWrapper.style.transform = `rotate(${finalSpinDeg % 360}deg)`;
      }, 500);

    }, 5500);
  });

  function showSpinWinningAlert(item) {
    if (window.triggerConfetti) window.triggerConfetti();

    let overlay = document.getElementById('spin-win-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'spin-win-modal';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    const title = item.code ? '🏆 Congratulations!' : '🍀 Better Luck Next Time';
    const emoji = item.code ? '🎁' : '🍀';
    const message = item.code 
      ? `You spun the wheel and won <strong>${item.text}</strong>!<br>Copy and apply your coupon code below.`
      : `Oh no! You spun and landed on <strong>Better Luck Next Time</strong>. Better luck on your next visit!`;
    
    const couponHTML = item.code ? `
      <div class="scratch-code-box" style="margin-top: 1.5rem;" onclick="copyCouponCode('${item.code}', this)">
        ${item.code}
      </div>
      <div class="scratch-copy-tip">Click Code to Copy</div>
    ` : '';

    overlay.innerHTML = `
      <div class="modal-content-wrapper" style="max-width: 400px; text-align: center;">
        <div class="modal-header-section">
          <h3 style="width:100%; justify-content:center; margin:0;">Spin Result</h3>
          <button class="modal-close-trigger" onclick="closeSpinModal()">&times;</button>
        </div>
        <div class="modal-body-section" style="padding: 2.5rem 1.8rem;">
          <div style="font-size: 3.8rem; margin-bottom: 0.8rem;">${emoji}</div>
          <h2 style="font-family:var(--font-heading); font-weight:800; margin-bottom: 0.8rem;">${title}</h2>
          <p style="color:var(--text-muted); font-size:0.95rem; line-height: 1.5;">${message}</p>
          ${couponHTML}
          <button class="btn-premium" style="margin-top: 2rem; width:100%;" onclick="closeSpinModal()">
            <span>Awesome!</span>
          </button>
        </div>
      </div>
    `;

    overlay.classList.add('active');
  }

  window.closeSpinModal = function() {
    const overlay = document.getElementById('spin-win-modal');
    if (overlay) overlay.classList.remove('active');
  };
}

// -----------------------------------------------------------------
// INVITE FRIEND LOGIC
// -----------------------------------------------------------------
function setupInviteFriend() {
  const inviteBtn = document.getElementById('invite-now-btn');
  if (!inviteBtn) return;

  inviteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const referralLink = window.location.origin + '?ref=FLAVORNEST150';
    
    navigator.clipboard.writeText(referralLink).then(() => {
      if (window.triggerConfetti) window.triggerConfetti();
      if (window.Toast) window.Toast.show('🎉 Invite Link Copied! Share with friends to earn credits.', 'success');
      
      const originalText = inviteBtn.innerHTML;
      inviteBtn.innerHTML = '<span>Link Copied!</span>';
      setTimeout(() => {
        inviteBtn.innerHTML = originalText;
      }, 2500);
    }).catch(err => {
      console.error('Referral copy failed:', err);
    });
  });
}

// -----------------------------------------------------------------
// COPY BINDINGS & CLIPBOARD
// -----------------------------------------------------------------
function setupCopyBindings() {
  window.copyCouponCode = function(code, btnEl) {
    if (!code) return;

    navigator.clipboard.writeText(code).then(() => {
      if (window.triggerConfetti) window.triggerConfetti();

      if (window.Toast) {
        window.Toast.show(`Coupon "${code}" Copied Successfully!`, 'success');
      }

      if (window.Cart && typeof window.Cart.applyCoupon === 'function') {
        window.Cart.applyCoupon(code);
      }

      if (btnEl) {
        const originalHTML = btnEl.innerHTML;
        btnEl.classList.add('copied');
        btnEl.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        
        setTimeout(() => {
          btnEl.classList.remove('copied');
          btnEl.innerHTML = originalHTML;
        }, 2200);
      }
    }).catch(err => {
      console.error('Failed to copy code: ', err);
      if (window.Toast) window.Toast.show('Failed to copy coupon code.', 'info');
    });
  };

  const orderComboBtn = document.getElementById('order-combo-btn');
  if (orderComboBtn) {
    orderComboBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (window.Cart && typeof window.Cart.add === 'function') {
        window.Cart.add(9999, 1);
        if (window.triggerConfetti) window.triggerConfetti();
        if (window.Toast) window.Toast.show('🎉 Tummy Full Combo added to cart!', 'success');
      } else {
        if (window.Toast) window.Toast.show('Cart system not available.', 'info');
      }
    });
  }
}
