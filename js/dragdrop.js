// Drag & Drop Game JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const startDragDropBtn = document.getElementById('startDragDrop');
    const dragDropSection = document.getElementById('dragDropSection');
    const resetDragDropBtn = document.getElementById('resetDragDrop');
    
    // Elementos que se buscarán dinámicamente
    let dragItemsContainer;
    let dropZonesContainer;
    let draggedElement = null;
    let correctDrops = 0;
    let totalItems = 0;

    // Banco de datos de juego por edad
    const age = localStorage.getItem('selectedAge') || '3';
    const itemPool = {
        '3': [
            { item: '🍎', target: 'Fruit' }, { item: '🍌', target: 'Fruit' },
            { item: '🐱', target: 'Animals' }, { item: '🐶', target: 'Animals' },
            { item: '🚗', target: 'Vehicles' }, { item: '✈️', target: 'Vehicles' },
            { item: '⚽', target: 'Toys' }, { item: '🧸', target: 'Toys' }
        ],
        '4': [
            { item: '🦁', target: 'Animales' }, { item: '🐘', target: 'Animales' },
            { item: '🥦', target: 'Verduras' }, { item: '🥕', target: 'Verduras' },
            { item: '👕', target: 'Ropa' }, { item: '👖', target: 'Ropa' },
            { item: '🌞', target: 'Naturaleza' }, { item: '🌳', target: 'Naturaleza' },
            { item: '🎸', target: 'Instrumentos' }, { item: '🎹', target: 'Instrumentos' }
        ],
        '5': [
            { item: '', target: 'Tecnología' }, { item: '📱', target: 'Tecnología' },
            { item: '🍕', target: 'Comida' }, { item: '🍔', target: 'Comida' },
            { item: '🌎', target: 'Espacio' }, { item: '🚀', target: 'Espacio' },
            { item: '🔬', target: 'Ciencia' }, { item: '🧪', target: 'Ciencia' },
            { item: '🏠', target: 'Lugares' }, { item: '🏥', target: 'Lugares' }
        ]
    };

    let itemsForThisGame = [];

    if (startDragDropBtn) {
        startDragDropBtn.addEventListener('click', startDragDropGame);
    }

    if (resetDragDropBtn) {
        resetDragDropBtn.addEventListener('click', resetDragDropGame);
    }

    function startDragDropGame() {
        resetAndInitializeGame();
        dragDropSection.classList.remove('d-none');
        dragDropSection.scrollIntoView({ behavior: 'smooth' });
    }

    function initializeGame() {
        // Re-asignar los elementos del DOM después de que el HTML se haya restaurado.
        dragItemsContainer = document.getElementById('dragItems');
        dropZonesContainer = document.getElementById('dropZones');

        // Seleccionar un conjunto aleatorio de items para esta partida
        const pool = itemPool[age] || itemPool['3'];
        shuffleArray(pool); // Barajamos el banco de items

        let numberOfItems;
        switch (age) {
            case '5':
                numberOfItems = 5;
                break;
            case '4':
                numberOfItems = 4;
                break;
            default: // Edad 3
                numberOfItems = 3;
        }

        itemsForThisGame = pool.slice(0, numberOfItems);
        shuffleArray(itemsForThisGame); // Barajamos los items de la partida actual

        correctDrops = 0;
        totalItems = itemsForThisGame.length;
        document.getElementById('dragCorrect').textContent = correctDrops;

        // Create drag items
        dragItemsContainer.innerHTML = '';
        itemsForThisGame.forEach((itemData, index) => {
            const item = document.createElement('div');
            item.className = 'drag-item';
            item.draggable = true;
            item.dataset.index = index;
            item.dataset.target = itemData.target;
            item.textContent = itemData.item;
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd); // Añadido
            dragItemsContainer.appendChild(item);
        });

        // Create drop zones
        dropZonesContainer.innerHTML = '';
        const uniqueTargets = [...new Set(itemsForThisGame.map(item => item.target))];
        uniqueTargets.forEach(target => {
            const zone = document.createElement('div');
            zone.className = 'drop-zone';
            zone.dataset.target = target;
            zone.innerHTML = `<strong>${target}</strong>`; // El texto de la categoría
            zone.addEventListener('dragover', handleDragOver);
            zone.addEventListener('dragleave', handleDragLeave); // Añadido
            zone.addEventListener('drop', handleDrop);
            dropZonesContainer.appendChild(zone);
        });
    }

    function handleDragStart(e) {
        // Usar una clase para el feedback visual
        e.target.classList.add('dragging');
        draggedElement = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('hover');
    }

    function handleDragLeave(e) {
        this.classList.remove('hover');
    }

    function handleDrop(e) {
        e.preventDefault();
        handleDragLeave.call(this); // Llama a la función para quitar la clase hover

        if (!draggedElement) return;

        const draggedTarget = draggedElement.dataset.target;
        const dropTarget = this.dataset.target;

        // Siempre mover el elemento a la zona donde se soltó
        this.appendChild(draggedElement);

        if (draggedTarget === dropTarget) {
            // Correct drop
            correctDrops++;
            document.getElementById('dragCorrect').textContent = correctDrops;
            playSound('correct');
            updateProgress('dragdrop');
        } else {
            // Incorrect drop
            this.classList.add('incorrect-drop-animation');
            setTimeout(() => {
                this.classList.remove('incorrect-drop-animation');
            }, 500);
            playSound('incorrect');
        }

        draggedElement = null;

        // Si ya no quedan elementos por arrastrar, evaluamos el juego.
        if (dragItemsContainer.children.length === 0) {
            setTimeout(evaluateGame, 500);
        }
    }

    function evaluateGame() {
        let allCorrect = true;
        const zones = dropZonesContainer.querySelectorAll('.drop-zone');
        zones.forEach(zone => {
            const dropTarget = zone.dataset.target;
            // Iteramos sobre los elementos arrastrados dentro de la zona
            zone.querySelectorAll('.drag-item').forEach(item => {
                if (item.dataset.target !== dropTarget) {
                    allCorrect = false;
                }
            });
        });

        if (allCorrect) {
            endGame();
        } else {
            showSadFeedback();
        }
    }

    function endGame() {
        const feedbackContainer = document.getElementById('dragDropFeedback');

        // Lanzamos la animación de confeti
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            zIndex: 1057 // Asegura que esté por encima de otros elementos
        });

        // Mostramos el mensaje de victoria en el contenedor principal
        feedbackContainer.innerHTML = `
            <div class="feedback-container text-center">
                <div class="trophy-animation">🏆</div>
                <h3>¡Excelente trabajo!</h3>
                <p>Completaste todas las asociaciones.</p>
                <button class="btn btn-primary" id="playAgainDragDrop">Jugar de nuevo</button>
            </div>
        `;
        document.getElementById('playAgainDragDrop').addEventListener('click', resetAndInitializeGame);
    }

    function showSadFeedback() {
        const feedbackContainer = document.getElementById('dragDropFeedback');
        feedbackContainer.innerHTML = `
            <div class="feedback-container text-center">
                <div class="puzzle-pieces">
                    <span class="puzzle-piece">🔄</span>
                    
                </div>
                <h3>¡Buen intento!</h3>
                <p>Algunas piezas no están en su lugar. ¿Probamos otra vez?</p>
                <button class="btn btn-primary" id="playAgainDragDrop">Jugar de nuevo</button>
            </div>
        `;
        document.getElementById('playAgainDragDrop').addEventListener('click', resetAndInitializeGame);
    }

    function resetDragDropGame() {
        showSadFeedback();
    }

    function resetAndInitializeGame() {
        const feedbackContainer = document.getElementById('dragDropFeedback');
        // Restaurar la estructura HTML original antes de reiniciar.
        feedbackContainer.innerHTML = `
            <div class="container-fluid">
                <div class="drag-drop-container">
                    <div class="row">
                        <div class="col-md-6">
                            <h5>Arrastra los objetos:</h5>
                            <div id="dragItems" class="drag-items-container"></div>
                        </div>
                        <div class="col-md-6">
                            <h5>Categorías a completar:</h5>
                            <div id="dropZones" class="drop-zones-container"></div>
                        </div>
                    </div>
        `;
        initializeGame();
    }

    function playSound(type) {
        // Placeholder for sound effects
        console.log(`Playing ${type} sound`);
        // In a real implementation, you would play audio files
    }

    function updateProgress(type) {
        const progress = JSON.parse(localStorage.getItem('funenglish_progress') || '{}');
        if (type === 'dragdrop') {
            progress.words = (progress.words || 0) + 1;
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