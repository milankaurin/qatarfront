import React from 'react';
import GrupaKomponenta from './GrupaKomponenta';
import ScheduleMatchComponent from './UtakmicaKomponenta'; // Ensure correct import
import TimService from '../Api/TimService';

const MainPage = () => {
    const [selectedGroupId, setSelectedGroupId] = React.useState(null);
    const [teams, setTeams] = React.useState([]);

    const handleGroupSelect = async (groupId) => {
        setSelectedGroupId(groupId);
        await fetchTeams(groupId);
    };

    const fetchTeams = async (groupId) => {
        try {
            const teams = await TimService.getTeamsByGroupId(groupId);
            setTeams(teams);
        } catch (error) {
            console.error('Failed to fetch teams:', error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
            {/* Group Management Section */}
            <GrupaKomponenta onGroupSelect={handleGroupSelect} />

            
        </div>
    );
};

export default MainPage;
