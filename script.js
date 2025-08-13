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
  if (!isDrawing) return;
  const pos = getPointerPos(e);
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
  ctx.fill();
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
