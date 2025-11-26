// api.js
const API_BASE_URL = 'http://localhost:3000';

class Api {
    
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
            console.error("Error al añadir un site:", error);
            throw error;
        }
    }  

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
            console.error("Error al añadir un site:", error);
            throw error;
        }
    }

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
            console.error("Error al añadir un site:", error);
            throw error;
        }
    }

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
            console.error("Error al eliminar un site:", error);
            throw error;
        }
    }

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
            console.error("Error al eliminar una categoría:", error);
            throw error;
        }
    }

}