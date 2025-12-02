import Api from "./api.js"; 
const api = new Api();

document.addEventListener('DOMContentLoaded', () => {
    setupFormSubmit();
    setupPasswordToggle();
    setupPasswordGenerator();
    setupDynamicValidation();
});

function setupFormSubmit() {
    const form = document.getElementById('site-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const categoryId = urlParams.get('categoryId');

        if (!categoryId) {
            await Swal.fire('Error', 'No se ha seleccionado ninguna categoría. Vuelve al inicio.', 'error');
            window.location.href = 'index.html';
            return;
        }

        const siteData = {
            name: document.getElementById('site-name').value.trim(),
            url: document.getElementById('site-url').value.trim(),
            user: document.getElementById('site-user').value.trim(),
            password: document.getElementById('site-password').value.trim()
        };

        if (!siteData.name || !siteData.user || !siteData.password) {
            return Swal.fire('Faltan datos', 'Por favor completa los campos obligatorios.', 'warning');
        }

        try {
            await api.addNewSite(siteData, categoryId);

            await Swal.fire({
                title: '¡Guardado!',
                text: 'El sitio se ha añadido correctamente.',
                icon: 'success',
                confirmButtonText: 'Volver al Inicio'
            });

            window.location.href = 'index.html';

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo guardar el sitio. Inténtalo de nuevo.', 'error');
        }
    });
}

function setupPasswordToggle() {
    const toggleBtn = document.getElementById('toggle-password');
    const passInput = document.getElementById('site-password');

    if (toggleBtn && passInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passInput.setAttribute('type', type);

            if (type === 'text') {
                toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>`;
            } else {
                toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>`;
            }
        });
    }
}

function setupPasswordGenerator() {
    const generateBtn = document.getElementById('generate-password');
    const passInput = document.getElementById('site-password');

    if (generateBtn && passInput) {
        generateBtn.addEventListener('click', () => {
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
            const passwordLength = 12;
            let password = "";

            for (let i = 0; i < passwordLength; i++) {
                const randomNumber = Math.floor(Math.random() * chars.length);
                password += chars.substring(randomNumber, randomNumber + 1);
            }

            passInput.value = password;
            passInput.setAttribute('type', 'text');
            
            passInput.dispatchEvent(new Event('input')); 
            passInput.classList.remove('input-error');
        });
    }
}

function setupDynamicValidation() {
    const requiredInputs = document.querySelectorAll('input[required]');

    requiredInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.classList.add('input-error');
            } else {
                input.classList.remove('input-error');
            }
        });

        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.classList.remove('input-error');
            }
        });
    });
}