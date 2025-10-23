// Games Page JavaScript

// Game state management
let currentGame = null;
let gameRunning = false;

// Snake Game Variables
let snakeGame = {
    canvas: null,
    ctx: null,
    snake: [],
    food: {},
    direction: { x: 1, y: 0 },
    score: 0,
    highScore: 0,
    gameLoop: null,
    speed: 150
};

// Typing Game Variables
let typingGame = {
    words: [
        'Unity', 'C#', 'JavaScript', 'Python', 'Game Development',
        'VR', 'AR', 'Mobile Games', 'PC Games', 'Console Games',
        'Blender', 'Photoshop', 'Git', 'Android Studio', 'Unreal Engine',
        'Metaverse', 'Spatial Computing', 'Game Physics', 'UI/UX', '3D Modeling'
    ],
    currentWord: '',
    currentIndex: 0,
    startTime: 0,
    correctChars: 0,
    totalChars: 0,
    wordsCompleted: 0,
    totalWords: 10,
    gameActive: false
};

// Initialize games when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSnakeGame();
    initializeTypingGame();
});

// Game Navigation Functions
function showGame(gameType) {
    // Hide all games
    document.querySelectorAll('.game-area').forEach(area => {
        area.classList.remove('active');
    });
    
    // Show selected game
    const gameArea = document.getElementById(gameType + '-game');
    if (gameArea) {
        gameArea.classList.add('active');
        currentGame = gameType;
        
        // Initialize specific game
        if (gameType === 'snake') {
            initializeSnakeCanvas();
        } else if (gameType === 'keyboard') {
            resetTypingGame();
        }
    }
}

function hideGame() {
    document.querySelectorAll('.game-area').forEach(area => {
        area.classList.remove('active');
    });
    currentGame = null;
    
    // Stop any running games
    if (snakeGame.gameLoop) {
        clearInterval(snakeGame.gameLoop);
        snakeGame.gameLoop = null;
    }
    gameRunning = false;
}

// Snake Game Implementation
function initializeSnakeGame() {
    // Load high score from localStorage
    snakeGame.highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
    updateSnakeStats();
}

function initializeSnakeCanvas() {
    snakeGame.canvas = document.getElementById('snakeCanvas');
    snakeGame.ctx = snakeGame.canvas.getContext('2d');
    
    // Set canvas size for mobile
    if (window.innerWidth <= 768) {
        snakeGame.canvas.width = Math.min(350, window.innerWidth - 40);
        snakeGame.canvas.height = Math.min(350, window.innerWidth - 40);
    }
}

function startSnakeGame() {
    if (gameRunning) return;
    
    // Reset game state
    snakeGame.snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    snakeGame.direction = { x: 1, y: 0 };
    snakeGame.score = 0;
    snakeGame.speed = 150;
    
    // Generate first food
    generateFood();
    
    // Start game loop
    gameRunning = true;
    snakeGame.gameLoop = setInterval(gameStep, snakeGame.speed);
    
    updateSnakeStats();
}

function pauseSnakeGame() {
    if (snakeGame.gameLoop) {
        clearInterval(snakeGame.gameLoop);
        snakeGame.gameLoop = null;
        gameRunning = false;
    } else if (gameRunning) {
        snakeGame.gameLoop = setInterval(gameStep, snakeGame.speed);
    }
}

function resetSnakeGame() {
    if (snakeGame.gameLoop) {
        clearInterval(snakeGame.gameLoop);
        snakeGame.gameLoop = null;
    }
    gameRunning = false;
    snakeGame.score = 0;
    updateSnakeStats();
}

function gameStep() {
    if (!gameRunning) return;
    
    // Move snake head
    const head = { ...snakeGame.snake[0] };
    head.x += snakeGame.direction.x;
    head.y += snakeGame.direction.y;
    
    // Check wall collision
    if (head.x < 0 || head.x >= snakeGame.canvas.width / 20 || 
        head.y < 0 || head.y >= snakeGame.canvas.height / 20) {
        gameOver();
        return;
    }
    
    // Check self collision
    for (let segment of snakeGame.snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    snakeGame.snake.unshift(head);
    
    // Check food collision
    if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
        snakeGame.score += 10;
        snakeGame.speed = Math.max(80, snakeGame.speed - 5);
        generateFood();
        updateSnakeStats();
        
        // Update game loop speed
        if (snakeGame.gameLoop) {
            clearInterval(snakeGame.gameLoop);
            snakeGame.gameLoop = setInterval(gameStep, snakeGame.speed);
        }
    } else {
        snakeGame.snake.pop();
    }
    
    drawSnake();
}

