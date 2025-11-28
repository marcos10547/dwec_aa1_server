// api.js
const API_BASE_URL = 'http://localhost:3000';

class Api {

    //Te devuelve todos los sitios de la categoría con ese ID.
    async listCategorySites(CategoryId) {
        const url = `${API_BASE_URL}/categories/${CategoryId}`;
        try {

            const response = await fetch(url)
            if (!response.ok) {
                const errorBody = await response.text(); 
                throw new Error(`Error ${response.status}: ${errorBody || response.statusText}`);
            }

            return await response.json()

        } catch (error) {
            console.error(`Error al devolver todos los sitios de la categoría con ese ID ${CategoryId}:`, error);
            throw error;
        }
    }  

    //Te devuelve todas las categorías.
    async listCategories() {
        const url = `${API_BASE_URL}/categories`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorBody = await response.text(); 
                throw new Error(`Error ${response.status}: ${errorBody || response.statusText}`);
            }

            return await response.json(); 

        } catch (error) {
            console.error("Error al obtener categorías:", error);
            throw error; 
        }
    }

    //Te devuelve todos los sitios.
    async listSites() {
        const url = `${API_BASE_URL}/sites`;

        try {
            const response = await fetch(url)    

            if (!response.ok) {
                const errorBody = await response.text(); 
                throw new Error(`Error ${response.status}: ${errorBody || response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error("Error al devolver todos los sitios:", error);
            throw error;
        }
    }

    //Te añade un nuevo sitio a la categoría con ese ID.
    async addNewSite(siteData, CategoryId) {
        const url = `${API_BASE_URL}/categories/${CategoryId}`;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(siteData)
        };

        try {
            const response = await fetch(url, options)

            if (!response.ok) {
                const errorBody = await response.text(); 
                throw new Error(`Errooooor ${response.status}: ${errorBody || response.statusText}`)
            }

            return await response.json()

        } catch (error) {
            console.error(`Error al añadir un site a la categoría con ese ID ${CategoryId}:`, error);
            throw error;
        }
    }

    //Te añade una nueva categoría.
    async addNewCategory(categoryData) {
        const url = `${API_BASE_URL}/categories`;
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        };
    
        try {
                const response = await fetch(url, options)

                if (!response.ok) {
                    const errorBody = await response.text(); 
                    throw new Error(`Errooooor ${response.status}: ${errorBody || response.statusText}`)
                }
    
                return await response.json();
            
        } catch (error) {
            console.error("Error al crear categorías:", error);
            throw error;
        }
    }

    //Te elimina un sitio con ese ID.
    async delSite(SiteId){
        const url = `${API_BASE_URL}/sites/${SiteId}`
        const options = {
            method: 'DELETE'
        };

        try {

            const response = await fetch(url, options)

            if (!response.ok) {
                const errorBody = await response.text(); 
                throw new Error(`Errooooor ${response.status}: ${errorBody || response.statusText}`)
            }

            return { success: true, status: response.status };
            
        } catch (error) {
            console.error(`Error al eliminar el site con ese ID ${SiteId}:`, error);
            throw error;
        }
    }

    //Te elimina una categoría con ese ID.
    async delCategory(CategoryId){
        const url = `${API_BASE_URL}/categories/${CategoryId}`
         const options = {
            method: 'DELETE'
         };
        
        try {
            const response = await fetch(url, options)

            if (!response.ok) {
                const errorBody = await response.text(); 
                throw new Error(`Errooooor ${response.status}: ${errorBody || response.statusText}`)
            }

            return { success: true, status: response.status };
        
        } catch (error) {
            console.error(`Error al eliminar la categoría con ese ID ${CategoryId}:`, error);
            throw error;
        }
    }

}