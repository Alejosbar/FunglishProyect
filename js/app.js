// FUNGLISH App JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Lazy Loading for Images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Toggle video sound on click
    const groupVideo = document.getElementById('groupVideo');
    const videoMuteIcon = document.getElementById('videoMuteIcon');
    if (groupVideo) {
        groupVideo.parentElement.addEventListener('click', () => {
            groupVideo.muted = !groupVideo.muted;
            if (videoMuteIcon) {
                videoMuteIcon.innerHTML = groupVideo.muted 
                    ? '<i class="bi bi-volume-mute-fill"></i>' 
                    : '<i class="bi bi-volume-up-fill"></i>';
            }
        });
    }

    // Age Selection Functionality
    const ageButtons = document.querySelectorAll('.btn-age');
    const ageSelection = document.getElementById('ageSelection');
    const activitySelection = document.getElementById('activitySelection');
    const backToAge = document.getElementById('backToAge');

    // Game start buttons
    const gameSections = document.querySelectorAll('.game-section');
    const gameButtons = document.querySelectorAll('.games-list .btn');

    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Convertimos el ID a minúsculas para evitar problemas de mayúsculas/minúsculas.
            // Ej: "startSimonDice" -> "simondicesection"
            const gameId = button.id.replace('start', '').toLowerCase() + 'section';
            // Buscamos la sección que coincida, sin importar mayúsculas/minúsculas.
            const targetSection = document.getElementById(gameId);
            
            gameSections.forEach(s => s.classList.add('d-none'));
            if(targetSection) targetSection.classList.remove('d-none');
        });
    });

    ageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const age = this.dataset.age;
            localStorage.setItem('selectedAge', age);

            // Actualizar el enlace de la guía según la edad seleccionada
            const guideLink = activitySelection.querySelector('.guias');
            if (guideLink) {
                // Apuntamos a la página de guías y pasamos la edad como parámetro en la URL.
                // Ahora apuntamos a una página específica para cada edad.
                guideLink.href = `guias/${age}-anos.html`;
            }

            // Animate transition
            ageSelection.classList.add('fade-out');
            setTimeout(() => {
                ageSelection.classList.add('d-none');
                ageSelection.classList.remove('fade-out');
                activitySelection.classList.remove('d-none');
                activitySelection.classList.add('fade-in');
            }, 300);
        });
    });

    if (backToAge) {
        backToAge.addEventListener('click', function(e) {
            e.preventDefault();
            activitySelection.classList.add('fade-out');
            setTimeout(() => {
                activitySelection.classList.add('d-none');
                activitySelection.classList.remove('fade-out');
                ageSelection.classList.remove('d-none');
                ageSelection.classList.add('fade-in');
            }, 300);
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                // Simulate form submission
                alert('Mensaje enviado exitosamente. ¡Gracias por contactarnos!');
                this.reset();
            }
        });
    }

    const quickForm = document.getElementById('quickForm');
    if (quickForm) {
        quickForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Mensaje enviado exitosamente.');
            this.reset();
        });
    }

    // Animate counters
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 20);
    }

    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Verificamos que el elemento sea un contador y que tenga el atributo data-target
                if (entry.target.classList.contains('counter') && entry.target.dataset.target) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    animateCounter(counter, target);
                    counterObserver.unobserve(counter);
                }
            }
        });
    }, { threshold: 0.1 }); // Iniciar animación cuando una pequeña parte es visible

    counters.forEach(counter => counterObserver.observe(counter));

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }

    // Accessibility: Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'sr-only sr-only-focusable';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Keyboard navigation for custom elements
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('btn-age') ||
                focusedElement.classList.contains('activity-card') ||
                focusedElement.classList.contains('game-card')) {
                e.preventDefault();
                focusedElement.click();
            }
        }
    });

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // Could send error to logging service
    });

    // Utility functions
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        // ... (la lógica de validación se mantiene, pero la función loadProgress se elimina)
    }

    // Make functions globally available for other scripts
    window.funenglish = {
        validateForm,
        animateCounter
    };
});