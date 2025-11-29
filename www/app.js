// app.js
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
                });

                categoryList.appendChild(categoryEl);
            });
        } else {
             categoryList.innerHTML = '<p class="text-center p-4 text-gray-500">No hay categorías. Añade la primera.</p>';
        }

    } catch (error) {
        console.error("Error fatal al cargar categorías:", error);
        alert("No se pudo conectar con el servidor o cargar las categorías.");
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
        console.error("Error al cargar los sitios:", error);
        alert("Error al cargar los sitios de la categoría.");
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
            <p style="margin: 0;"><strong>Contraseña:</strong> ${site.password}</p> 
        </div>
        
        <div class="site-actions">
            <button class="btn btn-delete" data-id="${site.id}">
                Eliminar
            </button>
        </div>
    `;

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

                await Swal.fire(
                    '¡Eliminado!',
                    'El sitio ha sido eliminado correctamente.',
                    'success'
                );

                const tituloActual = document.getElementById('site-list-title').textContent;
                const categoryName = tituloActual.replace('Sitios (', '').replace(')', '');
                
                loadSites(selectedCategoryId, categoryName);

            } catch (error) {
                console.error(error);
                Swal.fire(
                    'Error',
                    'Hubo un problema al intentar eliminar el sitio.',
                    'error'
                );
            }
        }
    });

    return card;
}

loadCategories();

