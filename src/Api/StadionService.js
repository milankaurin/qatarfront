import axios from 'axios';

const API_URL = 'https://localhost:7251/api/Stadion'; // Adjust this to your API URL

const getAllStadiums = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getAllStadiums,
};