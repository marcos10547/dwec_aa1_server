import Api from "./api.js"; 
const api = new Api();     

let selectedCategoryId = null;

async function loadCategories() {
    try {
        const categories = await api.listCategories();
        const categoryList = document.getElementById('category-list');
        
        categoryList.innerHTML = ''; 

        if (categories && categories.length > 0) {
            categories.forEach(category => {
                const categoryEl = document.createElement('div');
                categoryEl.className = 'category-item'; 
                categoryEl.dataset.id = category.id;
                categoryEl.innerHTML = `<span>${category.name}</span>`;
                
                categoryEl.addEventListener('click', () => {
                    document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
                    categoryEl.classList.add('active');
                    
                    selectedCategoryId = category.id;                    
                    loadSites(category.id, category.name); 

                    const addSiteBtn = document.getElementById('add-site-btn');
                    if (addSiteBtn) {
                        addSiteBtn.style.display = 'inline-block'; 
                        addSiteBtn.href = `site_form.html?categoryId=${category.id}`;
                    }
                });

                categoryList.appendChild(categoryEl);
            });
        } else {
             categoryList.innerHTML = '<p class="text-center p-4 text-gray-500">No hay categorías. Añade la primera.</p>';
        }

    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
}

async function loadSites(categoryId, categoryName) {
    try {
        const categoryData = await api.listCategorySites(categoryId);
        const siteListTitle = document.getElementById('site-list-title');
        const siteList = document.getElementById('site-list');
        
        siteListTitle.textContent = `Sitios (${categoryName})`;
        siteList.innerHTML = ''; 

        if (categoryData.sites && categoryData.sites.length > 0) {
            categoryData.sites.forEach(site => {
                const siteCard = createSiteCard(site);
                siteList.appendChild(siteCard);
            });
        } else {
            siteList.innerHTML = '<p class="text-center p-4 text-gray-500">No hay sitios en esta categoría. ¡Añade uno!</p>';
        }

    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error al cargar los sitios de la categoría', 'error');
    }
}

function createSiteCard(site) {
    const card = document.createElement('div');
    card.className = 'site-card';
    
    card.innerHTML = `
        <div style="flex-grow: 1;">
            <div class="site-header">
                <h3 class="site-name">${site.name}</h3>
                ${site.url ? `<a href="${site.url}" target="_blank" style="font-size: 0.85rem; color: #007bff;">${site.url}</a>` : ''}
            </div>
            <p style="margin: 5px 0;"><strong>Usuario:</strong> ${site.user}</p>
            
            <div style="display: flex; align-items: center; gap: 10px;">
                <strong>Contraseña:</strong> 
                <span class="password-text">••••••••</span>
                <button class="btn-eye" style="background: none; border: none; cursor: pointer; color: #757575; padding: 0;">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px;" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
                </button>
            </div>
        </div>
        
        <div class="site-actions">
            <button class="btn btn-delete" data-id="${site.id}">
                Eliminar
            </button>
        </div>
    `;

    const eyeBtn = card.querySelector('.btn-eye');
    const passSpan = card.querySelector('.password-text');
    let isVisible = false;

    eyeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        isVisible = !isVisible;

        if (isVisible) {
            passSpan.textContent = site.password;
            passSpan.style.fontFamily = 'monospace';
            eyeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px;" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>`;
        } else {
            passSpan.textContent = '••••••••';
            passSpan.style.fontFamily = 'inherit';
            eyeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px;" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>`;
        }
    });

    const deleteBtn = card.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar el sitio "${site.name}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6', 
            confirmButtonText: 'Sí, eliminarlo',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.delSite(site.id);
                await Swal.fire('¡Eliminado!', 'El sitio ha sido eliminado correctamente.', 'success');
                const tituloActual = document.getElementById('site-list-title').textContent;
                const categoryName = tituloActual.replace('Sitios (', '').replace(')', '');
                loadSites(selectedCategoryId, categoryName);
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Hubo un problema al intentar eliminar el sitio.', 'error');
            }
        }
    });

    return card;
}

function setupCategoryListeners() {
    
    const modal = document.getElementById('category-modal');
    const addBtn = document.getElementById('add-category-btn');
    const cancelBtn = document.getElementById('cancel-category-btn');
    const saveBtn = document.getElementById('save-category-btn');
    const nameInput = document.getElementById('category-name-input');

    addBtn.addEventListener('click', () => {
        modal.classList.add('show'); 
        nameInput.value = '';
        nameInput.focus();
    });

    const closeModal = () => modal.classList.remove('show');
    cancelBtn.addEventListener('click', closeModal);
    
    saveBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        if (!name) return Swal.fire('Error', 'El nombre es obligatorio', 'warning');

        try {
            await api.addNewCategory({ name });
            Swal.fire('Guardado', 'Categoría añadida correctamente', 'success');
            closeModal();
            loadCategories(); 
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo guardar la categoría', 'error');
        }
    });

    const deleteCategoryBtn = document.getElementById('delete-category-btn');
    
    deleteCategoryBtn.addEventListener('click', async () => {
        if (!selectedCategoryId) {
            return Swal.fire('Atención', 'Selecciona una categoría primero', 'warning');
        }

        const result = await Swal.fire({
            title: '¿Eliminar Categoría?',
            text: "Se borrarán la categoría y TODOS sus sitios. No se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar todo'
        });

        if (result.isConfirmed) {
            try {
                await api.delCategory(selectedCategoryId); 
                Swal.fire('Eliminado', 'Categoría eliminada', 'success');
                selectedCategoryId = null; 
                loadCategories(); 
                document.getElementById('site-list').innerHTML = '';
                document.getElementById('site-list-title').textContent = 'Sitios (Selecciona una Categoría)';
                const addSiteBtn = document.getElementById('add-site-btn');
                if (addSiteBtn) addSiteBtn.style.display = 'none';
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
            }
        }
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        const categories = document.querySelectorAll('.category-item');
        categories.forEach(cat => {
            const text = cat.textContent.toLowerCase();
            cat.style.display = text.includes(searchTerm) ? 'flex' : 'none';
        });

        const sites = document.querySelectorAll('.site-card');
        sites.forEach(site => {
            const text = site.textContent.toLowerCase();
            site.style.display = text.includes(searchTerm) ? 'flex' : 'none';
        });
    });
}

setupCategoryListeners();
setupSearch(); 
loadCategories();

