// api.js
const API_BASE_URL = 'http://localhost:3000';

class Api {
    async getAllCategories() {
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

    async addCategory(categoryData) {
        const url = `${API_BASE_URL}/categories`;
        
        const options = {
            methods: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        };
    
        try {
                const response = await fetch(url, options)

                if (!options.ok) {
                    const errorBody = await response.text(); 
                    throw new Error(`Errooooor ${response.status}: ${errorBody || response.statusText}`)
                }
    
                return await response.json();
            
        } catch (error) {
            console.error("Error al crear categorías:", error);
            throw error;
        }
    }
    // addCategory, deleteCategory, findCategoryAndSites

}