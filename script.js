// Initialize AOS animations
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

// Theme persistence
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }
}

// Initialize theme on page load
initializeTheme();

// Variables for tracking
let mouseX = 0, mouseY = 0;
let lastTime = performance.now();
let frameCount = 0;
let fps = 60;
const tooltip = document.getElementById("tooltip");

// Track mouse position for HUD
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Update HUD coordinates
  const mouseXElement = document.getElementById('mouseX');
  const mouseYElement = document.getElementById('mouseY');
  if (mouseXElement) mouseXElement.textContent = mouseX;
  if (mouseYElement) mouseYElement.textContent = mouseY;
});

// Click Ripple Effect
document.addEventListener('click', (e) => {
  const ripple = document.createElement('div');
  ripple.className = 'cursor-ripple';
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
  
  // Particle burst on click
  createParticleBurst(e.clientX, e.clientY);
  
  // Enhanced particle burst for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .project-card, .timeline-item, .skill-item, .contact-item, .cv-image-container, .video-card, .download-btn, .fab-item');
  interactiveElements.forEach(element => {
    if (element.contains(e.target)) {
      // Create extra particles for interactive elements
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createParticleBurst(
            e.clientX + (Math.random() - 0.5) * 50,
            e.clientY + (Math.random() - 0.5) * 50
          );
        }, i * 100);
      }
    }
  });
});

// Particle Burst System
function createParticleBurst(x, y) {
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle-burst';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    const angle = (i / 8) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    
    particle.style.setProperty('--dx', `${dx}px`);
    particle.style.setProperty('--dy', `${dy}px`);
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
}

// Floating Action Button
const fabContainer = document.getElementById('fabContainer');
const fabMain = document.getElementById('fabMain');

fabMain.addEventListener('click', () => {
  fabContainer.classList.toggle('active');
});

// FAB Menu Actions
document.querySelectorAll('.fab-item').forEach(item => {
  item.addEventListener('click', (e) => {
    const tooltip = e.target.getAttribute('data-tooltip');
    
    switch(tooltip) {
      case 'Toggle Theme':
        document.body.classList.toggle('light-theme');
        // Save theme preference to localStorage
        if (document.body.classList.contains('light-theme')) {
          localStorage.setItem('theme', 'light');
        } else {
          localStorage.setItem('theme', 'dark');
        }
        break;
      case 'Gaming Mode':
        document.body.classList.toggle('konami-activated');
        activateGamingMode();
        break;
      case 'Full Screen':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        break;
      case 'Play Music':
        toggleBackgroundMusic();
        break;
    }
  });
});

// Advanced Tooltip System
document.querySelectorAll('[data-tooltip]').forEach(element => {
  element.addEventListener('mouseenter', (e) => {
    const tooltipText = e.target.getAttribute('data-tooltip');
    tooltip.textContent = tooltipText;
    tooltip.style.left = `${mouseX}px`;
    tooltip.style.top = `${mouseY - 40}px`;
    tooltip.classList.add('show');
  });
  
  element.addEventListener('mouseleave', () => {
    tooltip.classList.remove('show');
  });
});

// FPS Counter
function updateFPS() {
  const now = performance.now();
  frameCount++;
  
  if (now - lastTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (now - lastTime));
    document.getElementById('fps').textContent = fps;
    frameCount = 0;
    lastTime = now;
  }
  
  requestAnimationFrame(updateFPS);
}
updateFPS();

// Real-time Clock
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById('currentTime').textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();

// Sound Visualizer Animation
function animateSoundBars() {
  const bars = document.querySelectorAll('.sound-bar');
  bars.forEach((bar, index) => {
    const height = Math.random() * 40 + 10;
    bar.style.height = `${height}px`;
    bar.style.animationDelay = `${index * 0.1}s`;
  });
}
setInterval(animateSoundBars, 100);

