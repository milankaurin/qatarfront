import React from 'react';
import GrupaKomponenta from './GrupaKomponenta';
import ScheduleMatchComponent from './UtakmicaKomponenta';
import TimService from '../Api/TimService';

const MainPage = () => {
    const [selectedGroupId, setSelectedGroupId] = React.useState(null);
    const [teams, setTeams] = React.useState([]);

   

    const handleGroupSelect = (groupId) => {
        setSelectedGroupId(groupId);
        // Fetch teams based on the selected group
        fetchTeams(groupId);
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Group Management Section */}
            <GrupaKomponenta onGroupSelect={handleGroupSelect} />

            {/* Match Scheduling Section */}
            {selectedGroupId && <ScheduleMatchComponent teams={teams} />}
        </div>
    );
};

export default MainPage;
