document.addEventListener('DOMContentLoaded', function() {
    const colors = ["green", "red", "yellow", "blue"];
    let gameSequence = [];
    let playerSequence = [];
    let level = 0;
    let gameInProgress = false;

    const startBtn = document.getElementById("startSimon");
    const levelDisplay = document.getElementById("simonLevel");
    const instructionDisplay = document.getElementById("simonInstruction");
    const buttons = colors.map(color => document.getElementById(color));

    function playSequence() {
        gameInProgress = false; // El jugador no puede hacer clic mientras se muestra la secuencia
        playerSequence = [];
        instructionDisplay.textContent = "Observa la secuencia...";
        let i = 0;
        const interval = setInterval(() => {
            if (i >= gameSequence.length) {
                clearInterval(interval);
                gameInProgress = true; // El jugador ya puede hacer clic
                instructionDisplay.textContent = "¡Tu turno! Repite la secuencia.";
                return;
            }
            const color = gameSequence[i];
            flashButton(color);
            i++;
        }, 800);
    }

    function flashButton(color) {
        const btn = document.getElementById(color);
        if (!btn) return;
        btn.style.opacity = "1";
        setTimeout(() => { btn.style.opacity = "0.6"; }, 400);
    }

    function nextLevel() {
        level++;
        levelDisplay.textContent = level;
        const randomColor = colors[Math.floor(Math.random() * 4)];
        gameSequence.push(randomColor);
        playSequence();
    }

    function checkMove(index) {
        if (playerSequence[index] !== gameSequence[index]) {
            alert("❌ ¡Perdiste! Llegaste al nivel " + level);
            instructionDisplay.textContent = '¡Juego terminado! Presiona "Iniciar Juego" para volver a empezar.';
            resetGame();
            return;
        }
        if (playerSequence.length === gameSequence.length) {
            setTimeout(nextLevel, 1000);
        }
    }

    function resetGame() {
        gameSequence = [];
        playerSequence = [];
        level = 0;
        levelDisplay.textContent = level;
        gameInProgress = false;
        if (gameSequence.length === 0) { // Solo muestra este mensaje si el juego se reseteó por completo
            instructionDisplay.textContent = 'Presiona "Iniciar Juego" para comenzar.';
        }
    }

    buttons.forEach(btn => {
        if (!btn) return;
        btn.addEventListener("click", () => {
            if (!gameInProgress) return; // No hacer nada si el juego no ha comenzado o se está mostrando la secuencia
            const color = btn.id;
            playerSequence.push(color);
            flashButton(color);
            checkMove(playerSequence.length - 1);
        });
    });

    startBtn.addEventListener("click", () => {
        resetGame();
        nextLevel();
    });
});
