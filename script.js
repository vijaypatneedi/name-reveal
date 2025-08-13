const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");

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

// Function to check if 75% is scratched
function checkProgress() {
  const progress = scratchedPixels / totalPixels;
  if (progress >= 0.75 && !isRevealed) {
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
  
  console.log("🎉 75% scratched! Complete name revealed!");
}

// Party popper animation
function createPartyPopper() {
  // Create confetti that falls from the top of the entire viewport
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      // Position confetti across the entire screen width
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-20px'; // Start above the viewport
      
      // Random confetti shapes and sizes
      const shapes = ['circle', 'square', 'triangle'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      confetti.className = `confetti confetti-${shape}`;
      
      // Random sizes for more realistic look
      const size = Math.random() * 8 + 4;
      confetti.style.width = size + 'px';
      confetti.style.height = size + 'px';
      
      // Realistic party popper colors
      const colors = ['#ff6b6b', '#ff8e8e', '#ffb3b3', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fdcb6e', '#e17055', '#dda0dd', '#98d8c8', '#ff7675'];
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Random rotation and animation delays
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
      
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
  const pos = getPointerPos(e);
  
  // Calculate how many pixels we're scratching
  const radius = 20;
  const area = Math.PI * radius * radius;
  scratchedPixels += area;
  
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
