const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");

// Create twinkling stars across the entire page
const stars = [];
const starCount = 40; // Number of stars on the page

// Initialize stars
function initStars() {
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      speed: 0.001 + Math.random() * 0.002,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.3
    });
  }
}

// Create star elements and add to page
function createStarElements() {
  stars.forEach((star, index) => {
    const starElement = document.createElement('div');
    starElement.className = 'twinkling-star';
    starElement.style.left = star.x + 'px';
    starElement.style.top = star.y + 'px';
    starElement.style.width = star.size + 'px';
    starElement.style.height = star.size + 'px';
    starElement.style.animationDelay = Math.random() * 3 + 's';
    starElement.style.animationDuration = (2 + Math.random() * 2) + 's';
    
    document.body.appendChild(starElement);
    
    // Store reference for animation
    star.element = starElement;
  });
}

// Animate stars
function animateStars() {
  stars.forEach(star => {
    const pulse = Math.sin(Date.now() * star.speed + star.phase) * 0.5 + 0.5;
    const currentOpacity = star.opacity + pulse * 0.3;
    
    if (star.element) {
      star.element.style.opacity = currentOpacity;
      star.element.style.transform = `scale(${1 + pulse * 0.2})`;
    }
  });
  
  requestAnimationFrame(animateStars);
}

// Initialize and start star animation
initStars();
createStarElements();
animateStars();

// Handle window resize
window.addEventListener('resize', () => {
  // Remove existing stars
  document.querySelectorAll('.twinkling-star').forEach(star => star.remove());
  
  // Reinitialize stars for new dimensions
  stars.length = 0;
  initStars();
  createStarElements();
});

// Fill the canvas with a solid color (fallback cover)
ctx.fillStyle = "#888"; // grey color
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Optional: load a cover image instead of solid color
const coverImage = new Image();
coverImage.src = "https://via.placeholder.com/300x200/888888/ffffff?text=Scratch+Here";

coverImage.onload = () => {
  ctx.drawImage(coverImage, 0, 0, canvas.width, canvas.height);
};

// Set composite mode to erase instead of draw
ctx.globalCompositeOperation = "destination-out";

let isDrawing = false;
let scratchedPixels = 0;
let totalPixels = canvas.width * canvas.height;
let isRevealed = false;
let lastScratchTime = 0;
let scratchCooldown = 50; // Minimum time between scratch calculations (ms)

// Function to check if 99% is scratched
function checkProgress() {
  const progress = scratchedPixels / totalPixels;
  if (progress >= 0.99 && !isRevealed) {
    revealComplete();
  }
}

// Function to reveal complete name and trigger celebration
function revealComplete() {
  isRevealed = true;
  
  // Clear the scratch canvas completely
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Trigger party popper animation
  createPartyPopper();
  
  console.log("🎉 99% scratched! Complete name revealed!");
}

// Party popper animation
function createPartyPopper() {
  // Create confetti that falls from the top of the entire viewport
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      
      // Position confetti across the entire screen width
      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.top = "-20px"; // Start above the viewport
      
      // Random confetti shapes and sizes
      const shapes = ["circle", "square", "triangle"];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      confetti.className = `confetti confetti-${shape}`;
      
      // Random sizes for more realistic look
      const size = Math.random() * 8 + 4;
      confetti.style.width = size + "px";
      confetti.style.height = size + "px";
      
      // Realistic party popper colors
      const colors = ["#ff6b6b", "#ff8e8e", "#ffb3b3", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#fdcb6e", "#e17055", "#dda0dd", "#98d8c8", "#ff7675"];
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Random rotation and animation delays
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.animationDelay = Math.random() * 2 + "s";
      confetti.style.animationDuration = (Math.random() * 2 + 3) + "s";
      
      // Add to body so it falls from top of image
      document.body.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 6000);
    }, i * 80);
  }
}

function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function startDrawing(e) {
  isDrawing = true;
  scratch(e);
}

function endDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

function scratch(e) {
  if (!isDrawing || isRevealed) return;
  
  const currentTime = Date.now();
  if (currentTime - lastScratchTime < scratchCooldown) {
    // Skip progress calculation if scratching too fast
    return;
  }
  
  const pos = getPointerPos(e);
  
  // Calculate actual scratched area more accurately
  const radius = 20;
  const area = Math.PI * radius * radius;
  
  // Only add area if we haven't scratched this exact position recently
  const scratchKey = `${Math.floor(pos.x / 10)},${Math.floor(pos.y / 10)}`;
  if (!window.scratchedPositions) {
    window.scratchedPositions = new Set();
  }
  
  if (!window.scratchedPositions.has(scratchKey)) {
    window.scratchedPositions.add(scratchKey);
    scratchedPixels += area;
    lastScratchTime = currentTime;
  }
  
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Check progress after each scratch
  checkProgress();
}

// Mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", endDrawing);
canvas.addEventListener("mousemove", scratch);

// Touch events
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchend", endDrawing);
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  scratch(e);
});
