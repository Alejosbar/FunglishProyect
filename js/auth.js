document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE AUTENTICACIÓN Y SESIÓN ---

    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const mainNav = document.getElementById('main-nav');
    const currentPage = window.location.pathname.split('/').pop();
    const verificationForm = document.getElementById('verificationForm');

    // Simulación de base de datos de usuarios en localStorage
    const getUsers = () => JSON.parse(localStorage.getItem('funenglish_users') || '[]');
    const saveUsers = (users) => localStorage.setItem('funenglish_users', JSON.stringify(users));
    const getCurrentUser = () => localStorage.getItem('funenglish_currentUser');
    const setCurrentUser = (email) => localStorage.setItem('funenglish_currentUser', email);
    const logoutUser = () => {
        localStorage.removeItem('funenglish_currentUser');
        window.location.href = 'index.html';
    };

    // --- MANEJO DE FORMULARIOS (SOLO EN LOGIN.HTML) ---
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const parentPassword = document.getElementById('registerParentPassword').value;
            const errorDiv = document.getElementById('registerError');
            const successDiv = document.getElementById('registerSuccess');

            const users = getUsers();
            if (users.find(user => user.email === email)) {
                errorDiv.textContent = 'Este correo electrónico ya está registrado.';
                errorDiv.classList.remove('d-none');
                successDiv.classList.add('d-none');
                return;
            }

            const newUser = {
                name,
                email,
                password, // En una app real, esto debería estar hasheado
                parentPassword,
                subscription: null // Sin suscripción al registrarse
            };

            users.push(newUser);
            saveUsers(users);

            successDiv.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
            successDiv.classList.remove('d-none');
            errorDiv.classList.add('d-none');
            registerForm.reset();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorDiv = document.getElementById('loginError');
            const verificationModal = new bootstrap.Modal(document.getElementById('verificationModal'));

            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Generar y "enviar" código de verificación
                const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
                
                // Guardamos temporalmente el código y el email a verificar
                sessionStorage.setItem('verificationCode', verificationCode); // Para el proceso de verificación
                localStorage.setItem('funenglish_last_code', verificationCode); // Para mostrarlo en el panel de depuración
                sessionStorage.setItem('emailToVerify', email);

                // Ya no mostramos el código en una alerta. El usuario debe "revisar su correo".
                // El código se puede ver en el panel de padres para fines de desarrollo.

                // Mostramos el modal de verificación
                verificationModal.show();

            } else {
                errorDiv.textContent = 'Correo o contraseña incorrectos.';
                errorDiv.classList.remove('d-none');
            }
        });
    }

    if (verificationForm) {
        verificationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredCode = document.getElementById('verificationCode').value;
            const correctCode = sessionStorage.getItem('verificationCode');
            const errorDiv = document.getElementById('verificationError');

            if (enteredCode === correctCode) {
                const email = sessionStorage.getItem('emailToVerify');
                setCurrentUser(email);
                sessionStorage.clear(); // Limpiamos los datos temporales
                window.location.href = 'estudiantes.html';
            } else {
                errorDiv.textContent = 'El código de verificación es incorrecto.';
                errorDiv.classList.remove('d-none');
            }
        });
    }

    // --- LÓGICA DE LA BARRA DE NAVEGACIÓN (EN TODAS LAS PÁGINAS) ---
    const navLinks = [
        { href: 'index.html', text: 'Inicio' },
        { href: 'estudiantes.html', text: 'Estudiantes' },
        { href: 'progresos.html', text: 'Progresos' },
        { href: 'servicios.html', text: 'Servicios' },
        { href: 'contacto.html', text: 'Contacto' }
    ];

    if (mainNav) {
        let navHTML = '';
        navLinks.forEach(link => {
            const isActive = (currentPage === link.href || (currentPage === '' && link.href === 'index.html'));
            navHTML += `
                <li class="nav-item">
                    <a class="nav-link ${isActive ? 'active' : ''}" href="${link.href}" ${isActive ? 'aria-current="page"' : ''}>${link.text}</a>
                </li>
            `;
        });

        const currentUserEmail = getCurrentUser();
        if (currentUserEmail) {
            // Usuario logueado
            const isActive = currentPage === 'perfil.html';
            navHTML += `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle ${isActive ? 'active' : ''}" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-person-circle"></i> Mi Perfil
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="perfil.html">Ver Perfil</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><button class="dropdown-item" id="logoutBtn">Cerrar Sesión</button></li>
                    </ul>
                </li>
            `;
        } else {
            // Usuario no logueado
            const isActive = currentPage === 'login.html';
            navHTML += `
                <li class="nav-item">
                    <a class="nav-link ${isActive ? 'active' : ''}" href="login.html">Login</a>
                </li>
            `;
        }
        mainNav.innerHTML = navHTML;

        // Añadir evento al botón de logout si existe
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logoutUser);
        }
    }

    // --- LÓGICA DE LA PÁGINA DE PERFIL (SOLO EN PERFIL.HTML) ---
    if (currentPage === 'perfil.html') {
        const currentUserEmail = getCurrentUser();
        if (!currentUserEmail) {
            window.location.href = 'login.html'; // Si no hay sesión, redirigir a login
            return;
        }

        const users = getUsers();
        const user = users.find(u => u.email === currentUserEmail);

        if (user) {
            document.getElementById('profileName').textContent = user.name;
            document.getElementById('profileEmail').textContent = user.email;

            const subscriptionDiv = document.getElementById('profileSubscription');
            if (user.subscription && new Date(user.subscription.endDate) > new Date()) {
                subscriptionDiv.innerHTML = `
                    <p><strong>Plan:</strong> ${user.subscription.type}</p>
                    <p><strong>Vence el:</strong> ${new Date(user.subscription.endDate).toLocaleDateString()}</p>
                    <div class="alert alert-success">Tu suscripción está activa.</div>
                `;
            } else {
                 subscriptionDiv.innerHTML = `
                    <p><strong>Plan:</strong> Ninguno</p>
                    <div class="alert alert-warning">No tienes una suscripción activa.</div>
                    <a href="servicios.html" class="btn btn-primary">Ver Planes</a>
                `;
            }
        }

        const changePassForm = document.getElementById('changeParentPasswordForm');
        changePassForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('newParentPassword').value;
            const successDiv = document.getElementById('passwordChangeSuccess');

            const users = getUsers();
            const userIndex = users.findIndex(u => u.email === currentUserEmail);

            if (userIndex !== -1) {
                users[userIndex].parentPassword = newPassword;
                saveUsers(users);
                successDiv.classList.remove('d-none');
                changePassForm.reset();
                setTimeout(() => successDiv.classList.add('d-none'), 3000);
            }
        });
    }

    // --- FUNCIÓN GLOBAL PARA VERIFICAR SUSCRIPCIÓN ---
    window.checkSubscription = () => {
        const currentUserEmail = getCurrentUser();
        if (!currentUserEmail) return null; // No hay usuario, no hay suscripción

        const users = getUsers();
        const user = users.find(u => u.email === currentUserEmail);

        if (user && user.subscription) {
            const endDate = new Date(user.subscription.endDate);
            if (endDate > new Date()) {
                return user.subscription; // Devuelve la suscripción si es válida
            }
        }
        return null; // No hay suscripción válida
    };

    // --- FUNCIÓN GLOBAL PARA OBTENER DATOS DEL USUARIO ACTUAL ---
    window.getActiveUser = () => {
        const currentUserEmail = getCurrentUser();
        if (!currentUserEmail) return null;
        const users = getUsers();
        return users.find(u => u.email === currentUserEmail) || null;
    };

    // --- FUNCIÓN GLOBAL PARA ACTUALIZAR LA SUSCRIPCIÓN ---
    window.updateUserSubscription = (planType) => {
        const currentUserEmail = getCurrentUser();
        if (!currentUserEmail) {
            alert("Por favor, inicia sesión para suscribirte.");
            window.location.href = 'login.html';
            return false;
        }

        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === currentUserEmail);

        if (userIndex !== -1) {
            const now = new Date();
            const endDate = new Date(now.setDate(now.getDate() + 30)); // Suscripción por 30 días

            users[userIndex].subscription = {
                type: planType,
                startDate: new Date().toISOString(),
                endDate: endDate.toISOString()
            };
            saveUsers(users);
            return true;
        }
        return false;
    };
});