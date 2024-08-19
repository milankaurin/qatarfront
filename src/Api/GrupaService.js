// GroupService.js
import axios from 'axios';

const API_URL = 'https://localhost:7251/api/Grupa'; // Prilagodite URL vašem API endpointu

const createGroup = async (groupName) => {
    try {
        const response = await axios.post(API_URL, { imeGrupe: groupName });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getAllGroups = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteGroup = async (groupId) => {
    try {
        return await axios.delete(`${API_URL}/${groupId}`);
    } catch (error) {
        throw error;
    }
};

export default {
    createGroup,
    getAllGroups,
    deleteGroup
};