function generateFood() {
    const gridWidth = Math.floor(snakeGame.canvas.width / 20);
    const gridHeight = Math.floor(snakeGame.canvas.height / 20);
    
    do {
        snakeGame.food = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    } while (snakeGame.snake.some(segment => 
        segment.x === snakeGame.food.x && segment.y === snakeGame.food.y
    ));
}

function drawSnake() {
    const ctx = snakeGame.ctx;
    const cellSize = 20;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, snakeGame.canvas.width, snakeGame.canvas.height);
    
    // Draw snake
    snakeGame.snake.forEach((segment, index) => {
        if (index === 0) {
            // Head - brighter color
            ctx.fillStyle = '#00ffe7';
            ctx.shadowColor = '#00ffe7';
            ctx.shadowBlur = 10;
        } else {
            // Body
            ctx.fillStyle = '#00ff88';
            ctx.shadowBlur = 5;
        }
        
        ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize - 2, cellSize - 2);
    });
    
    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.fillRect(snakeGame.food.x * cellSize, snakeGame.food.y * cellSize, cellSize - 2, cellSize - 2);
    
    // Reset shadow
    ctx.shadowBlur = 0;
}

function gameOver() {
    if (snakeGame.gameLoop) {
        clearInterval(snakeGame.gameLoop);
        snakeGame.gameLoop = null;
    }
    gameRunning = false;
    
    // Update high score
    if (snakeGame.score > snakeGame.highScore) {
        snakeGame.highScore = snakeGame.score;
        localStorage.setItem('snakeHighScore', snakeGame.highScore.toString());
    }
    
    updateSnakeStats();
    
    // Show game over message
    alert(`Game Over! Final Score: ${snakeGame.score}`);
}

function updateSnakeStats() {
    document.getElementById('snake-score').textContent = snakeGame.score;
    document.getElementById('snake-high-score').textContent = snakeGame.highScore;
    document.getElementById('snake-speed').textContent = Math.floor((200 - snakeGame.speed) / 20) + 1;
}

// Snake Game Controls
document.addEventListener('keydown', function(e) {
    if (currentGame !== 'snake' || !gameRunning) return;
    
    // Prevent default behavior for all game controls
    e.preventDefault();
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (snakeGame.direction.y === 0) {
                snakeGame.direction = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (snakeGame.direction.y === 0) {
                snakeGame.direction = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (snakeGame.direction.x === 0) {
                snakeGame.direction = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (snakeGame.direction.x === 0) {
                snakeGame.direction = { x: 1, y: 0 };
            }
            break;
        case ' ':
            pauseSnakeGame();
            break;
    }
});

// Typing Game Implementation
function initializeTypingGame() {
    // Set up typing input event listener
    const typingInput = document.getElementById('typing-input');
    typingInput.addEventListener('input', handleTypingInput);
    typingInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkTypingWord();
        }
    });
}

function startTypingGame() {
    typingGame.gameActive = true;
    typingGame.currentIndex = 0;
    typingGame.wordsCompleted = 0;
    typingGame.correctChars = 0;
    typingGame.totalChars = 0;
    typingGame.startTime = Date.now();
    
    // Enable input
    const typingInput = document.getElementById('typing-input');
    typingInput.disabled = false;
    typingInput.focus();
    
    // Start with first word
    nextTypingWord();
    updateTypingStats();
}

function resetTypingGame() {
    typingGame.gameActive = false;
    typingGame.currentIndex = 0;
    typingGame.wordsCompleted = 0;
    typingGame.correctChars = 0;
    typingGame.totalChars = 0;
    
    const typingInput = document.getElementById('typing-input');
    typingInput.disabled = true;
    typingInput.value = '';
    
    document.getElementById('word-display').textContent = 'Press Start to begin!';
    document.getElementById('progress-fill').style.width = '0%';
    updateTypingStats();
}

