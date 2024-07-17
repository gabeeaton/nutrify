import axios from 'axios';

export const app_key = '4f6ba1ac291cb9d9f5fced4ea3378e3b';
export const app_id = '2553f5e4';
export const API_URL = `https://api.edamam.com/api/food-database/v2/parser?app_id=${app_id}&app_key=${app_key}`;

export const fetchAPI = async (foodText) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                app_id: app_id,
                app_key: app_key,
                ingr: foodText,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    }
};

