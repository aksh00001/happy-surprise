// --- Configuration ---
const CORRECT_PASSCODE = "300824"; // We can change this later!
const PASSCODE_LENGTH = 6;

// --- Preload Images ---
const ALL_IMAGES = [
  "./images/IMG_20250326_190418.jpg",
  "./images/IMG_20250326_190507.jpg",
  "./images/IMG_20250327_013939.jpg",
  "./images/IMG_20250328_150351.jpg",
  "./images/IMG_20250328_150436.jpg",
  "./images/IMG_20250328_175438.jpg",
  "./images/IMG_20250328_175611.jpg",
  "./images/IMG_20250328_180133.jpg",
  "./images/IMG_20250328_181857.jpg",
  "./images/IMG_20250328_182205.jpg",
  "./images/IMG_20250330_170257.jpg",
  "./images/IMG_20250331_174953.jpg",
  "./images/IMG_20250408_094400.jpg",
  "./images/IMG_20250409_182553_1.jpg",
  "./images/IMG_20250411_182950.jpg"
];

const DOWNSCALED_IMAGES = [];
ALL_IMAGES.forEach((src, idx) => {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 480;
    let width = img.width;
    let height = img.height;
    
    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    } else {
      width = 480;
      height = 320;
    }
    
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    
    // Save the lightweight downscaled image
    DOWNSCALED_IMAGES[idx] = canvas.toDataURL('image/jpeg', 0.85);
  };
});

// --- Background Music (Starts at Landing/Loading Screen) ---
const backgroundAudio = new Audio("./public/music.mp3");
backgroundAudio.loop = true;
backgroundAudio.volume = 0.85;

function startSurpriseMusic() {
  backgroundAudio.play()
    .then(() => {
      // Successfully playing, clean up global interaction listeners
      document.removeEventListener('click', startSurpriseMusic);
      document.removeEventListener('touchstart', startSurpriseMusic);
      document.removeEventListener('keydown', startSurpriseMusic);
    })
    .catch(err => console.log("Autoplay blocked, waiting for user interaction..."));
}

// Attempt immediate autoplay on load
startSurpriseMusic();

// Fallback to start playing as soon as the user touches/clicks anywhere on the page
document.addEventListener('click', startSurpriseMusic);
document.addEventListener('touchstart', startSurpriseMusic);
document.addEventListener('keydown', startSurpriseMusic);

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

let currentPasscode = "";