function nextTypingWord() {
    if (typingGame.wordsCompleted >= typingGame.totalWords) {
        finishTypingGame();
        return;
    }
    
    // Select random word
    typingGame.currentWord = typingGame.words[Math.floor(Math.random() * typingGame.words.length)];
    typingGame.currentIndex = 0;
    
    // Update display
    updateWordDisplay();
    
    // Clear input
    const typingInput = document.getElementById('typing-input');
    typingInput.value = '';
    typingInput.focus();
}

function updateWordDisplay() {
    const wordDisplay = document.getElementById('word-display');
    const word = typingGame.currentWord;
    const index = typingGame.currentIndex;
    
    let html = '';
    for (let i = 0; i < word.length; i++) {
        if (i < index) {
            html += `<span class="correct">${word[i]}</span>`;
        } else if (i === index) {
            html += `<span class="current">${word[i]}</span>`;
        } else {
            html += word[i];
        }
    }
    
    wordDisplay.innerHTML = html;
}

function handleTypingInput(e) {
    if (!typingGame.gameActive) return;
    
    const input = e.target.value;
    const word = typingGame.currentWord;
    
    // Update current index
    typingGame.currentIndex = input.length;
    
    // Update display
    updateWordDisplay();
    
    // Check if word is complete
    if (input === word) {
        checkTypingWord();
    }
}

function checkTypingWord() {
    const input = document.getElementById('typing-input').value;
    const word = typingGame.currentWord;
    
    if (input === word) {
        // Correct word
        typingGame.correctChars += word.length;
        typingGame.totalChars += word.length;
        typingGame.wordsCompleted++;
        
        // Show success effect
        document.getElementById('word-display').innerHTML = 
            `<span style="color: #00ff00;">✓ ${word}</span>`;
        
        // Move to next word after delay
        setTimeout(() => {
            nextTypingWord();
        }, 1000);
    } else {
        // Incorrect word
        typingGame.totalChars += input.length;
        
        // Show error effect
        document.getElementById('word-display').innerHTML = 
            `<span style="color: #ff0000;">✗ ${word}</span>`;
        
        // Clear input and try again
        setTimeout(() => {
            document.getElementById('typing-input').value = '';
            typingGame.currentIndex = 0;
            updateWordDisplay();
        }, 1000);
    }
    
    updateTypingStats();
}

function updateTypingStats() {
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    const progress = typingGame.wordsCompleted;
    
    document.getElementById('typing-wpm').textContent = wpm;
    document.getElementById('typing-accuracy').textContent = accuracy + '%';
    document.getElementById('typing-progress').textContent = `${progress}/${typingGame.totalWords}`;
    
    // Update progress bar
    const progressPercent = (progress / typingGame.totalWords) * 100;
    document.getElementById('progress-fill').style.width = progressPercent + '%';
}

function calculateWPM() {
    if (typingGame.startTime === 0) return 0;
    
    const timeElapsed = (Date.now() - typingGame.startTime) / 1000 / 60; // minutes
    const wordsTyped = typingGame.correctChars / 5; // average word length
    return Math.floor(wordsTyped / timeElapsed) || 0;
}

function calculateAccuracy() {
    if (typingGame.totalChars === 0) return 0;
    return Math.floor((typingGame.correctChars / typingGame.totalChars) * 100);
}

function finishTypingGame() {
    typingGame.gameActive = false;
    
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    
    document.getElementById('word-display').innerHTML = 
        `<div style="color: #00ffe7; font-size: 1.5rem;">
            🎉 Challenge Complete! 🎉<br>
            <div style="font-size: 1rem; margin-top: 1rem;">
                Final WPM: ${wpm}<br>
                Accuracy: ${accuracy}%
            </div>
        </div>`;
    
    document.getElementById('typing-input').disabled = true;
    
    // Show completion message
    setTimeout(() => {
        alert(`Typing Challenge Complete!\nFinal WPM: ${wpm}\nAccuracy: ${accuracy}%`);
    }, 2000);
}

// Initialize AOS animations
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});
