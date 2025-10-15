document.addEventListener('DOMContentLoaded', function() {
    const age = localStorage.getItem('selectedAge');
    const startFamilyGameBtn = document.getElementById('startFamilyGame');

    // Ocultar el juego si la edad no es 3 años
    if (age !== '3') {
        if (startFamilyGameBtn) {
            // Ocultamos la tarjeta completa del juego
            const gameCard = startFamilyGameBtn.closest('.col-lg-3');
            if (gameCard) {
                gameCard.style.display = 'none';
            }
        }
        return; // Detenemos la ejecución del script para este juego
    }

    const familyGameSection = document.getElementById('familyGameSection');
    const resetFamilyGameBtn = document.getElementById('resetFamilyGame');

    const questionEl = document.getElementById('familyQuestion');
    const optionsEl = document.getElementById('familyOptions');
    const resultEl = document.getElementById('familyResult');
    const scoreEl = document.getElementById('familyScore');

    const familyMembers = [
        { name: "Father", emoji: "👨" },
        { name: "Mother", emoji: "👩" },
        { name: "Brother", emoji: "👦" },
        { name: "Sister", emoji: "👧" },
        { name: "Grandfather", emoji: "👴" },
        { name: "Grandmother", emoji: "👵" },
        { name: "Uncle", emoji: "🧔" },
        { name: "Aunt", emoji: "👩‍🦰" },
        { name: "Cousin", emoji: "🧒" }
    ];

    let score = 0;
    let currentAnswer = "";
    let gameInProgress = false;

    if (startFamilyGameBtn) {
        startFamilyGameBtn.addEventListener('click', startGame);
    }

    if (resetFamilyGameBtn) {
        resetFamilyGameBtn.addEventListener('click', startGame);
    }

    function startGame() {
        // Ocultar otras secciones de juego si estuvieran visibles
        document.querySelectorAll('.game-section').forEach(section => {
            section.classList.add('d-none');
        });

        familyGameSection.classList.remove('d-none');
        familyGameSection.scrollIntoView({ behavior: 'smooth' });
        
        score = 0;
        gameInProgress = true;
        updateScore();
        newQuestion();
    }

    function newQuestion() {
        if (!gameInProgress) return;

        const randomMember = familyMembers[Math.floor(Math.random() * familyMembers.length)];
        currentAnswer = randomMember.name;
        questionEl.textContent = `Who is the ${randomMember.name}?`;

        // Mezclar opciones
        const shuffled = [...familyMembers].sort(() => 0.5 - Math.random()).slice(0, 4);
        
        // Asegurarse de que la respuesta correcta esté entre las opciones
        const hasCorrectAnswer = shuffled.some(member => member.name === currentAnswer);
        if (!hasCorrectAnswer) {
            shuffled[Math.floor(Math.random() * 4)] = randomMember;
        }

        optionsEl.innerHTML = "";
        shuffled.forEach(member => {
            const card = document.createElement("div");
            card.className = "family-card";
            card.innerHTML = `<div class="family-emoji">${member.emoji}</div><div>${member.name}</div>`;
            card.onclick = () => checkAnswer(member.name);
            optionsEl.appendChild(card);
        });

        resultEl.textContent = "";
    }

    function checkAnswer(selected) {
        if (!gameInProgress) return;

        if (selected === currentAnswer) {
            resultEl.textContent = "🎉 Great job!";
            resultEl.style.color = '#28a745'; // Verde éxito
            score++;
        } else {
            resultEl.textContent = "❌ Try again!";
            resultEl.style.color = '#dc3545'; // Rojo error
        }
        updateScore();

        // Deshabilitar clics temporalmente y pasar a la siguiente pregunta
        gameInProgress = false;
        setTimeout(() => {
            gameInProgress = true;
            newQuestion();
        }, 1500);
    }

    function updateScore() {
        scoreEl.textContent = `Score: ${score}`;
    }
});