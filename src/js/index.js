const target = document.getElementById('target');
const gameArea = document.getElementById('gameArea');
const pauseMenu = document.getElementById('pauseMenu');
const scoreDisplay = document.getElementById('scoreDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const resetBtn = document.getElementById('resetBtn');
const gameOverMessage = document.getElementById('gameOverMessage');
const timerBar = document.querySelector('.timer-bar');

let score = 0;
let timer = 2.00; // Tiempo inicial de 2 segundos
let isPaused = true;
let isGameOver = false;
let lastTime = 0;
let animationFrame;
const MAX_TIME = 2.00; // Tiempo máximo de 2 segundos
const TIME_PER_POINT = 0.4; // Tiempo que se suma por punto

function getRandomPosition(max) {
    return Math.floor(Math.random() * (max - 40));
}

function moveTarget() {
    const areaRect = gameArea.getBoundingClientRect();
    target.style.left = getRandomPosition(areaRect.width - 40) + 'px';
    target.style.top = getRandomPosition(areaRect.height - 40) + 'px';
}



function updateTimer(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = (timestamp - lastTime) / 1000; // Tiempo en segundos
    
    if (!isPaused && !isGameOver) {
        timer = Math.max(timer - deltaTime, 0);
        
        // Actualizar elementos visuales
        const percentage = (timer / MAX_TIME) * 100;
        timerBar.style.width = `${percentage}%`;
        timeDisplay.textContent = `${timer.toFixed(2)} SEGUNDOS`;
        
        if (timer <= 0) {
            gameOver();
            return;
        }
    }
    
    lastTime = timestamp;
    animationFrame = requestAnimationFrame(updateTimer);
}

function updateScore() {
    score++;
    scoreDisplay.textContent = score;
    
    // Sumar tiempo con límite máximo
    timer = Math.min(timer + TIME_PER_POINT, MAX_TIME);
    
    // Efecto visual
    target.classList.add('flash');
    setTimeout(() => target.classList.remove('flash'), 150);
    
    // Mover el objetivo
    moveTarget();
}

function gameOver() {
    isGameOver = true;
    isPaused = true;
    cancelAnimationFrame(animationFrame);
    pauseMenu.classList.remove('hidden');
    
    let message = '';
    if (score > 150) message += 'Nivel desbloqueado: DIOS';
    else if (score > 100) message += '¡¡¡Increíble!!!';
    else if (score > 75) message += '¡¡¡Muy bien!!!';
    else if (score > 50) message += '¡Bien hecho!';
    else if (score > 35) message += 'Normalito...';
    else if (score > 20) message += 'Deberias practicar mas...';
    else message += 'Muy mal...';

    
    gameOverMessage.textContent = message;
}

function startGame() {
    // Reiniciar variables
    isPaused = false;
    isGameOver = false;
    score = 0;
    timer = MAX_TIME;
    lastTime = 0;
    
    // Reiniciar elementos visuales
    scoreDisplay.textContent = score;
    timerBar.style.width = '100%';
    timeDisplay.textContent = `${MAX_TIME.toFixed(2)} SEGUNDOS`;
    gameOverMessage.textContent = '';
    pauseMenu.classList.add('hidden');

    // Posición inicial centrada
    const areaRect = gameArea.getBoundingClientRect();
    target.style.left = (areaRect.width / 2 - 20) + 'px';
    target.style.top = (areaRect.height / 2 - 20) + 'px';
    
    // Iniciar bucle de animación
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(updateTimer);
}

// Event Listeners
target.addEventListener('mouseover', () => {
    if (!isPaused && !isGameOver) {
        updateScore();
    }
});

target.addEventListener('click', () => {
    if (!isPaused && !isGameOver) {
        updateScore();
    }
});

resetBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseMenu.classList.toggle('hidden');
    
    // Reanudar animación
    if (!isPaused) {
        lastTime = 0;
        animationFrame = requestAnimationFrame(updateTimer);
    }
});

// Iniciar en estado de pausa
startGame();
isPaused = true;
pauseMenu.classList.remove('hidden');