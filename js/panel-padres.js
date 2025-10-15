document.addEventListener('DOMContentLoaded', function() {
    const progressTable = document.getElementById('progressTable');
    // Elementos de la suscripción
    const planTypeEl = document.getElementById('planType');
    const expirationDateEl = document.getElementById('expirationDate');

    // Función para cargar los datos de progreso desde localStorage
    function loadParentData() {
        const progress = JSON.parse(localStorage.getItem('funenglish_progress') || '{}');
        
        // Extraemos todos los datos de progreso
        const words = progress.words || 0;
        const games = progress.games || 0;
        const stories = progress.stories || 0;

        // Llenar la tabla de progreso con datos reales
        if (progressTable) {
            progressTable.innerHTML = `
                <tr>
                    <td>Palabras Aprendidas</td>
                    <td>${words}</td>
                    <td>${words * 5} pts</td>
                </tr>
                <tr>
                    <td>Juegos Completados</td>
                    <td>${games}</td>
                    <td>${games * 10} pts</td>
                </tr>
                <tr>
                    <td>Cuentos Leídos</td>
                    <td>${stories}</td>
                    <td>${stories * 15} pts</td>
                </tr>
            `;
        }

        // Cargar el gráfico
        loadChart(progress);

        // Cargar datos de suscripción
        const subscription = window.checkSubscription ? window.checkSubscription() : null;
        if (subscription && planTypeEl && expirationDateEl) {
            planTypeEl.textContent = subscription.type;
            expirationDateEl.textContent = `Vence el ${new Date(subscription.endDate).toLocaleDateString()}`;
        } else if (planTypeEl && expirationDateEl) {
            planTypeEl.textContent = 'Plan Gratuito / Vencido';
            expirationDateEl.textContent = 'No aplica';
        }

        // --- Cargar el último código de verificación para depuración ---
        const lastCodeEl = document.getElementById('lastVerificationCode');
        if (lastCodeEl) {
            const lastCode = localStorage.getItem('funenglish_last_code');
            lastCodeEl.textContent = lastCode || '----';
        }

        // --- Cargar la lista de usuarios para depuración ---
        const userListTable = document.getElementById('userListTable');
        if (userListTable && window.getActiveUser) { // Usamos getActiveUser para saber que auth.js cargó
            const users = JSON.parse(localStorage.getItem('funenglish_users') || '[]');
            if (users.length > 0) {
                userListTable.innerHTML = users.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.password}</td>
                        <td>${user.parentPassword}</td>
                    </tr>
                `).join('');
            } else {
                userListTable.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center">No hay usuarios registrados todavía.</td>
                    </tr>
                `;
            }
        }

    }

    // Función para cargar el gráfico (usando Chart.js)
    function loadChart(progress) {
        const ctx = document.getElementById('progressChart');
        if (!ctx) return;

        // Destruir gráfico existente si lo hay, para evitar duplicados
        if (window.myProgressChart) {
            window.myProgressChart.destroy();
        }

        window.myProgressChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Palabras Aprendidas', 'Juegos Completados', 'Cuentos Leídos'],
                datasets: [{
                    label: 'Progreso General',
                    data: [
                        progress.words || 0, 
                        progress.games || 0, 
                        progress.stories || 0
                    ],
                    backgroundColor: [
                        'rgba(255, 185, 163, 0.7)', // --color-primario
                        'rgba(184, 224, 210, 0.7)', // --color-secundario
                        'rgba(168, 216, 234, 0.7)'  // --color-acento
                    ],
                    borderColor: [
                        'rgba(255, 185, 163, 1)',
                        'rgba(184, 224, 210, 1)',
                        'rgba(168, 216, 234, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Cargar los datos al iniciar la página
    loadParentData();
});