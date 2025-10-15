// Quizzes JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const startQuizBtn = document.getElementById('startQuiz');
    const quizSection = document.getElementById('quizSection');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizImage = document.getElementById('quizImage');
    const questionText = document.getElementById('questionText');
    const quizOptions = document.getElementById('quizOptions');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    const quizScore = document.getElementById('quizScore');

    let currentQuestionIndex = 0;
    let score = 0;
    let allQuestionsForAge = [];
    let currentQuizQuestions = [];

    // Sample questions based on age

    //- ¿cuántos helados, balones, pelotas, carros, figuras geométricas hay?-mostrar la cantidad de helados que hay-números 
//-¿ De color son las sillas, balones, lapices, manzana, naranja, banana, puerta ? colores
//-¿que animal es perro, gato, pez, caballo, cerdo, conejo, gallina, gallo, vaca, oveja, pato, burro, paloma, abeja, ratón, serpiente, tortuga?-animales
//-¿que parte del cuerpo es?- imagen-cabeza, boca, nariz, ojos, manos, pies, oídos, piernas.-partes del cuerpo 
//-¿qué acción está realizando la imagen?- imagen-sentarse, aplaudir, ponerse de pie, escribir, leer, silencio, hasta mañana, buenos días,buenas tardes, gracias, denada.

    const age = localStorage.getItem('selectedAge') || '3';
    const questionSets = {
        '3': [
            { image: '../img/quiz/Número 4.jpg', question: '¿Qué número es este?', options: ['One', 'Two', 'Three', 'Four' ], correct: 'Four' },
            { image: '../img/quiz/perro.jpg', question: '¿Qué animal es?', options: ['Dog', 'Cat', 'Rabbit', 'Fish'], correct: 'Dog' },
            { image: '../img/quiz/apple.jpg', question: '¿De qué color es la manzana?', options: ['Blue', 'Red', 'Green', 'Yellow' ], correct: 'Green' },
            { image: '../img/quiz/colores.jpg', question: '¿Cuántos colores ves?', options: ['One', 'Ten', 'Six', 'Eight' ], correct: 'Six' },
            { image: '../img/quiz/Sol.jpg', question: '¿De que color es el sol?', options: ['Pink', 'Red', 'Yellow', 'Orange' ], correct: 'Yellow' },
            { image: '../img/quiz/oso.jpg', question: '¿De que color es el oso?', options: ['Pink', 'Brown', 'Yellow', 'Orange' ], correct: 'Brown' },
            { image: '../img/quiz/cerdo.jpg', question: '¿Qué animal es?', options: ['Cat', 'Cow', 'Sheep', 'Pig' ], correct: 'Pig' },
        ],
        '4': [ 
        //Colores secundarios, animales salvajes y domesticos, partes del cuerpo, numeros de 1 a 20, Comandos cotidianos.
            { image: '../img/quiz/dog.jpg', question: '¿Qué color ves?', options: ['White', 'Red', 'Blue', 'Black'], correct: 'Black' },
            { image: '../img/quiz/mano.jpg', question: '¿Como es mano en inglés?', options: ['Head', 'Hand', 'Chest'], correct: 'Hand' },
            { image: '../img/quiz/pierna.jpg', question: '¿Qué parte del cuerpo es?', options: ['Finger', 'Leg', 'Neck'], correct: 'Leg' },
            { image: '../img/quiz/Número 4.jpg', question: '¿Qué número es este?', options: ['One', 'Two', 'Three', 'Four' ], correct: 'Four' },
            { image: '../img/quiz/perro.jpg', question: '¿Qué animal es?', options: ['Dog', 'Cat', 'Rabbit', 'Fish'], correct: 'Dog' },
            { image: '../img/quiz/bananas.jpg', question: '¿Cuantas bananas ves?', options: ['Two', 'Seven', 'Eleven', 'Sixten' ], correct: 'Green' },
            { image: '../img/quiz/colores.jpg', question: '¿Qué parte del cuerpo es?', options: ['One', 'Ten', 'Six', 'Eight' ], correct: 'Six' },
            { image: '../img/quiz/Sol.jpg', question: '¿Qué esta haciendo el niño?', options: ['Pink', 'Red', 'Yellow', 'Orange' ], correct: 'Yellow' },
            { image: '../img/quiz/oso.jpg', question: '¿Qué animal es', options: ['Pink', 'Brown', 'Yellow', 'Orange' ], correct: 'Brown' },
            { image: '../img/quiz/cerdo.jpg', question: '¿Qué color es?', options: ['Cat', 'Cow', 'Sheep', 'Pig' ], correct: 'Pig' },

        ],
        '5': [
            //Mezcla de colores, partes de la casa, numerós de 1 a 30
            { image: '../img/quiz/car.jpg', question: 'How does this move?', options: ['It flies', 'It swims', 'It drives'], correct: 'It drives' },
            { image: '../img/quiz/tree.jpg', question: 'Where do birds live?', options: ['In the water', 'In a tree', 'In a house'], correct: 'In a tree' },
            { image: '../img/quiz/book.jpg', question: 'What do you read?', options: ['A ball', 'A book', 'Food'], correct: 'A book' }
        ]
    };

    allQuestionsForAge = questionSets[age] || questionSets['3'];

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        quizScore.textContent = score;
        // Barajar todas las preguntas disponibles para la edad
        shuffleArray(allQuestionsForAge);

        // Determinar el número de preguntas según la edad
        let numberOfQuestions;
        switch (age) {
            case '4':
                numberOfQuestions = 8;
                break;
            case '5':
                numberOfQuestions = 12;
                break;
            default: // Edad 3 y por defecto
                numberOfQuestions = 5;
        }

        // Seleccionar el número de preguntas para esta partida
        currentQuizQuestions = allQuestionsForAge.slice(0, numberOfQuestions);
        showQuestion();
        quizSection.classList.remove('d-none');
        quizSection.scrollIntoView({ behavior: 'smooth' });
    }

    function showQuestion() {
        if (currentQuestionIndex >= currentQuizQuestions.length) {
            endQuiz();
            return;
        }

        const question = currentQuizQuestions[currentQuestionIndex];
        // Creamos una copia de las opciones y las barajamos para que aparezcan en orden aleatorio
        const currentOptions = [...question.options];
        shuffleArray(currentOptions);

        quizImage.src = question.image;
        quizImage.alt = question.question;
        
        // Prepara la animación para el texto de la pregunta
        questionText.classList.remove('animate-question'); // Quita la clase para poder re-aplicarla
        void questionText.offsetWidth; // Truco para forzar al navegador a "refrescar" el elemento
        questionText.textContent = question.question;
        questionText.classList.add('animate-question'); // Aplica la animación

        quizOptions.innerHTML = '';
        currentOptions.forEach((option) => {
            const button = document.createElement('div');
            button.className = 'col-md-6 mb-3';
            button.innerHTML = `
                <button class="btn btn-quiz-option btn-lg w-100 quiz-option" data-option="${option}">
                    ${option}
                </button>
            `;
            quizOptions.appendChild(button);
        });

        // Add event listeners to options
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', selectAnswer);
        });

        nextQuestionBtn.style.display = 'none';
    }

    function selectAnswer(e) {
        const selectedOption = e.target.dataset.option;
        const question = currentQuizQuestions[currentQuestionIndex];
        const correctAnswer = question.correct;
        const options = document.querySelectorAll('.quiz-option');

        options.forEach(option => {
            option.disabled = true;
            if (option.dataset.option === correctAnswer) {
                option.classList.remove('btn-quiz-option');
                option.classList.add('btn-success');
            } else if (option.dataset.option === selectedOption) {
                option.classList.remove('btn-quiz-option');
                option.classList.add('btn-danger');
            }
        });

        if (selectedOption === correctAnswer) {
            score++;
            quizScore.textContent = score;
            playSound('correct');
            updateProgress('quiz');
        } else {
            playSound('incorrect');
        }

        nextQuestionBtn.style.display = 'inline-block';
    }

    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            showQuestion();
        });
    }

    function endQuiz() {
        const quizContainer = document.getElementById('quizQuestion');
        const isPerfectScore = score === currentQuizQuestions.length;

        if (isPerfectScore) {
            // Lanzamos la animación de confeti
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                zIndex: 1057
            });

            quizContainer.innerHTML = `
                <div class="feedback-container text-center">
                    <div class="trophy-animation">🏆</div>
                    <h3>¡Felicidades! ¡Puntuación perfecta!</h3>
                    <p>Respondiste ${score} de ${currentQuizQuestions.length} preguntas correctamente.</p>
                    <button class="btn btn-primary" onclick="location.reload()">Jugar de nuevo</button>
                </div>
            `;
        } else {
            quizContainer.innerHTML = `
                <h3>¡Quiz completado!</h3>
                <p>Tu puntuación: ${score}/${currentQuizQuestions.length}</p>
                <button class="btn btn-primary" onclick="location.reload()">Jugar de nuevo</button>
            `;
        }

        quizOptions.innerHTML = '';
        nextQuestionBtn.style.display = 'none';

        // Save progress
        const progress = JSON.parse(localStorage.getItem('funenglish_progress') || '{}');
        progress.games = (progress.games || 0) + 1;
        localStorage.setItem('funenglish_progress', JSON.stringify(progress));
    }

    function playSound(type) {
        // Placeholder for sound effects
        console.log(`Playing ${type} sound`);
        // In a real implementation, you would play audio files
    }

    function updateProgress(type) {
        const progress = JSON.parse(localStorage.getItem('funenglish_progress') || '{}');
        if (type === 'quiz') {
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