// Konami Code Easter Egg
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.keyCode === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateKonamiMode();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activateKonamiMode() {
  document.body.classList.add('konami-activated');
  
  // Create explosion effect
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      createParticleBurst(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }, i * 50);
  }
  
  // Show secret message
  const secretMsg = document.createElement('div');
  secretMsg.innerHTML = '🎮 KONAMI CODE ACTIVATED! 🎮<br>ULTIMATE GAMING MODE ENABLED!';
  secretMsg.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, #ff00ff, #00ffe7);
    color: #000;
    padding: 20px;
    border-radius: 15px;
    font-family: 'Orbitron', sans-serif;
    font-weight: bold;
    text-align: center;
    z-index: 10000;
    animation: konamiGlow 2s ease-in-out;
    box-shadow: 0 0 50px rgba(255, 0, 255, 0.8);
  `;
  
  document.body.appendChild(secretMsg);
  setTimeout(() => secretMsg.remove(), 3000);
}

function activateGamingMode() {
  // Boost all animations
  document.documentElement.style.setProperty('--animation-speed', '0.5');
  
  // Add screen shake
  document.body.style.animation = 'screenShake 0.5s ease-in-out';
  setTimeout(() => {
    document.body.style.animation = '';
  }, 500);
}

// Background Music Toggle (Mock)
function toggleBackgroundMusic() {
  const musicStatus = document.createElement('div');
  musicStatus.innerHTML = '🎵 Background Music ' + (Math.random() > 0.5 ? 'ON' : 'OFF');
  musicStatus.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    color: #00ffe7;
    padding: 15px 25px;
    border-radius: 10px;
    font-family: 'Orbitron', sans-serif;
    z-index: 10000;
    border: 1px solid #00ffe7;
    animation: fadeInOut 2s ease-in-out forwards;
  `;
  
  document.body.appendChild(musicStatus);
  setTimeout(() => musicStatus.remove(), 2000);
}

// Create floating particles
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (6 + Math.random() * 4) + 's';
    particlesContainer.appendChild(particle);
  }
}
createParticles();

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Enhanced scroll effect for navigation
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  const scrolled = window.scrollY;
  
  if (scrolled > 100) {
    nav.style.background = 'rgba(0, 0, 0, 0.95)';
    nav.style.backdropFilter = 'blur(20px)';
    nav.style.boxShadow = '0 0 40px rgba(0, 255, 231, 0.5)';
  } else {
    nav.style.background = 'rgba(0, 0, 0, 0.9)';
    nav.style.backdropFilter = 'blur(20px)';
    nav.style.boxShadow = '0 0 30px rgba(0, 255, 231, 0.3)';
  }
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});



// Glitch effect trigger on hero title
const glitchTitle = document.querySelector('.glitch');
if (glitchTitle) {
  setInterval(() => {
    if (Math.random() > 0.95) {
      glitchTitle.style.animation = 'none';
      setTimeout(() => {
        glitchTitle.style.animation = '';
      }, 100);
    }
  }, 1000);
}

// Add typing effect to hero title
const heroTitle = document.querySelector('.hero-content h1');
if (heroTitle) {
  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  heroTitle.style.borderRight = '2px solid #00ffe7';
  
  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      heroTitle.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    } else {
      setTimeout(() => {
        heroTitle.style.borderRight = 'none';
      }, 1000);
    }
  };
  
  setTimeout(typeWriter, 1000);
}

// Welcome animation sequence
window.addEventListener('load', () => {
  setTimeout(() => {
    createParticleBurst(window.innerWidth / 2, window.innerHeight / 2);
  }, 1000);
});



