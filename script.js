const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  
  // Change the toggle button icon based on theme
  if(body.classList.contains('dark-theme')) {
    toggleBtn.textContent = '☀️'; // Sun icon for light mode
  } else {
    toggleBtn.textContent = '🌙'; // Moon icon for dark mode
  }
});
