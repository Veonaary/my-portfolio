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

// Tetris Game Variables
let tetrisGame = {
    canvas: null,
    ctx: null,
    nextCanvas: null,
    nextCtx: null,
    board: [],
    currentPiece: null,
    nextPiece: null,
    score: 0,
    lines: 0,
    level: 1,
    highScore: 0,
    gameLoop: null,
    dropTime: 0,
    dropInterval: 1000,
    gameActive: false,
    // Tetris pieces (I, O, T, S, Z, J, L)
    pieces: [
        { shape: [[1,1,1,1]], color: '#00ffe7' }, // I
        { shape: [[1,1],[1,1]], color: '#ff00ff' }, // O
        { shape: [[0,1,0],[1,1,1]], color: '#ffff00' }, // T
        { shape: [[0,1,1],[1,1,0]], color: '#00ff00' }, // S
        { shape: [[1,1,0],[0,1,1]], color: '#ff6600' }, // Z
        { shape: [[1,0,0],[1,1,1]], color: '#0066ff' }, // J
        { shape: [[0,0,1],[1,1,1]], color: '#ff0066' }  // L
    ]
};

// Check if device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768 && window.matchMedia("(pointer: coarse)").matches);
}

// Game Navigation Functions
function showGame(gameType) {
    // Check if mobile and trying to play snake/tetris
    if ((gameType === 'snake' || gameType === 'tetris') && isMobileDevice()) {
        alert('This game is not available on mobile devices. Please use a desktop or tablet with keyboard controls.');
        return;
    }
    
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
        } else if (gameType === 'tetris') {
            initializeTetrisCanvas();
        }
    }
}

