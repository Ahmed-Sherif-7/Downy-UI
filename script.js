document.getElementById("searchBtn").addEventListener("click", async () => {
  const query = document.getElementById("song").value.trim();
  const loading = document.getElementById("loading");
  const resultsDiv = document.getElementById("results");

  if (!query) {
    alert("Please enter a song name.");
    return;
  }

  resultsDiv.innerHTML = "";
  loading.style.display = "block";

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    loading.style.display = "none";

    if (data.error) {
      alert(data.error);
      return;
    }

    data.results.forEach((song) => {
      const card = document.createElement("div");
      card.className = "song-card";

      card.innerHTML = `
        <h3>${song.title}</h3>
        <img src="${song.thumbnail}" width="200" />
        <br/>
        <a href="/api/download?url=${encodeURIComponent(song.url)}" class="download-btn">Download</a>
      `;

      resultsDiv.appendChild(card);
    });
  } catch (err) {
    loading.style.display = "none";
    console.error("Error:", err);
    alert("Something went wrong. Try again later.");
  }
});



// Start animations 
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

const colors = ["#7649eb", "#f44336", "#9c7eff"];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  for (let i = 0; i < 120; i++) {
    particlesArray.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});
