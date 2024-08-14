import React, { useState, useEffect } from 'react';
import GrupaService from '../Api/GrupaService.js';
import TimService from '../Api/TimService.js';
import { Button, TextField, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const GrupaKomponenta = ({ onGroupSelect }) => {
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [groupName, setGroupName] = useState('');
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await GrupaService.getAllGroups();
                setGroups(data);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
            }
        };
        fetchGroups();
    }, []);

    const handleCreateGroup = async () => {
        try {
            await GrupaService.createGroup(groupName);
            setGroupName('');
            const updatedGroups = await GrupaService.getAllGroups();
            setGroups(updatedGroups);
        } catch (error) {
            console.error('Failed to create group:', error);
        }
    };

    const handleGroupSelect = async (groupId) => {
        setSelectedGroupId(groupId);
        onGroupSelect(groupId);
        try {
            const data = await TimService.getTeamsByGroupId(groupId);
            setTeams(data);
        } catch (error) {
            console.error('Failed to fetch teams:', error);
        }
    };

    const handleCreateTeam = async () => {
        try {
            const teamData = {
                imeTima: teamName,
                grupaId: selectedGroupId,
                zastavica: '',
                brojPoena: 0,
                brojPobeda: 0,
                brojPoraza: 0,
                brojNeresenih: 0,
                brojDatihGolova: 0,
                brojPrimljenihGolova: 0,
            };

            await TimService.createTeam(teamData);
            setTeamName('');
            const updatedTeams = await TimService.getTeamsByGroupId(selectedGroupId);
            setTeams(updatedTeams);
        } catch (error) {
            console.error('Failed to create team:', error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <TextField
                    label="Ime Grupe"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <Button variant="contained" color="primary" onClick={handleCreateGroup}>
                    Kreiraj Grupu
                </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                {groups.map(group => (
                    <Button
                        key={group.id}
                        variant={selectedGroupId === group.id ? "contained" : "outlined"}
                        style={{
                            margin: '0 10px',
                            padding: '10px 20px',
                            backgroundColor: selectedGroupId === group.id ? '#1976d2' : 'white',
                            color: selectedGroupId === group.id ? 'white' : '#1976d2',
                        }}
                        onClick={() => handleGroupSelect(group.id)}
                    >
                        {group.imeGrupe}
                    </Button>
                ))}
            </div>

            {selectedGroupId && (
                <>
                    <Table style={{ margin: '0 auto', width: '80%', marginTop: '20px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ime Tima</TableCell>
                                <TableCell>Broj Pobeda</TableCell>
                                <TableCell>Broj Neresenih</TableCell>
                                <TableCell>Broj Poraza</TableCell>
                                <TableCell>Broj Datih Golova</TableCell>
                                <TableCell>Broj Primljenih Golova</TableCell>
                                <TableCell>Broj Poena</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teams.map(team => (
                                <TableRow key={team.id}>
                                    <TableCell>{team.imeTima}</TableCell>
                                    <TableCell>{team.brojPobeda}</TableCell>
                                    <TableCell>{team.brojNeresenih}</TableCell>
                                    <TableCell>{team.brojPoraza}</TableCell>
                                    <TableCell>{team.brojDatihGolova}</TableCell>
                                    <TableCell>{team.brojPrimljenihGolova}</TableCell>
                                    <TableCell>{team.brojPoena}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {teams.length < 4 && (
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                            <TextField
                                label="Ime Tima"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                style={{ marginRight: '10px' }}
                            />
                            <Button variant="contained" color="primary" onClick={handleCreateTeam}>
                                Kreiraj Tim
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GrupaKomponenta;
