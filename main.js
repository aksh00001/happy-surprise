// --- Configuration ---
const CORRECT_PASSCODE = "300824";
const PASSCODE_LENGTH = 6;

// --- DOM Elements ---
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const balloonsContainer = document.getElementById('balloons-container');
const dots = document.querySelectorAll('.dot');
const keys = document.querySelectorAll('.key[data-key]');
const keyClear = document.getElementById('key-clear');
const keyEnter = document.getElementById('key-enter');
const errorMsg = document.getElementById('error-msg');
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
const photoContainer = document.getElementById('photo-container');
const blurImg = document.getElementById('blur-img');
const highResImg = document.getElementById('high-res-img');

let currentPasscode = "";

// --- Dynamic Image Downscaling ---
if (highResImg && photoContainer) {
  // Check if already cached/loaded
  if (highResImg.complete) {
    photoContainer.classList.add('loaded');
  } else {
    highResImg.addEventListener('load', () => {
      photoContainer.classList.add('loaded');
    });
  }
}

// --- Particles Background Logic ---
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfParticles = 50; 

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width) this.x = 0;
    else if (this.x < 0) this.x = canvas.width;
    
    if (this.y > canvas.height) this.y = 0;
    else if (this.y < 0) this.y = canvas.height;
  }
  draw() {
    ctx.fillStyle = `rgba(255, 77, 109, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

function initParticles() {
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// --- Balloon Logic ---
function createBalloons() {
  const colors = ['#ff4d6d', '#ffb3c1', '#c9184a', '#ff758f', '#ff8fa3'];
  for (let i = 0; i < 15; i++) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.innerText = '🎈';
    
    // Randomize positioning and animation
    balloon.style.left = `${Math.random() * 100}vw`;
    balloon.style.color = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.fontSize = `${Math.random() * 2 + 2}rem`;
    balloon.style.animationDuration = `${Math.random() * 3 + 4}s`;
    balloon.style.animationDelay = `${Math.random() * 2}s`;
    
    balloonsContainer.appendChild(balloon);
  }
}

function hideLoadingScreen() {
  setTimeout(() => {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      mainContent.classList.remove('hidden');
    }, 1000); 
  }, 3000); // 3 seconds loading
}

// Start sequence
createBalloons();
hideLoadingScreen();

// --- Passcode Logic ---
function updateDots() {
  dots.forEach((dot, index) => {
    if (index < currentPasscode.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });
  errorMsg.style.opacity = '0';
  document.querySelector('.dots-container').classList.remove('shake');
}

function handleKeyPress(key) {
  if (currentPasscode.length < PASSCODE_LENGTH) {
    currentPasscode += key;
    updateDots();
  }
}

function handleClear() {
  currentPasscode = "";
  updateDots();
}

function handleEnter() {
  if (currentPasscode === CORRECT_PASSCODE) {
    // SUCCESS
    mainContent.style.opacity = '0';
    setTimeout(() => {
      document.body.innerHTML = `
        <div class="success-screen" id="success-screen" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; color:white; overflow: hidden; position: relative;">
           
           <div class="envelope-container">
             <div class="envelope">
               <div class="envelope-back"></div>
               <div class="photos-wrapper">
                 <img src="./images/IMG_20250326_190418.jpg" class="env-photo photo-1">
                 <img src="./images/IMG_20250327_013939.jpg" class="env-photo photo-2">
                 <img src="./images/IMG_20250328_175611.jpg" class="env-photo photo-3">
                 <img src="./images/IMG_20250328_181857.jpg" class="env-photo photo-4">
                 <img src="./images/IMG_20250408_094400.jpg" class="env-photo photo-5">
               </div>
               <div class="envelope-front"></div>
               <div class="envelope-flap"></div>
             </div>
           </div>
           
           <div class="success-text" style="opacity: 0; position: absolute; bottom: 10%;">
             <h1 style="font-size:3rem; font-family:'Outfit', sans-serif; text-shadow: 0 0 20px rgba(255,255,255,0.5);">Yayy! You got it! ❤️</h1>
             <p style="font-size:1.5rem; margin-top:20px; font-family:'Caveat', cursive; text-align: center;">I love youuuu!</p>
           </div>
           
        </div>
      `;

      // Trigger animations
      setTimeout(() => {
        const flap = document.querySelector('.envelope-flap');
        if (flap) flap.classList.add('open');
        
        setTimeout(() => {
          const photos = document.querySelectorAll('.env-photo');
          photos.forEach((photo, index) => {
            setTimeout(() => {
              photo.classList.add('pop-out');
            }, index * 400); // one by one
          });
          
          setTimeout(() => {
             const txt = document.querySelector('.success-text');
             if (txt) txt.style.animation = 'fadeInUp 1s forwards';
          }, photos.length * 400 + 500);
          
        }, 800); // Wait for flap
      }, 500);

    }, 1000);

  } else {
    // ERROR
    errorMsg.style.opacity = '1';
    const dotsContainer = document.querySelector('.dots-container');
    dotsContainer.classList.add('shake');
    dots.forEach(dot => dot.classList.add('error'));
    
    setTimeout(() => {
      dots.forEach(dot => dot.classList.remove('error'));
      handleClear();
    }, 800);
  }
}

// Event Listeners for Keypad
keys.forEach(key => {
  key.addEventListener('click', () => {
    handleKeyPress(key.getAttribute('data-key'));
  });
});

keyClear.addEventListener('click', handleClear);
keyEnter.addEventListener('click', handleEnter);

// Physical Keyboard Support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') {
    handleKeyPress(e.key);
  } else if (e.key === 'Backspace' || e.key === 'Escape') {
    handleClear();
  } else if (e.key === 'Enter') {
    handleEnter();
  }
});

// --- 3D Mouse Parallax Effect ---
const polaroid = document.getElementById('polaroid-card');
const keypadCard = document.getElementById('keypad-card');

function applyParallax(element, e) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -10; 
  const rotateY = ((x - centerX) / centerX) * 10;
  
  element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
}

function resetParallax(element) {
  if (!element) return;
  element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
}

if (polaroid) {
  polaroid.addEventListener('mousemove', (e) => applyParallax(polaroid, e));
  polaroid.addEventListener('mouseleave', () => resetParallax(polaroid));
}

if (keypadCard) {
  keypadCard.addEventListener('mousemove', (e) => applyParallax(keypadCard, e));
  keypadCard.addEventListener('mouseleave', () => resetParallax(keypadCard));
}

// --- Flickering Grid Effect (Aceternity UI) ---
class FlickeringGrid {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.squareSize = 4;
    this.gridGap = 6;
    this.color = 'rgba(255, 77, 109, '; // Red accent
    this.maxOpacity = 0.3;
    this.flickerChance = 0.3;
    this.dpr = window.devicePixelRatio || 1;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }
  
  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    
    this.cols = Math.ceil(this.width / (this.squareSize + this.gridGap));
    this.rows = Math.ceil(this.height / (this.squareSize + this.gridGap));
    
    this.squares = new Float32Array(this.cols * this.rows);
    for (let i = 0; i < this.squares.length; i++) {
      this.squares[i] = Math.random() * this.maxOpacity;
    }
  }
  
  animate(time) {
    if (!this.lastTime) this.lastTime = time;
    const deltaTime = Math.min((time - this.lastTime) / 1000, 0.1); 
    this.lastTime = time;
    
    for (let i = 0; i < this.squares.length; i++) {
      if (Math.random() < this.flickerChance * deltaTime) {
        this.squares[i] = Math.random() * this.maxOpacity;
      }
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const opacity = this.squares[i * this.rows + j];
        this.ctx.fillStyle = `${this.color}${opacity})`;
        this.ctx.fillRect(
          i * (this.squareSize + this.gridGap) * this.dpr,
          j * (this.squareSize + this.gridGap) * this.dpr,
          this.squareSize * this.dpr,
          this.squareSize * this.dpr
        );
      }
    }
    
    requestAnimationFrame(this.animate);
  }
}

new FlickeringGrid('flickering-grid');