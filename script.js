// Initialize AOS animations
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

// Variables for tracking
let mouseX = 0, mouseY = 0;
let lastTime = performance.now();
let frameCount = 0;
let fps = 60;
const cursor = document.getElementById("custom-cursor");
const magneticField = document.getElementById("magneticField");
const tooltip = document.getElementById("tooltip");

// INSANE Hexagonal Cursor with Magnetic Effect
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
  
  // Update HUD coordinates
  document.getElementById('mouseX').textContent = mouseX;
  document.getElementById('mouseY').textContent = mouseY;
  
  // Magnetic field effect
  const magneticElements = document.querySelectorAll('.project-card, .timeline-item, .contact-item, .cv-image-container, .video-card, .download-btn');
  magneticElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
    
    if (distance < 100) {
      document.body.classList.add('cursor-magnetic');
      magneticField.style.left = `${centerX - 50}px`;
      magneticField.style.top = `${centerY - 50}px`;
      magneticField.classList.add('active');
      
      // Magnetic attraction
      const force = (100 - distance) / 100;
      const offsetX = (centerX - mouseX) * force * 0.3;
      const offsetY = (centerY - mouseY) * force * 0.3;
      
      cursor.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    } else {
      document.body.classList.remove('cursor-magnetic');
      magneticField.classList.remove('active');
      cursor.style.transform = 'translate(-50%, -50%)';
    }
  });
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
        document.body.style.filter = document.body.style.filter === 'invert(1)' ? '' : 'invert(1)';
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

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .project-card, .timeline-item, .skill-item, .contact-item, .cv-image-container, .video-card, .download-btn');

hoverElements.forEach(element => {
  element.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-hover');
  });
  
  element.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-hover');
  });
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

// Add dynamic styles for animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  .cursor-trail {
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, #00ffe7, transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transition: opacity 0.3s ease;
  }
  
  .cursor-hover #custom-cursor {
    transform: translate(-50%, -50%) scale(1.5);
  }
  
  .cursor-hover .cursor-hexagon::before {
    background: linear-gradient(45deg, #ff00ff, #00ff00);
    animation-duration: 1s;
  }
  
  .cursor-hover .cursor-ring {
    width: 70px;
    height: 70px;
    border-width: 3px;
  }
`;
document.head.appendChild(dynamicStyles);

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