// --- Particles Background Logic ---
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfParticles = 50; // Adjust for density

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
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
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

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// --- Balloon Animation Logic ---
function createBalloons() {
  const colors = ['#ff3333', '#ff4d4d', '#ff6666', '#ff8080', '#e60000'];
  const numBalloons = 40;

  for (let i = 0; i < numBalloons; i++) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    
    // Randomize properties
    const size = Math.random() * 25 + 45; 
    const left = Math.random() * 100;
    const animDuration = Math.random() * 3.5 + 3.5; 
    const animDelay = Math.random() * 1.5; 
    const color = colors[Math.floor(Math.random() * colors.length)];

    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.25}px`;
    balloon.style.left = `${left}%`;
    balloon.style.animationDuration = `${animDuration}s`;
    balloon.style.animationDelay = `${animDelay}s`;
    balloon.style.backgroundColor = color;
    balloon.style.setProperty('--tail-color', color);

    balloonsContainer.appendChild(balloon);
  }
}

// Hide loading screen after animation
function hideLoadingScreen() {
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      mainContent.classList.remove('hidden');
    }, 1500); 
  }, 4500); 
}

// --- Keypad Logic ---
function updateDots() {
  dots.forEach((dot, index) => {
    if (index < currentPasscode.length) {
      dot.classList.add('filled');
      dot.classList.remove('error');
    } else {
      dot.classList.remove('filled', 'error');
    }
  });
}

function handleKeyPress(key) {
  if (currentPasscode.length < PASSCODE_LENGTH) {
    currentPasscode += key;
    errorMsg.classList.remove('visible');
    
    updateDots();
  }
}

function handleClear() {
  currentPasscode = "";
  errorMsg.classList.remove('visible');
  updateDots();
}

function handleEnter() {
  if (currentPasscode.length !== PASSCODE_LENGTH) return;

  if (currentPasscode === CORRECT_PASSCODE) {
    // Success! 
    dots.forEach(dot => {
      dot.style.background = '#4CAF50';
      dot.style.borderColor = '#4CAF50';
      dot.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.8)';
    });
    
    setTimeout(() => {
      // Transition to next page
      mainContent.style.opacity = '0';
      setTimeout(() => {
        document.body.innerHTML = `
          <div class="bg-animated">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
            <div class="blob blob-3"></div>
          </div>
          <canvas id="particles-canvas-2" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;"></canvas>
          
          <div id="meteors-container" class="meteors-container"></div>
          
          <div class="envelope-scene">
            <div class="envelope-back"></div>
            <div class="envelope-front-left"></div>
            <div class="envelope-front-right"></div>
            <div class="envelope-front-bottom"></div>
            <div class="envelope-flap"></div>
          </div>
          
          <style>
            .envelope-scene {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 10;
              perspective: 1200px;
              width: 480px;
              height: 330px;
              animation: dropInEnvelope 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .envelope-back {
              position: absolute;
              top: 0; left: 0; width: 100%; height: 100%;
              background: #900d1e;
              border-radius: 12px;
              box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 50px rgba(255, 50, 80, 0.4);
              z-index: 1;
            }
            .envelope-front-left {
              position: absolute;
              top: 0; left: 0;
              width: 0; height: 0;
              border-top: 165px solid transparent;
              border-bottom: 165px solid transparent;
              border-left: 240px solid #c71b2d;
              border-radius: 12px 0 0 12px;
              z-index: 3;
            }
            .envelope-front-right {
              position: absolute;
              top: 0; right: 0;
              width: 0; height: 0;
              border-top: 165px solid transparent;
              border-bottom: 165px solid transparent;
              border-right: 240px solid #c71b2d;
              border-radius: 0 12px 12px 0;
              z-index: 3;
            }
            .envelope-front-bottom {
              position: absolute;
              bottom: 0; left: 0;
              width: 0; height: 0;
              border-left: 240px solid transparent;
              border-right: 240px solid transparent;
              border-bottom: 180px solid #e02237;
              border-radius: 0 0 12px 12px;
              z-index: 4;
              filter: drop-shadow(0 -5px 15px rgba(0,0,0,0.25));
            }
            .envelope-flap {
              position: absolute;
              top: 0; left: 0;
              width: 0; height: 0;
              border-left: 240px solid transparent;
              border-right: 240px solid transparent;
              border-top: 195px solid #f02b43;
              transform-origin: top center;
              z-index: 5;
              border-radius: 12px 12px 0 0;
              animation: flapOpen 1.2s 1.5s forwards;
              filter: drop-shadow(0 5px 15px rgba(0,0,0,0.35));
            }
            
            /* Velocity Marquee Styles */
            .velocity-container {
              position: absolute;
              top: 0; left: 0;
              width: 100%; height: 100%;
              display: flex; flex-direction: column;
              align-items: center; justify-content: center;
              overflow: hidden;
              z-index: 20;
              mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
              -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
              transition: opacity 0.8s ease;
            }
            .velocity-row {
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              padding: 20px 0;
              display: flex;
            }
            .velocity-track {
              display: flex;
              width: max-content;
            }
            .track-left {
              transform: translateX(0);
            }
            .track-right {
              transform: translateX(-50%);
            }
            
            .marquee-img {
              width: 240px; height: 160px;
              object-fit: cover;
              border-radius: 8px;
              margin: 0 16px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.4);
              border: 4px solid #fff;
              display: inline-block;
              opacity: 0; /* Hidden until animation finishes */
            }
            
            @keyframes scrollLeft {
              0% { transform: translateX(0) translateZ(0); }
              100% { transform: translateX(-50%) translateZ(0); } 
            }
            @keyframes scrollRight {
              0% { transform: translateX(-50%) translateZ(0); }
              100% { transform: translateX(0) translateZ(0); }
            }
            
            @keyframes dropInEnvelope {
              0% { transform: translate(-50%, -500px) scale(0.2) rotate(-15deg); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
            }
            @keyframes flapOpen {
              0% { transform: rotateX(0deg); z-index: 5; }
              100% { transform: rotateX(180deg); z-index: 1; }
            }
            @keyframes fadeOutEnv {
              0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              100% { opacity: 0; visibility: hidden; transform: translate(-50%, -50%) scale(0.9); }
            }

            /* Heart Collage Styles */
            .heart-container {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
              height: 100%;
              z-index: 30;
              pointer-events: none;
            }
            
            .heart-photo {
              position: absolute;
              width: 130px;
              height: 155px;
              background: #fdfdfd;
              padding: 8px 8px 24px 8px;
              border-radius: 4px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.3);
              border: 1px solid rgba(0,0,0,0.06);
              opacity: 0;
              will-change: transform, opacity;
              display: flex;
              flex-direction: column;
              align-items: center;
              pointer-events: auto; /* Enable hover/clicks on individual photos */
              transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
            }
            
            .heart-photo:hover {
              transform: translate(-50%, -50%) scale(1.22) !important;
              z-index: 9999 !important;
              box-shadow: 0 20px 45px rgba(0,0,0,0.45);
            }
            
            .heart-photo img {
              width: 100%;
              height: 105px;
              object-fit: cover;
              border-radius: 2px;
            }
            
            .heart-photo-caption {
              font-family: 'Caveat', cursive;
              font-size: 1.15rem;
              color: #222;
              margin-top: 4px;
              text-align: center;
              font-weight: 600;
            }

            /* Breathing animation for the entire heart collage */
            .heart-container.beating {
              animation: heartPulse 3s infinite ease-in-out alternate;
            }
            
            @keyframes heartPulse {
              0% { transform: translate(-50%, -50%) scale(1); }
              100% { transform: translate(-50%, -50%) scale(1.03); }
            }
            
            .heart-center-text {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) scale(0);
              font-family: 'Caveat', cursive;
              font-size: 5rem;
              color: #ffffff;
              text-shadow: 0 0 25px rgba(255, 77, 109, 0.95), 0 0 50px rgba(255, 77, 109, 0.7);
              z-index: 10000;
              pointer-events: none;
              opacity: 0;
              transition: all 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              text-align: center;
              white-space: nowrap;
            }
            .heart-center-text.show {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
              animation: textBreathe 2s infinite ease-in-out alternate;
            }
            @keyframes textBreathe {
              0% { transform: translate(-50%, -50%) scale(0.98); text-shadow: 0 0 25px rgba(255, 77, 109, 0.95); }
              100% { transform: translate(-50%, -50%) scale(1.08); text-shadow: 0 0 40px rgba(255, 77, 109, 1), 0 0 60px rgba(255, 77, 109, 0.8); }
            }
            
            .meteors-container {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              pointer-events: none;
              z-index: 3;
            }
            .meteor {
              position: absolute;
              top: 0;
              left: 0;
              width: 1.5px;
              height: 120px;
              background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
              transform: rotate(-35deg);
              opacity: 0;
              pointer-events: none;
              animation: meteorShower 6s linear infinite;
            }
            @keyframes meteorShower {
              0% {
                transform: translate3d(0, 0, 0) rotate(-35deg) scale(0.2);
                opacity: 0;
              }
              10% {
                opacity: 0.85;
              }
              40% {
                transform: translate3d(-350px, 280px, 0) rotate(-35deg) scale(1);
                opacity: 0;
              }
              100% {
                transform: translate3d(-350px, 280px, 0) rotate(-35deg) scale(1);
                opacity: 0;
              }
            }
            
            @media (max-width: 768px) {
              .heart-center-text { font-size: 3.2rem; }
              .heart-photo { width: 90px; height: 110px; padding: 5px 5px 15px 5px; }
              .heart-photo img { height: 75px; }
              .heart-photo-caption { font-size: 0.9rem; margin-top: 2px; }
            }
          </style>
        `;

        // --- Inject Velocity Marquee HTML ---
        const optimizedImages = ALL_IMAGES.map((src, idx) => DOWNSCALED_IMAGES[idx] || src);
        const rowA = optimizedImages.slice(0, 8);
        const rowB = optimizedImages.slice(8);
        
        const renderRowLeft = (images) => {
          let imgs = '';
          images.forEach((src, idx) => {
            imgs += `<img src="${src}" class="marquee-img real-img" data-idx="${idx}" />`;
          });
          images.forEach((src) => {
            imgs += `<img src="${src}" class="marquee-img dup-img" />`;
          });
          return imgs;
        };

        const renderRowRight = (images) => {
          let imgs = '';
          images.forEach((src) => {
            imgs += `<img src="${src}" class="marquee-img dup-img" />`;
          });
          images.forEach((src, idx) => {
            imgs += `<img src="${src}" class="marquee-img real-img" data-idx="${idx + 8}" />`;
          });
          return imgs;
        };

        const velocityHTML = `
          <div class="velocity-container">
            <div class="velocity-row">
              <div class="velocity-track track-left" id="track-left">
                ${renderRowLeft(rowA)}
              </div>
            </div>
            <div class="velocity-row">
              <div class="velocity-track track-right" id="track-right">
                ${renderRowRight(rowB)}
              </div>
            </div>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', velocityHTML);
        
        // --- JS Orchestrated Ejection Animation ---
        setTimeout(() => {
          const targetImgs = document.querySelectorAll('.real-img');
          const dupImgs = document.querySelectorAll('.dup-img');
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          
          targetImgs.forEach((targetImg, i) => {
            // Create a temporary image in the exact center (inside envelope)
            const tempImg = document.createElement('img');
            tempImg.src = targetImg.src;
            tempImg.style.position = 'absolute';
            tempImg.style.width = '240px';
            tempImg.style.height = '160px';
            tempImg.style.objectFit = 'cover';
            tempImg.style.borderRadius = '8px';
            tempImg.style.border = '4px solid #fff';
            tempImg.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
            tempImg.style.left = (centerX - 120) + 'px';
            tempImg.style.top = (centerY - 80) + 'px';
            tempImg.style.zIndex = 30;
            tempImg.style.opacity = 0;
            document.body.appendChild(tempImg);
            
            // Get final static position in the track
            const rect = targetImg.getBoundingClientRect();
            const deltaX = rect.left - (centerX - 120);
            const deltaY = rect.top - (centerY - 80);
            const rotation = (Math.random() - 0.5) * 30;
            
            // Animate it flying out of the envelope and forming the line
            const delay = i * 140; // 140ms stagger between each photo
            const anim = tempImg.animate([
              { transform: 'scale(0.1) translate3d(0,0,0) rotate(0deg)', opacity: 0, offset: 0 },
              { transform: `scale(0.6) translate3d(${deltaX * 0.4}px, ${deltaY - 150}px, 0) rotate(${rotation}deg)`, opacity: 1, offset: 0.4 },
              { transform: `scale(1) translate3d(${deltaX}px, ${deltaY}px, 0) rotate(0deg)`, opacity: 1, offset: 1 }
            ], {
              duration: 800,
              delay: delay,
              easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
              fill: 'forwards'
            });
            
            anim.onfinish = () => {
              targetImg.style.opacity = 1; // Reveal the real image locked in the row
              tempImg.remove(); // Clean up the temp image
              
              // When the very last photo locks into place
              if (i === targetImgs.length - 1) {
                // 1. Fade out the envelope
                const envScene = document.querySelector('.envelope-scene');
                if (envScene) envScene.style.animation = 'fadeOutEnv 1s forwards';
                // 2. Reveal all the backup images for infinite scrolling
                dupImgs.forEach(dup => dup.style.opacity = 1);
                // 3. START the infinite CSS scroll now that the line is perfectly formed!
                const trackLeft = document.getElementById('track-left');
                const trackRight = document.getElementById('track-right');
                if (trackLeft) trackLeft.style.animation = 'scrollLeft 40s linear infinite';
                if (trackRight) trackRight.style.animation = 'scrollRight 40s linear infinite';
                
                // --- PHASE 2: 5-second Hold then fly into a Beating Heart ---
                startHeartTransition();
              }
            };
          });
        }, 1600); // Wait 1.6s for the envelope flap to open before firing
        
        function startHeartTransition() {
          setTimeout(() => {
            // 1. Capture the exact screen position of each of the 15 unique photos
            const realImgs = document.querySelectorAll('.real-img');
            const capturedPositions = [];
            
            realImgs.forEach((img) => {
              const idx = parseInt(img.getAttribute('data-idx'));
              const rect = img.getBoundingClientRect();
              capturedPositions[idx] = {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                src: img.src
              };
            });
            
            // 2. Remove the scrolling marquee container completely
            const marqueeContainer = document.querySelector('.velocity-container');
            if (marqueeContainer) marqueeContainer.remove();
            
            // 3. Inject the Heart Container and the 15 Polaroids at the CAPTURED screen positions!
            const sweetWords = [
              "You ❤️", "Us ✨", "Smile 😊", "Forever ♾️", "My Love 💕",
              "Cutie 🥰", "Happy 💖", "Mine 🔒", "Together 💑", "Always 🌟",
              "Sweetest 🍭", "Warmth 🔥", "Laughs 😂", "Cherish 🧸", "Adore 🌹"
            ];
            
            let heartPhotosHTML = '<div class="heart-container" id="heart-container">';
            optimizedImages.forEach((src, idx) => {
              const caption = sweetWords[idx] || "Love ❤️";
              const pos = capturedPositions[idx];
              // Position them absolutely at the captured screen coordinates
              heartPhotosHTML += `
                <div class="heart-photo" id="photo-${idx}" style="
                  left: ${pos.left + pos.width/2}px;
                  top: ${pos.top + pos.height/2}px;
                  width: ${pos.width}px;
                  height: ${pos.height}px;
                  opacity: 1;
                  transform: translate(-50%, -50%) scale(1) rotate(0deg);
                  z-index: ${idx + 10};
                ">
                  <img src="${src}" alt="Love" />
                  <div class="heart-photo-caption">${caption}</div>
                </div>
              `;
            });
            heartPhotosHTML += '</div>';
            document.body.insertAdjacentHTML('beforeend', heartPhotosHTML);
            
            // 4. Force a browser reflow/repaint
            const container = document.getElementById('heart-container');
            if (container) container.offsetHeight; // Reflow
            
            // 5. Transition them smoothly from their captured positions to their heart shape positions!
            const numPhotos = optimizedImages.length;
            optimizedImages.forEach((src, i) => {
              const photoEl = document.getElementById(`photo-${i}`);
              if (!photoEl) return;
              
              // Map index to angle t along the heart curve
              const t = (i / numPhotos) * 2 * Math.PI;
              
              // Parametric equations for heart shape
              let hx = 16 * Math.pow(Math.sin(t), 3);
              let hy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
              
              // Responsive scale factor (approx 350-400px wide heart)
              const scale = Math.min(window.innerWidth, window.innerHeight) * 0.026;
              
              // Heart target positions relative to screen center
              const targetX = hx * scale;
              const targetY = -hy * scale - 20; // Shift slightly upwards
              
              // Slight natural randomized rotation angle
              const rotation = (Math.random() - 0.5) * 15;
              
              // Stagger delay for gathering into a heart shape
              const delay = i * 60;
              
              const currentPos = capturedPositions[i];
              const currentX = currentPos.left + currentPos.width/2;
              const currentY = currentPos.top + currentPos.height/2;
              
              const screenCenterX = window.innerWidth / 2;
              const screenCenterY = window.innerHeight / 2;
              
              photoEl.animate([
                { 
                  left: `${currentX}px`, 
                  top: `${currentY}px`,
                  width: `${currentPos.width}px`,
                  height: `${currentPos.height}px`,
                  transform: 'translate(-50%, -50%) scale(1) rotate(0deg)' 
                },
                { 
                  left: '50%', 
                  top: '50%',
                  width: '130px',
                  height: '155px',
                  transform: `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(1) rotate(${rotation}deg)` 
                }
              ], {
                duration: 1300,
                delay: delay,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                fill: 'forwards'
              }).onfinish = () => {
                // Lock in the final landing coordinates & styles
                photoEl.style.left = '50%';
                photoEl.style.top = '50%';
                photoEl.style.width = '130px';
                photoEl.style.height = '155px';
                photoEl.style.transform = `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(1) rotate(${rotation}deg)`;
                
                // When the last photo lands
                if (i === numPhotos - 1) {
                  setTimeout(() => {
                    if (container) container.classList.add('beating');
                    
                    // Create and animate the "I Love You" center text
                    const loveText = document.createElement('div');
                    loveText.className = 'heart-center-text';
                    loveText.innerText = 'I Love You ❤️';
                    container.appendChild(loveText);
                    
                    setTimeout(() => {
                      loveText.classList.add('show');
                    }, 200);
                  }, 200);
                }
              };
            });
          }, 5000); // 5 seconds of marquee scrolling before starting the heart transition
        }

        // re-init particles for new body
        const newCanvas = document.getElementById('particles-canvas-2');
        const newCtx = newCanvas.getContext('2d');
        newCanvas.width = window.innerWidth;
        newCanvas.height = window.innerHeight;
        // reuse same particles logic
        function animNew() {
          newCtx.clearRect(0, 0, newCanvas.width, newCanvas.height);
          for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].drawNew(newCtx);
          }
          requestAnimationFrame(animNew);
        }
        Particle.prototype.drawNew = function(cx) {
          cx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
          cx.beginPath();
          cx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          cx.closePath();
          cx.fill();
        }
        // Setup meteor shower
        function startMeteors() {
          const container = document.getElementById('meteors-container');
          if (!container) return;
          const numMeteors = 15;
          for (let i = 0; i < numMeteors; i++) {
            const meteor = document.createElement('div');
            meteor.className = 'meteor';
            
            const startX = Math.random() * window.innerWidth + 200; // Start offset
            const startY = Math.random() * (window.innerHeight * 0.4) - 100;
            const duration = Math.random() * 3 + 4; // 4s to 7s
            const delay = Math.random() * 5; // 0s to 5s delay
            
            meteor.style.left = startX + 'px';
            meteor.style.top = startY + 'px';
            meteor.style.animationDuration = duration + 's';
            meteor.style.animationDelay = delay + 's';
            
            container.appendChild(meteor);
          }
        }
        startMeteors();
        animNew();
      }, 1000);
    }, 800);

  } else {
    // Error
    dots.forEach(dot => dot.classList.add('error'));
    errorMsg.classList.add('visible');
    
    // Add visual shake feedback on keypad
    document.querySelector('.glass-panel').style.animation = 'shake 0.5s';
    setTimeout(() => {
      document.querySelector('.glass-panel').style.animation = '';
    }, 500);

    setTimeout(() => {
      handleClear();
    }, 800);
  }
}

