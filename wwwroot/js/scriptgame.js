// Ввод переменных
const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const bird = document.getElementById("bird"); 
const scoreDisplay = document.getElementById("score");

let score = 0;
let isGameActive = false;
let cactusInterval;
let birdInterval;
let isSpeedIncreased = false;
let isDoubleJumpEnabled = false;
let isJumping = false;
let doubleJumpUsed = false;

// Функция прыжка
function jump() {
    if (!isJumping) {
        isJumping = true;
        dino.classList.add("jump");
        setTimeout(function () {
            dino.classList.remove("jump");
            isJumping = false;
            doubleJumpUsed = false;
        }, 300);
    } else if (isDoubleJumpEnabled && !doubleJumpUsed) {
        doubleJumpUsed = true;
        dino.classList.add("jump");
        setTimeout(function () {
            dino.classList.remove("jump");
        }, 300);
    }
}

// Обработчик нажатия пробела
document.addEventListener("keydown", function (event) {
    if (event.key === " ") {
        if (!isGameActive) {
            startGame();
        }
        jump();
    }
});

// Функция запуска игры
function startGame() {
    score = 0;
    isGameActive = true;
    cactus.style.visibility = "visible";
    bird.style.visibility = "visible"; // Показать птицу
    cactus.style.left = '580px';
    bird.style.left = '580px'; // Начальная позиция птицы
    cactusInterval = setInterval(moveCactus, 20);
    birdInterval = setInterval(moveBird, 30); // Интервал для движения птицы

    setInterval(function () {
        if (isGameActive) {
            score++;
            scoreDisplay.textContent = "Баллы: " + score;
        }
    }, 1000);

    let isAlive = setInterval(function () {
        let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
        let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));
        let birdLeft = parseInt(window.getComputedStyle(bird).getPropertyValue("left"));
        let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));

        // Проверка столкновения с кактусом
        if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140) {
            alert("Fatality! Ваш счет: " + score);
            clearInterval(isAlive);
            stopGame();
        }

        // Проверка столкновения с птицей
        if (birdLeft < 50 && birdLeft > 0 && dinoTop < birdTop + 30 && dinoTop + 50 > birdTop) {
            alert("Fatality! Ваш счет: " + score);
            clearInterval(isAlive);
            stopGame();
        }
    }, 10);
}

// Функция для перемещения кактуса
function moveCactus() {
    let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));
    if (cactusLeft < -20) {
        cactus.style.left = '580px';
    } else {
        cactus.style.left = (cactusLeft - 5) + 'px';
    }
}

// Функция для перемещения птицы
function moveBird() {
    let birdLeft = parseInt(window.getComputedStyle(bird).getPropertyValue("left"));
    if (birdLeft < -40) {
        bird.style.left = '580px'; // Восстанавливаем позицию птицы
    } else {
        bird.style.left = (birdLeft - 3) + 'px'; // Птица летит медленнее кактуса
    }
}

// Привязываем кнопки к функциям
const jumpButton = document.getElementById("jumpButton");
const speedButton = document.getElementById("speedButton");
const doubleJumpButton = document.getElementById("doubleJumpButton");

jumpButton.addEventListener("click", function () {
    if (!isGameActive) {
        startGame();
    }
    jump();
});

// Кнопка для изменения скорости
speedButton.addEventListener("click", function () {
    if (isGameActive) {
        if (!isSpeedIncreased) {
            increaseSpeed(); // Увеличиваем скорость
            speedButton.textContent = "Нормальная скорость"; // Изменяем текст кнопки
        } else {
            resetSpeed(); // Возвращаем нормальную скорость
            speedButton.textContent = "Увеличенная скорость"; // Изменяем текст обратно
        }
        isSpeedIncreased = !isSpeedIncreased; // Переключаем состояние флага скорости
    }
});

// Кнопка для включения/выключения двойного прыжка
doubleJumpButton.addEventListener("click", function () {
    if (isGameActive) {
        if (!isDoubleJumpEnabled) {
            doubleJumpButton.textContent = "Disable Double Jump";
        } else {
            doubleJumpButton.textContent = "Enable Double Jump";
        }
        isDoubleJumpEnabled = !isDoubleJumpEnabled;
    }
});

// Увеличение скорости кактуса и птицы
function increaseSpeed() {
    clearInterval(cactusInterval);
    clearInterval(birdInterval);
    cactusInterval = setInterval(moveCactus, 10); // Ускоряем движение кактуса
    birdInterval = setInterval(moveBird, 15); // Ускоряем движение птицы
}

// Восстановление нормальной скорости
function resetSpeed() {
    clearInterval(cactusInterval);
    clearInterval(birdInterval);
    cactusInterval = setInterval(moveCactus, 20); // Восстанавливаем скорость кактуса
    birdInterval = setInterval(moveBird, 30); // Восстанавливаем скорость птицы
}

// Остановка игры
function sendScoreToServer(score) {
    fetch('/api/Game/save-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score: score })
    })
        .then(response => response.ok ? console.log('Score saved!') : console.error('Failed to save score'))
        .catch(error => console.error('Error:', error));
}

// Обновим функцию остановки игры
function stopGame() {
    isGameActive = false;
    clearInterval(cactusInterval);
    clearInterval(birdInterval);
    cactus.style.visibility = "hidden";
    bird.style.visibility = "hidden";

    sendScoreToServer(score); // Отправляем баллы на сервер
    scoreDisplay.textContent = "Счет: 0";
}



