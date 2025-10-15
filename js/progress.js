document.addEventListener('DOMContentLoaded', function() {
    const parentAccessBtn = document.getElementById('parentAccessBtn');
    
    // Función para mostrar/ocultar el panel de padres
    if (parentAccessBtn) {
        const parentAccessModal = new bootstrap.Modal(document.getElementById('parentAccessModal'));
        const parentAccessModalEl = document.getElementById('parentAccessModal');
        const parentAccessForm = document.getElementById('parentAccessForm');
        const confirmAccessBtn = document.getElementById('confirmParentAccess');
        const parentCodeInput = document.getElementById('parentCode');
        const parentCodeError = document.getElementById('parentCodeError');

        parentAccessBtn.addEventListener('click', () => {
            parentCodeInput.value = ''; // Limpiar el campo
            parentCodeError.classList.add('d-none'); // Ocultar error
            parentAccessModal.show();
        });

        // Escuchamos el evento 'submit' del formulario, que es más robusto
        parentAccessForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevenimos que la página se recargue

            const activeUser = window.getActiveUser ? window.getActiveUser() : null;
            const userCode = parentCodeInput.value.trim();
            // El código correcto ahora es la contraseña de padres del usuario activo
            const correctCode = activeUser ? activeUser.parentPassword : null;

            if (correctCode && userCode === correctCode) {
                // Si el código es correcto, la redirección ahora sí funcionará.
                window.location.href = 'panel-padres.html';
            } else {
                // Si es incorrecto, mostramos el mensaje de error
                parentCodeError.classList.remove('d-none');
                parentCodeInput.focus();
            }
        });
    }

    // Función para cargar los datos de progreso desde localStorage
    function loadProgress() {
        // --- Lógica para el reinicio semanal del progreso ---
        const now = new Date();
        const lastResetString = localStorage.getItem('funenglish_last_reset');
        let shouldReset = false;

        if (!lastResetString) {
            // Si es la primera vez, guardamos la fecha actual para empezar a contar.
            localStorage.setItem('funenglish_last_reset', now.toISOString());
        } else {
            const lastResetDate = new Date(lastResetString);
            const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000; // Milisegundos en una semana

            // Comprobamos si ha pasado una semana desde el último reinicio.
            if (now.getTime() - lastResetDate.getTime() >= oneWeekInMillis) {
                shouldReset = true;
            }
        }

        if (shouldReset) {
            localStorage.removeItem('funenglish_progress'); // Borramos el progreso
            localStorage.setItem('funenglish_last_reset', now.toISOString()); // Guardamos la nueva fecha de reinicio
        }

        // Elementos del dashboard (se buscan dentro de la función para evitar errores en otras páginas)
        const medalsCount = document.getElementById('medalsCount');
        const starsCount = document.getElementById('starsCount');
        const trophiesCount = document.getElementById('trophiesCount');
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        const wordsLearned = document.getElementById('wordsLearned');
        const gamesCompleted = document.getElementById('gamesCompleted');
        const storiesRead = document.getElementById('storiesRead');
        const progress = JSON.parse(localStorage.getItem('funenglish_progress') || '{}');

        const words = progress.words || 0;
        const games = progress.games || 0;
        const stories = progress.stories || 0;

        // Lógica simple para calcular medallas, estrellas, etc.
        // Puedes ajustar esta lógica como prefieras.
        const medals = Math.floor(games / 3); // 1 medalla cada 3 juegos
        const stars = words; // 1 estrella por cada palabra/par
        const trophies = Math.floor(stories / 2); // 1 trofeo cada 2 cuentos

        // Actualizar los contadores en la página
        if(medalsCount) medalsCount.textContent = medals;
        if(starsCount) starsCount.textContent = stars;
        if(trophiesCount) trophiesCount.textContent = trophies;
        if(wordsLearned) wordsLearned.textContent = words;
        if(gamesCompleted) gamesCompleted.textContent = games;
        if(storiesRead) storiesRead.textContent = stories;

        // Actualizar la barra de progreso (ejemplo: 100% a las 100 palabras)
        const totalProgress = Math.min((words / 100) * 100, 100);
        if(progressBar) progressBar.style.width = `${totalProgress}%`;
        if(progressBar) progressBar.setAttribute('aria-valuenow', totalProgress);
        if(progressPercent) progressPercent.textContent = `${Math.round(totalProgress)}%`;
    }

    // Cargar el progreso al iniciar la página
    loadProgress();
});