// Event Listeners
keys.forEach(btn => {
  btn.addEventListener('click', () => {
    // Add quick visual feedback scale
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => btn.style.transform = '', 150);
    handleKeyPress(btn.dataset.key);
  });
});

keyClear.addEventListener('click', handleClear);
keyEnter.addEventListener('click', handleEnter);

// Add keyboard support
document.addEventListener('keydown', (e) => {
  if (mainContent.classList.contains('hidden')) return; 
  
  if (e.key >= '0' && e.key <= '9') {
    handleKeyPress(e.key);
  } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key.toLowerCase() === 'c') {
    handleClear();
  } else if (e.key === 'Enter') {
    handleEnter();
  }
});

// Initialize
initParticles();
animateParticles();
createBalloons();
hideLoadingScreen();

// --- Flickering Grid Logic ---
class FlickeringGrid {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.squareSize = 4;
    this.gridGap = 6;
    this.flickerChance = 0.3;
    this.color = 'rgba(255, 150, 160,'; // Soft romantic pinkish-red
    this.maxOpacity = 0.25;
    
    this.squares = new Float32Array(0);
    this.cols = 0;
    this.rows = 0;
    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;
    this.lastTime = 0;
    
    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    
    // Watch for resize events
    const resizeObserver = new ResizeObserver(() => this.resize());
    if (this.canvas.parentElement) {
      resizeObserver.observe(this.canvas.parentElement);
    }
    
    // Initial layout
    setTimeout(this.resize, 0);
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
    
    if (!this.lastTime) {
      this.lastTime = performance.now();
      requestAnimationFrame(this.animate);
    }
  }
  
  animate(time) {
    const deltaTime = Math.min((time - this.lastTime) / 1000, 0.1); // Cap delta time
    this.lastTime = time;
    
    // Update
    for (let i = 0; i < this.squares.length; i++) {
      if (Math.random() < this.flickerChance * deltaTime) {
        this.squares[i] = Math.random() * this.maxOpacity;
      }
    }
    
    // Draw
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