// Memory Game JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const startMemoryBtn = document.getElementById('startMemory');
    const memorySection = document.getElementById('memorySection');
    const memoryBoard = document.getElementById('memoryBoard');
    const memoryAttempts = document.getElementById('memoryAttempts');
    const memoryPairs = document.getElementById('memoryPairs');
    const resetMemoryBtn = document.getElementById('resetMemory');

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let attempts = 0;
    let lockBoard = false;

    // Card symbols based on age
    const age = localStorage.getItem('selectedAge') || '3'; // Se obtiene la edad una vez
    const cardSets = {
        '3': [
            '🍎 Apple', '⭐ Star', '🐶 Dog', '🐟 Fish', '🦁 Lion', '📚 Books', '🌞 Sun', '🚗 Car', '🎈 Balloon', '⚽ Ball', '🐱 Cat', '🌙 Moon', '🎁 Gift', '🌳 Tree', '❤️ Heart', '🦋 Butterfly', '🐭 Mouse','🐷 Pig','🐼 Panda',
        ],
        // verde, naranja, rojo, azul, amarillo, blanco, cafe, negro, rosado, gris, plateado, dorado, beige
        '4': [
            '🍎 Apple', '🐶 Dog', '🐱 Cat', '🌞 Sun', '🌙 Moon', '⭐ Star', '🚗 Car', '📖 Book', '🌳 Tree', '⚽ Ball', '🎁 Gift', '💡 Idea', '⏰ Clock', '🚲 Bike', '🏠 House', '🍕 Pizza', '🎸 Guitar', '❤️ Heart', '🧠 Brain', '🟦 Blue', '🟨 Yellow', '🟥 Red', '🟩 Green', '⬛ Black', '⬜ White',
        ],
        '5': [
            '🍎 Apple', '🐶 Dog', '🐱 Cat', '🌞 Sun', '🌙 Moon', '⭐ Star', '🚗 Car', '📖 Book', '🌳 Tree', '⚽ Ball', '🎈 Balloon', '🎁 Gift', '💡 Idea', '⏰ Clock', '🌍 Globe', '🚀 Rocket', '🤖 Robot', '🍕 Pizza', '🎸 Guitar', '🎨 Art', '🔬 Microscope', '🎻 Violin'
        ]
    };

    if (startMemoryBtn) {
        startMemoryBtn.addEventListener('click', startMemoryGame);
    }

    if (resetMemoryBtn) {
        resetMemoryBtn.addEventListener('click', resetMemoryGame);
    }

    function startMemoryGame() {
        initializeGame();
        memorySection.classList.remove('d-none');
        memorySection.scrollIntoView({ behavior: 'smooth' });
    }

    function applyBoardStyles() {
        const container = document.body; // O un contenedor más específico si lo tienes
        container.classList.remove('age-3', 'age-4', 'age-5'); // Limpiar clases previas
        container.classList.add(`age-${age}`);
    }

    function initializeGame() {
        cards = [];
        memoryBoard.classList.remove('game-ended'); // Quitar la clase al reiniciar
        flippedCards = [];
        matchedPairs = 0;
        attempts = 0;
        lockBoard = false;

        memoryAttempts.textContent = attempts;
        memoryPairs.textContent = matchedPairs;

        applyBoardStyles();

        // Obtener el conjunto completo de símbolos disponibles para la edad actual
        const allPossibleSymbolsForAge = cardSets[age] || cardSets['3'];
        
        // Definir cuántos pares únicos (símbolos) queremos en el juego.
        // Por ejemplo, 6 pares para un total de 12 cartas.
        let numberOfPairs;
        switch (age) {
            case '4':
                numberOfPairs = 5;
                break;
            case '5':
                numberOfPairs = 6;
                break;
            default:
                numberOfPairs = 3; // 
        }
        // Barajar el conjunto completo de símbolos posibles para seleccionar un subconjunto aleatorio
        const shuffledPool = [...allPossibleSymbolsForAge]; // Crear una copia para no modificar el original
        shuffleArray(shuffledPool);

        // Seleccionar un subconjunto de símbolos únicos para esta partida específica
        const symbolsForThisGame = shuffledPool.slice(0, numberOfPairs);

        // Crear los pares de cartas usando los símbolos seleccionados aleatoriamente para esta partida
        symbolsForThisGame.forEach(symbol => {
            cards.push({ symbol, id: Math.random() });
            cards.push({ symbol, id: Math.random() });
        });

        // Barajar las cartas usando el algoritmo Fisher-Yates para una mejor aleatoriedad
        shuffleArray(cards);

        // Render board
        memoryBoard.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            const symbolContent = card.symbol;
            let cardBackContent;

            // Dividir el emoji del texto si existe
            const parts = symbolContent.split(' ');
            if (parts.length > 1) {
                cardBackContent = `<div class="card-emoji">${parts[0]}</div><div class="memory-card-text">${parts.slice(1).join(' ')}</div>`;
            } else {
                cardBackContent = `<div class="card-emoji">${symbolContent}</div>`;
            }

            cardElement.className = 'memory-card';
            cardElement.dataset.index = index;
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img src="../img/memory game.jpg" alt="Reverso de la carta">
                    </div>
                    <div class="card-back">
                        ${cardBackContent}
                    </div>
                </div>
            `;
            cardElement.addEventListener('click', flipCard);
            memoryBoard.appendChild(cardElement);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this.classList.contains('flipped')) return;

        const index = this.dataset.index;
        this.classList.add('flipped');
        flippedCards.push({ element: this, symbol: cards[index].symbol, index });

        playSound('flip');

        if (flippedCards.length === 2) {
            lockBoard = true;
            attempts++;
            memoryAttempts.textContent = attempts;

            setTimeout(checkMatch, 1000);
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.symbol === card2.symbol) {
            // Match found
            matchedPairs++;
            memoryPairs.textContent = matchedPairs;
            playSound('match');

            // Animate match
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');

            updateProgress('memory');

            if (matchedPairs === cards.length / 2) { // Se verifica contra el total de pares en el juego actual
                setTimeout(endGame, 500);
            }
        } else {
            // No match
            playSound('no-match');
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
        }

        flippedCards = [];
        lockBoard = false;
    }

    function endGame() {
        // 2. ¡Aquí lanzamos la animación de confeti!
        confetti({
            particleCount: 150, // Cantidad de confeti
            spread: 100,       // Qué tan disperso sale
            origin: { y: 0.6 }, // Desde dónde empieza (un poco más abajo de la parte superior)
            zIndex: 1057       // Asegura que aparezca por encima de otros elementos (como el modal si lo hubiera)
        });

        memoryBoard.classList.add('game-ended'); // Añadir clase para centrar
        memoryBoard.innerHTML = `
            <div class="aviso-memoria">
                <div class="trophy-animation">🏆</div>
                <h3>¡Excelente memoria! 🧠</h3>
                <p>¡Lo lograste en solo ${attempts} intentos!</p>
                <button class="btn btn-primary" id="playAgainMemory">Jugar de nuevo</button>
            </div>
        `;

        document.getElementById('playAgainMemory').addEventListener('click', resetMemoryGame);

        // Save progress
        const progress = JSON.parse(localStorage.getItem('funenglish_progress') || '{}');
        progress.games = (progress.games || 0) + 1;
        localStorage.setItem('funenglish_progress', JSON.stringify(progress));
    }

    function resetMemoryGame() {
        initializeGame();
    }

    function playSound(type) {
        // Placeholder for sound effects
        console.log(`Playing ${type} sound`);
        // In a real implementation, you would play audio files
    }

    function updateProgress(type) {
        const progress = JSON.parse(localStorage.getItem('funenglish_progress') || '{}');
        if (type === 'memory') {
            progress.words = (progress.words || 0) + 2; // Memory game teaches vocabulary
        }
        localStorage.setItem('funenglish_progress', JSON.stringify(progress));
        if (window.funenglish && window.funenglish.loadProgress) {
            window.funenglish.loadProgress();
        }
    }

    // Función auxiliar para barajar un array (algoritmo Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});