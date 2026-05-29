// --- Configuration ---
const CORRECT_PASSCODE = "300824"; // We can change this later!
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
    else if (this.y < 0) thi
<truncated 14569 bytes>
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

The above content shows the entire, complete file contents of the requested file.
