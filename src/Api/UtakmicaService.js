import axios from 'axios';

const API_URL = 'https://localhost:7251/api/Utakmica';

const getMatchesByGroupId = async (groupId) => {
    try {
        return await axios.get(`${API_URL}/ByGroup/${groupId}`);
    } catch (error) {
        throw error;
    }
};

const createMatch = async (matchData) => {
    try {
        return await axios.post(API_URL, matchData);
    } catch (error) {
        throw error;
    }
};

const scheduleMatch = async (matchDetails) => {
    try {
        const response = await axios.post(`${API_URL}`, matchDetails);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateMatch = async (id, matchData) => {
    try {
        return await axios.put(`${API_URL}/${id}`, matchData);
    } catch (error) {
        throw error;
    }
};

const deleteMatch = async (id) => {
    try {
        return await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        throw error;
    }
};

const setMatchResult = async (id, tim1Golovi, tim2Golovi) => {
    try {
        const response = await axios.put(`${API_URL}/${id}/SetRezultat`, { tim1Golovi, tim2Golovi });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const setForfeit = async (utakmicaId, team1Forfeits, team2Forfeits) => {
    try {
        const response = await axios.put(`${API_URL}/${utakmicaId}/SetRezultat`, {
            tim1Predao: team1Forfeits,
            tim2Predao: team2Forfeits,
            tim1Golovi: team1Forfeits ? 0 : null,
            tim2Golovi: team2Forfeits ? 0 : null
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    scheduleMatch,
    getMatchesByGroupId,
    createMatch,
    updateMatch,
    deleteMatch,
    setMatchResult, 
    setForfeit
};