// Matrix Code Rain Effect (Optional Enhancement)
function createCodeRain() {
  const codeRain = document.createElement('div');
  codeRain.id = 'codeRain';
  codeRain.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -2;
    opacity: 0.1;
  `;
  
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]()<>+-*='; 
  const columns = Math.floor(window.innerWidth / 20);
  
  for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.className = 'code-column';
    column.style.cssText = `
      position: absolute;
      top: -100px;
      left: ${i * 20}px;
      color: #00ffe7;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 14px;
      animation: codefall ${2 + Math.random() * 3}s linear infinite;
      animation-delay: ${Math.random() * 2}s;
    `;
    
    let text = '';
    for (let j = 0; j < 50; j++) {
      text += characters.charAt(Math.floor(Math.random() * characters.length)) + '\n';
    }
    column.textContent = text;
    
    codeRain.appendChild(column);
  }
  
  document.body.appendChild(codeRain);
}

// Add keyframe for code rain animation
const codeRainStyles = document.createElement('style');
codeRainStyles.textContent = `
  @keyframes codefall {
    0% {
      transform: translateY(-100px);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0;
    }
  }
`;
document.head.appendChild(codeRainStyles);

// Initialize code rain (uncomment to enable)
// createCodeRain();

// Discord copy functionality
function copyDiscord() {
  const discordTag = 'VEONARY#8546';
  navigator.clipboard.writeText(discordTag).then(() => {
    // Show success message
    showNotification('Discord tag copied to clipboard!', 'success');
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = discordTag;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification('Discord tag copied to clipboard!', 'success');
  });
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#00ff88' : '#ff6b6b'};
    color: #000;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    transform: translateX(400px);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Floating Action Button functionality
document.addEventListener('DOMContentLoaded', function() {
  const fabMain = document.getElementById('fabMain');
  const fabMenu = document.querySelector('.fab-menu');
  const fabItems = document.querySelectorAll('.fab-item');
  
  if (fabMain && fabMenu) {
    // Toggle menu
    fabMain.addEventListener('click', function() {
      fabMenu.classList.toggle('active');
      fabMain.classList.toggle('active');
    });
    
    // Theme toggle
    fabItems[0].addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      this.textContent = isDark ? '☀️' : '🌙';
      showNotification(isDark ? 'Dark theme activated!' : 'Light theme activated!', 'success');
    });
    
    // Music toggle
    let isMusicPlaying = false;
    fabItems[1].addEventListener('click', function() {
      isMusicPlaying = !isMusicPlaying;
      this.textContent = isMusicPlaying ? '🔇' : '🎵';
      showNotification(isMusicPlaying ? 'Music started!' : 'Music stopped!', 'success');
      
      // Add music visualization effect
      if (isMusicPlaying) {
        document.body.classList.add('music-mode');
      } else {
        document.body.classList.remove('music-mode');
      }
    });
    
    // Fullscreen toggle
    fabItems[2].addEventListener('click', function() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          this.textContent = '⛶';
          showNotification('Fullscreen mode activated!', 'success');
        });
      } else {
        document.exitFullscreen().then(() => {
          this.textContent = '🖥️';
          showNotification('Fullscreen mode deactivated!', 'success');
        });
      }
    });
    
    // Gaming mode
    let isGamingMode = false;
    fabItems[3].addEventListener('click', function() {
      isGamingMode = !isGamingMode;
      this.textContent = isGamingMode ? '🎮' : '⚡';
      document.body.classList.toggle('gaming-mode');
      showNotification(isGamingMode ? 'Gaming mode activated!' : 'Gaming mode deactivated!', 'success');
      
      if (isGamingMode) {
        // Add gaming effects
        addGamingEffects();
      } else {
        // Remove gaming effects
        removeGamingEffects();
      }
    });
  }
});

// Gaming mode effects
function addGamingEffects() {
  // Add particle effects
  const particles = document.getElementById('particles');
  if (particles) {
    particles.style.animation = 'particleFloat 2s infinite linear';
  }
  
  // Add glitch effect to text
  const glitchTexts = document.querySelectorAll('.glitch');
  glitchTexts.forEach(text => {
    text.style.animation = 'glitch 0.3s infinite';
  });
  
  // Add scanlines effect
  const scanlines = document.createElement('div');
  scanlines.className = 'scanlines';
  scanlines.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      transparent 50%,
      rgba(0, 255, 136, 0.1) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 9999;
    animation: scanlines 0.1s infinite linear;
  `;
  document.body.appendChild(scanlines);
}

function removeGamingEffects() {
  // Remove particle effects
  const particles = document.getElementById('particles');
  if (particles) {
    particles.style.animation = '';
  }
  
  // Remove glitch effect
  const glitchTexts = document.querySelectorAll('.glitch');
  glitchTexts.forEach(text => {
    text.style.animation = '';
  });
  
  // Remove scanlines
  const scanlines = document.querySelector('.scanlines');
  if (scanlines) {
    document.body.removeChild(scanlines);
  }
}

// Add CSS animations for gaming mode
const style = document.createElement('style');
style.textContent = `
  @keyframes scanlines {
    0% { transform: translateY(0); }
    100% { transform: translateY(4px); }
  }
  
  @keyframes particleFloat {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-100vh) rotate(360deg); }
  }
  
  .music-mode .sound-visualizer .sound-bar {
    animation: musicPulse 0.5s infinite alternate;
  }
  
  @keyframes musicPulse {
    0% { height: 20px; }
    100% { height: 60px; }
  }
  
  .gaming-mode {
    filter: contrast(1.2) saturate(1.1);
  }
  
  .gaming-mode .hud-element {
    animation: hudPulse 1s infinite alternate;
  }
  
  @keyframes hudPulse {
    0% { opacity: 0.8; }
    100% { opacity: 1; }
  }
`;
document.head.appendChild(style);
