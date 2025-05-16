const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restartButton');

// Konfigurasi Bola
const ball = {
    radius: 12,
    x: canvas.width / 2,
    y: canvas.height - 30,
    speedX: 4,
    speedY: -4
};

// Konfigurasi Papan
const paddle = {
    height: 10,
    width: 100,
    x: (canvas.width - 100) / 2,
    speed: 5,
    rightPressed: false,
    leftPressed: false
};

// Skor
let score = 0;

// Variabel status game
let gameRunning = true;

// Event listener untuk kontrol keyboard
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Fungsi untuk menangani saat tombol ditekan
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.leftPressed = true;
    }
}

// Fungsi untuk menangani saat tombol dilepas
function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.leftPressed = false;
    }
}

//  Kontrol tombol sentuh dan 
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

// Tambahkan event listener tombol kiri/kanan
leftButton.addEventListener("touchstart", () => paddle.leftPressed = true);
leftButton.addEventListener("touchend", () => paddle.leftPressed = false);
rightButton.addEventListener("touchstart", () => paddle.rightPressed = true);
rightButton.addEventListener("touchend", () => paddle.rightPressed = false);

leftButton.addEventListener("mousedown", () => paddle.leftPressed = true);
leftButton.addEventListener("mouseup", () => paddle.leftPressed = false);
rightButton.addEventListener("mousedown", () => paddle.rightPressed = true);
rightButton.addEventListener("mouseup", () => paddle.rightPressed = false);

// Fungsi untuk menggambar bola
function drawBall() {
    const gradient = ctx.createRadialGradient(ball.x, ball.y, ball.radius / 2, ball.x, ball.y, ball.radius);
    gradient.addColorStop(0, "#ffcc00");
    gradient.addColorStop(1, "#ff6a00");

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}

// Fungsi untuk menggambar papan
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = "#ffcc00";
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    ctx.fill();
    ctx.closePath();
}

// Fungsi untuk mereset permainan
function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.speedX = 4;
    ball.speedY = -4;
    paddle.x = (canvas.width - paddle.width) / 2;
    score = 0;
    scoreElement.textContent = score;
    restartButton.style.display = 'none';
    gameRunning = true;
    gameLoop();
}

// Fungsi untuk mengupdate elemen game
function update() {
    if (!gameRunning) return;

    // Gerakan papan
    if (paddle.rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    } else if (paddle.leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }

    // Gerakan bola
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Benturan kiri kanan
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.speedX = -ball.speedX;
    }

    // Benturan atas
    if (ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
    }

    // Benturan dengan papan
    if (ball.y + ball.radius > canvas.height - paddle.height) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.speedY = -ball.speedY;
            score++;
            scoreElement.textContent = score;
        } else if (ball.y + ball.radius > canvas.height) {
            gameRunning = false;
            restartButton.style.display = 'block';
        }
    }

    // Gambar ulang bola dan papan
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
}

// Fungsi untuk loop animasi game
function gameLoop() {
    update();
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Tombol restart
restartButton.addEventListener('click', resetGame);

// Mulai game
gameLoop();
