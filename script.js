document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  toggleBtn.addEventListener('click', () => {
    console.log("Toggle button clicked");

    body.classList.toggle('dark-theme');

    if(body.classList.contains('dark-theme')) {
      toggleBtn.textContent = '☀️'; // sun icon
    } else {
      toggleBtn.textContent = '🌙'; // moon icon
    }
  });
});

const cursor = document.createElement("div");
cursor.id = "custom-cursor";
document.body.appendChild(cursor);

document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