// Initialize games when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if mobile and disable games
    if (isMobileDevice()) {
        const mobileMessage = document.getElementById('mobileGameMessage');
        if (mobileMessage) {
            mobileMessage.classList.add('show');
        }
        
        // Disable snake and tetris cards on mobile
        const snakeCard = document.getElementById('snake-card');
        const tetrisCard = document.getElementById('tetris-card');
        if (snakeCard) snakeCard.classList.add('disabled');
        if (tetrisCard) tetrisCard.classList.add('disabled');
    }
    
    initializeSnakeGame();
    initializeTypingGame();
    initializeTetrisGame();
});

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
    
    // Wrap around walls instead of game over
    const gridWidth = Math.floor(snakeGame.canvas.width / 20);
    const gridHeight = Math.floor(snakeGame.canvas.height / 20);
    
    if (head.x < 0) {
        head.x = gridWidth - 1;
    } else if (head.x >= gridWidth) {
        head.x = 0;
    }
    
    if (head.y < 0) {
        head.y = gridHeight - 1;
    } else if (head.y >= gridHeight) {
        head.y = 0;
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

// Tetris Game Implementation
function initializeTetrisGame() {
    // Load high score from localStorage
    tetrisGame.highScore = parseInt(localStorage.getItem('tetrisHighScore') || '0');
    updateTetrisStats();
}

function initializeTetrisCanvas() {
    tetrisGame.canvas = document.getElementById('tetrisCanvas');
    tetrisGame.ctx = tetrisGame.canvas.getContext('2d');
    tetrisGame.nextCanvas = document.getElementById('nextPieceCanvas');
    tetrisGame.nextCtx = tetrisGame.nextCanvas.getContext('2d');
    
    // Set canvas size for mobile
    if (window.innerWidth <= 768) {
        tetrisGame.canvas.width = Math.min(250, window.innerWidth - 40);
        tetrisGame.canvas.height = Math.min(500, window.innerHeight - 200);
    }
    
    // Initialize board
    initializeTetrisBoard();
}

function initializeTetrisBoard() {
    const rows = Math.floor(tetrisGame.canvas.height / 30);
    const cols = Math.floor(tetrisGame.canvas.width / 30);
    
    tetrisGame.board = [];
    for (let y = 0; y < rows; y++) {
        tetrisGame.board[y] = [];
        for (let x = 0; x < cols; x++) {
            tetrisGame.board[y][x] = 0;
        }
    }
}

function startTetrisGame() {
    if (tetrisGame.gameActive) return;
    
    // Reset game state
    tetrisGame.score = 0;
    tetrisGame.lines = 0;
    tetrisGame.level = 1;
    tetrisGame.dropInterval = 1000;
    tetrisGame.gameActive = true;
    
    // Initialize board
    initializeTetrisBoard();
    
    // Generate first pieces
    tetrisGame.nextPiece = getRandomPiece();
    spawnNewPiece();
    
    // Start game loop
    tetrisGame.gameLoop = setInterval(tetrisGameStep, 16); // 60 FPS
    
    updateTetrisStats();
    drawTetris();
}

function pauseTetrisGame() {
    if (tetrisGame.gameLoop) {
        clearInterval(tetrisGame.gameLoop);
        tetrisGame.gameLoop = null;
        tetrisGame.gameActive = false;
    } else if (tetrisGame.gameActive) {
        tetrisGame.gameLoop = setInterval(tetrisGameStep, 16);
        tetrisGame.gameActive = true;
    }
}

function resetTetrisGame() {
    if (tetrisGame.gameLoop) {
        clearInterval(tetrisGame.gameLoop);
        tetrisGame.gameLoop = null;
    }
    tetrisGame.gameActive = false;
    tetrisGame.score = 0;
    tetrisGame.lines = 0;
    tetrisGame.level = 1;
    updateTetrisStats();
}

function getRandomPiece() {
    const piece = tetrisGame.pieces[Math.floor(Math.random() * tetrisGame.pieces.length)];
    return {
        shape: piece.shape,
        color: piece.color,
        x: Math.floor(tetrisGame.canvas.width / 30 / 2) - 1,
        y: 0
    };
}

function spawnNewPiece() {
    tetrisGame.currentPiece = tetrisGame.nextPiece;
    tetrisGame.nextPiece = getRandomPiece();
    tetrisGame.dropTime = 0;
    
    // Check game over
    if (checkCollision(tetrisGame.currentPiece, 0, 0)) {
        gameOverTetris();
    }
}

function tetrisGameStep() {
    if (!tetrisGame.gameActive) return;
    
    tetrisGame.dropTime += 16;
    
    if (tetrisGame.dropTime >= tetrisGame.dropInterval) {
        if (!checkCollision(tetrisGame.currentPiece, 0, 1)) {
            tetrisGame.currentPiece.y++;
        } else {
            placePiece();
            clearLines();
            spawnNewPiece();
        }
        tetrisGame.dropTime = 0;
    }
    
    drawTetris();
}

function checkCollision(piece, dx, dy) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const newX = piece.x + x + dx;
                const newY = piece.y + y + dy;
                
                if (newX < 0 || newX >= tetrisGame.canvas.width / 30 || 
                    newY >= tetrisGame.canvas.height / 30 ||
                    (newY >= 0 && tetrisGame.board[newY][newX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function placePiece() {
    for (let y = 0; y < tetrisGame.currentPiece.shape.length; y++) {
        for (let x = 0; x < tetrisGame.currentPiece.shape[y].length; x++) {
            if (tetrisGame.currentPiece.shape[y][x]) {
                const boardY = tetrisGame.currentPiece.y + y;
                const boardX = tetrisGame.currentPiece.x + x;
                if (boardY >= 0) {
                    tetrisGame.board[boardY][boardX] = tetrisGame.currentPiece.color;
                }
            }
        }
    }
}

function clearLines() {
    let linesCleared = 0;
    
    for (let y = tetrisGame.board.length - 1; y >= 0; y--) {
        if (tetrisGame.board[y].every(cell => cell !== 0)) {
            tetrisGame.board.splice(y, 1);
            tetrisGame.board.unshift(new Array(tetrisGame.canvas.width / 30).fill(0));
            linesCleared++;
            y++; // Check the same line again
        }
    }
    
    if (linesCleared > 0) {
        tetrisGame.lines += linesCleared;
        tetrisGame.score += linesCleared * 100 * tetrisGame.level;
        tetrisGame.level = Math.floor(tetrisGame.lines / 10) + 1;
        tetrisGame.dropInterval = Math.max(100, 1000 - (tetrisGame.level - 1) * 100);
        updateTetrisStats();
    }
}

function drawTetris() {
    const ctx = tetrisGame.ctx;
    const cellSize = 30;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, tetrisGame.canvas.width, tetrisGame.canvas.height);
    
    // Draw board
    for (let y = 0; y < tetrisGame.board.length; y++) {
        for (let x = 0; x < tetrisGame.board[y].length; x++) {
            if (tetrisGame.board[y][x]) {
                ctx.fillStyle = tetrisGame.board[y][x];
                ctx.shadowColor = tetrisGame.board[y][x];
                ctx.shadowBlur = 5;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
            }
        }
    }
    
    // Draw current piece
    if (tetrisGame.currentPiece) {
        ctx.fillStyle = tetrisGame.currentPiece.color;
        ctx.shadowColor = tetrisGame.currentPiece.color;
        ctx.shadowBlur = 10;
        
        for (let y = 0; y < tetrisGame.currentPiece.shape.length; y++) {
            for (let x = 0; x < tetrisGame.currentPiece.shape[y].length; x++) {
                if (tetrisGame.currentPiece.shape[y][x]) {
                    const drawX = (tetrisGame.currentPiece.x + x) * cellSize;
                    const drawY = (tetrisGame.currentPiece.y + y) * cellSize;
                    ctx.fillRect(drawX, drawY, cellSize - 1, cellSize - 1);
                }
            }
        }
    }
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Draw next piece
    drawNextPiece();
}

function drawNextPiece() {
    const ctx = tetrisGame.nextCtx;
    const cellSize = 15;
    
    // Clear next piece canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, tetrisGame.nextCanvas.width, tetrisGame.nextCanvas.height);
    
    if (tetrisGame.nextPiece) {
        ctx.fillStyle = tetrisGame.nextPiece.color;
        ctx.shadowColor = tetrisGame.nextPiece.color;
        ctx.shadowBlur = 5;
        
        const offsetX = (tetrisGame.nextCanvas.width - tetrisGame.nextPiece.shape[0].length * cellSize) / 2;
        const offsetY = (tetrisGame.nextCanvas.height - tetrisGame.nextPiece.shape.length * cellSize) / 2;
        
        for (let y = 0; y < tetrisGame.nextPiece.shape.length; y++) {
            for (let x = 0; x < tetrisGame.nextPiece.shape[y].length; x++) {
                if (tetrisGame.nextPiece.shape[y][x]) {
                    ctx.fillRect(
                        offsetX + x * cellSize, 
                        offsetY + y * cellSize, 
                        cellSize - 1, 
                        cellSize - 1
                    );
                }
            }
        }
    }
    
    ctx.shadowBlur = 0;
}

function rotatePiece(piece) {
    const rotated = [];
    const rows = piece.shape.length;
    const cols = piece.shape[0].length;
    
    for (let i = 0; i < cols; i++) {
        rotated[i] = [];
        for (let j = 0; j < rows; j++) {
            rotated[i][j] = piece.shape[rows - 1 - j][i];
        }
    }
    
    return rotated;
}

function gameOverTetris() {
    if (tetrisGame.gameLoop) {
        clearInterval(tetrisGame.gameLoop);
        tetrisGame.gameLoop = null;
    }
    tetrisGame.gameActive = false;
    
    // Update high score
    if (tetrisGame.score > tetrisGame.highScore) {
        tetrisGame.highScore = tetrisGame.score;
        localStorage.setItem('tetrisHighScore', tetrisGame.highScore.toString());
    }
    
    updateTetrisStats();
    alert(`Game Over! Final Score: ${tetrisGame.score}`);
}

function updateTetrisStats() {
    document.getElementById('tetris-score').textContent = tetrisGame.score;
    document.getElementById('tetris-lines').textContent = tetrisGame.lines;
    document.getElementById('tetris-level').textContent = tetrisGame.level;
    document.getElementById('tetris-high-score').textContent = tetrisGame.highScore;
}

// Tetris Game Controls
document.addEventListener('keydown', function(e) {
    if (currentGame !== 'tetris' || !tetrisGame.gameActive || !tetrisGame.currentPiece) return;
    
    e.preventDefault();
    
    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (!checkCollision(tetrisGame.currentPiece, -1, 0)) {
                tetrisGame.currentPiece.x--;
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (!checkCollision(tetrisGame.currentPiece, 1, 0)) {
                tetrisGame.currentPiece.x++;
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (!checkCollision(tetrisGame.currentPiece, 0, 1)) {
                tetrisGame.currentPiece.y++;
                tetrisGame.score += 1; // Soft drop bonus
            }
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
            const rotated = rotatePiece(tetrisGame.currentPiece);
            const originalShape = tetrisGame.currentPiece.shape;
            tetrisGame.currentPiece.shape = rotated;
            if (checkCollision(tetrisGame.currentPiece, 0, 0)) {
                tetrisGame.currentPiece.shape = originalShape;
            }
            break;
        case ' ':
            // Hard drop
            while (!checkCollision(tetrisGame.currentPiece, 0, 1)) {
                tetrisGame.currentPiece.y++;
                tetrisGame.score += 2; // Hard drop bonus
            }
            placePiece();
            clearLines();
            spawnNewPiece();
            break;
    }
});

// Initialize AOS animations
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});
