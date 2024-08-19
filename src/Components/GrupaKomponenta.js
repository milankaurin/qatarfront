import React, { useState, useEffect } from 'react';
import GrupaService from '../Api/GrupaService.js';
import TimService from '../Api/TimService.js';
import UtakmicaService from '../Api/UtakmicaService.js';
import StadionService from '../Api/StadionService.js';
import { Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ScheduleMatchComponent from './UtakmicaKomponenta.js';

const GrupaKomponenta = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [groupName, setGroupName] = useState('');
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [matches, setMatches] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const data = await GrupaService.getAllGroups();
            setGroups(data);
        } catch (error) {
            console.error('Failed to fetch groups:', error);
        }
    };

    const handleOpenDialog = (groupId) => {
        setOpenDialog(true);
        setGroupToDelete(groupId);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleDeleteGroup = async () => {
        if (groupToDelete) {
            try {
                // Brisanje grupe sa svim entitetima
                await deleteAllMatchesInGroup(groupToDelete);
                await deleteAllTeamsInGroup(groupToDelete);
                await GrupaService.deleteGroup(groupToDelete);
                alert("Grupa i sve povezane entitete su uspešno obrisane!");
                fetchGroups(); // Osvežavanje liste grupa
            } catch (error) {
                console.error('Failed to delete group and its entities:', error);
                alert("Došlo je do greške pri brisanju grupe i povezanih entiteta.");
            }
        }
        handleCloseDialog();
    };


    const deleteAllMatchesInGroup = async (groupId) => {
        const matches = await UtakmicaService.getMatchesByGroupId(groupId);
        for (let match of matches) {
            await UtakmicaService.deleteMatch(match.id);
        }
    };
    
    // Helper funkcija za brisanje svih timova u grupi
    const deleteAllTeamsInGroup = async (groupId) => {
        const teams = await TimService.getTeamsByGroupId(groupId);
        for (let team of teams) {
            await TimService.deleteTeamById(team.id);
        }
    };

    const handleDeleteMatch = async (id) => {
        if (window.confirm("Da li ste sigurni da želite da obrišete utakmicu?")) {
            try {
                await UtakmicaService.deleteMatch(id);
                alert("Utakmica je uspešno obrisana!");
                fetchMatches(selectedGroupId); // Osvežavanje lista utakmica
            } catch (error) {
                console.error('Failed to delete match:', error);
                alert("Došlo je do greške pri brisanju utakmice.");
            }
        }
    };
    

    const handleCreateGroup = async () => {
        try {
            const newGroup = await GrupaService.
            createGroup(groupName);
            setGroups(prevGroups => [...prevGroups, newGroup]);
            setGroupName('');
        } catch (error) {
            console.error('Failed to create group:', error.response.data);
        }
    };

    const handleGroupSelect = async (groupId) => {
        setSelectedGroupId(groupId);
        await fetchTeams(groupId);
        await fetchMatches(groupId);
    };

    const fetchTeams = async (groupId) => {
        try {
            const teamData = await TimService.getTeamsByGroupId(groupId);
            
            // Sort teams based on the ranking criteria
            const sortedTeams = teamData.sort((a, b) => {
                // Sort by points
                if (b.brojPoena !== a.brojPoena) {
                    return b.brojPoena - a.brojPoena;
                }
                // If points are the same, sort by goal difference
                const goalDifferenceA = a.brojDatihGolova - a.brojPrimljenihGolova;
                const goalDifferenceB = b.brojDatihGolova - b.brojPrimljenihGolova;
                if (goalDifferenceB !== goalDifferenceA) {
                    return goalDifferenceB - goalDifferenceA;
                }
                // If goal difference is the same, sort by goals scored
                return b.brojDatihGolova - a.brojDatihGolova;
            });
    
            // Update the state with the sorted teams
            setTeams(sortedTeams);
        } catch (error) {
            console.error('Failed to fetch teams:', error);
        }
    };

    const fetchMatches = async (groupId) => {
        try {
            const response = await UtakmicaService.getMatchesByGroupId(groupId);
            const matches = response.data;

            const teamAndStadiumData = await Promise.all(matches.map(async (match) => {
                const team1 = await TimService.getTeamById(match.tim1Id);
                const team2 = await TimService.getTeamById(match.tim2Id);

                let stadiumName = 'Undefined';
                if (match.stadionId) {
                    const stadium = await StadionService.getStadiumById(match.stadionId);
                    stadiumName = stadium.imeStadiona;
                }

                return {
                    ...match,
                    team1Name: team1.imeTima,
                    team2Name: team2.imeTima,
                    stadiumName: stadiumName
                };
            }));

            setMatches(teamAndStadiumData);
        } catch (error) {
            console.error('Failed to fetch matches:', error);
            setMatches([]);
        }
    };

    const handleCreateTeam = async () => {
        try {
            const newTeam = await TimService.createTeam({
                imeTima: teamName,
                grupaId: selectedGroupId,
                zastavica: '',
                brojPoena: 0,
                brojPobeda: 0,
                brojPoraza: 0,
                brojNeresenih: 0,
                brojDatihGolova: 0,
                brojPrimljenihGolova: 0
            });
            setTeams(prevTeams => [...prevTeams, newTeam]);
            setTeamName('');
            fetchTeams(selectedGroupId); // Refresh the teams
        } catch (error) {
            console.error('Failed to create team:', error);
        }
    };

    const handleSetResult = async (matchId) => {
        const match = matches.find(m => m.id === matchId);
        if (!match) {
            alert("Utakmica nije pronađena.");
            return;
        }
    
        const matchStartTime = new Date(match.vremePocetka);
        if (matchStartTime > new Date()) {
            alert("Nije moguće postaviti rezultat pre zvaničnog vremena početka utakmice.");
            return;
        }
    
        const tim1Golovi = prompt("Unesite broj golova koje je postigao Tim 1:");
        const tim2Golovi = prompt("Unesite broj golova koje je postigao Tim 2:");
    
        // Provera da li su unosi validni celi brojevi veći ili jednaki nuli
        if (isValidScore(tim1Golovi) && isValidScore(tim2Golovi)) {
            try {
                await UtakmicaService.setMatchResult(matchId, parseInt(tim1Golovi), parseInt(tim2Golovi));
                fetchMatches(selectedGroupId);  // Osvežava podatke o utakmicama
                fetchTeams(selectedGroupId);    // Osvežava tabelu timova da odrazi promene u rezultatima
            } catch (error) {
                console.error('Greška pri postavljanju rezultata utakmice:', error);
                alert("Došlo je do greške pri postavljanju rezultata.");
            }
        } else {
            alert("Unesite validne celobrojne vrednosti koje su veće ili jednake nuli za golove.");
        }
    };
    
    function isValidScore(score) {
        const scoreNum = Number(score);
        return Number.isInteger(scoreNum) && scoreNum >= 0;
    }
    

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '40px' }}>
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

                    <Table style={{ margin: '20px auto', width: '90%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tim 1</TableCell>
                                <TableCell>Tim 2</TableCell>
                                <TableCell>Vreme Početka</TableCell>
                                <TableCell>Rezultat</TableCell>
                                <TableCell>Stadion</TableCell>
                                <TableCell>Akcije</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
    {matches.map(match => (
        <TableRow key={match.id}>
            <TableCell>{match.team1Name}</TableCell>
            <TableCell>{match.team2Name}</TableCell>
            <TableCell>{new Date(match.vremePocetka).toLocaleString()}</TableCell>
            <TableCell>{match.predato ? 'Predato' : match.tim1Golovi !== null ? `${match.tim1Golovi} - ${match.tim2Golovi}` : 'N/A'}</TableCell>
            <TableCell>{match.stadionId ? match.stadiumName : 'Undefined'}</TableCell>
            <TableCell>
                {match.tim1Golovi === null && !match.predato && (
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteMatch(match.id)}>
                        Obriši Utakmicu
                    </Button>
                )}
            </TableCell>
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

<ScheduleMatchComponent 
    teams={teams} 
    onMatchScheduled={() => {
        fetchMatches(selectedGroupId);
        fetchTeams(selectedGroupId);
    }} 
/>                </>
            )}
        </div>
    );
};

export default GrupaKomponenta;
