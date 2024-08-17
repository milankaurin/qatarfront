import axios from 'axios';

const API_URL = 'https://localhost:7251/api/Tim'; // Adjust this to your API URL

const getTeamsByGroupId = async (groupId) => {
    try {
        const response = await axios.get(`${API_URL}/byGrupa/${groupId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createTeam = async (teamData) => {
    try {
        const response = await axios.post(API_URL, teamData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
const getTeamById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getTeamsByGroupId, 
    createTeam, 
    getTeamById
};
