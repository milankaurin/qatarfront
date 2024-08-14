import React, { useState, useEffect } from 'react';
import GroupService from '../Api/GrupaService.js';
import TimService from '../Api/TimService.js';
import StadionService from '../Api/StadionService.js';
import { Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const GroupsComponent = () => {
    const [groups, setGroups] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [teamName, setTeamName] = useState('');
    const [groupName, setGroupName] = useState('');
    const [matchDate, setMatchDate] = useState(null);
    const [selectedTeam1, setSelectedTeam1] = useState('');
    const [selectedTeam2, setSelectedTeam2] = useState('');
    const [matchOutcome, setMatchOutcome] = useState('played');
    const [stadiums, setStadiums] = useState([]);
    const [selectedStadium, setSelectedStadium] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await GroupService.getAllGroups();
                setGroups(data);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
            }
        };

        fetchGroups();
    }, []);

    useEffect(() => {
        const fetchStadiums = async () => {
            try {
                const data = await StadionService.getAllStadiums();
                setStadiums(data);
            } catch (error) {
                console.error('Failed to fetch stadiums:', error);
            }
        };

        fetchStadiums();
    }, []);

    const handleCreateGroup = async () => {
        try {
            await GroupService.createGroup(groupName);
            setGroupName(''); // Clear the input field
            const updatedGroups = await GroupService.getAllGroups();
            setGroups(updatedGroups);
        } catch (error) {
            console.error('Failed to create group:', error);
        }
    };

    const handleGroupSelect = async (groupId) => {
        setSelectedGroupId(groupId);
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
                zastavica: '', // Default to an empty string or null
                brojPoena: 0,
                brojPobeda: 0,
                brojPoraza: 0,
                brojNeresenih: 0,
                brojDatihGolova: 0,
                brojPrimljenihGolova: 0,
            };

            await TimService.createTeam(teamData);
            setTeamName(''); // Clear the input field
            const updatedTeams = await TimService.getTeamsByGroupId(selectedGroupId);
            setTeams(updatedTeams);

        } catch (error) {
            console.error('Failed to create team:', error);
        }
    };
    const handleMatchSchedule = async () => {
        // Placeholder for handling the match scheduling logic
        // You would typically create a new service method in `UtakmicaService.js` to handle this
    };

    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
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

                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <h3>Zakazivanje Utakmice</h3>
                        <Select
                            value={selectedTeam1}
                            onChange={(e) => setSelectedTeam1(e.target.value)}
                            displayEmpty
                            style={{ marginRight: '10px', minWidth: '150px' }}
                        >
                            <MenuItem value="" disabled>
                                Odaberite Prvi Tim
                            </MenuItem>
                            {teams.map(team => (
                                <MenuItem key={team.id} value={team.id}>
                                    {team.imeTima}
                                </MenuItem>
                            ))}
                        </Select>

                        <Select
                            value={selectedTeam2}
                            onChange={(e) => setSelectedTeam2(e.target.value)}
                            displayEmpty
                            style={{ marginRight: '10px', minWidth: '150px' }}
                        >
                            <MenuItem value="" disabled>
                                Odaberite Drugi Tim
                            </MenuItem>
                            {teams.map(team => (
                                <MenuItem key={team.id} value={team.id}>
                                    {team.imeTima}
                                </MenuItem>
                            ))}
                        </Select>

                        <RadioGroup
                            row
                            value={matchOutcome}
                            onChange={(e) => setMatchOutcome(e.target.value)}
                            style={{ marginTop: '20px', justifyContent: 'center' }}
                        >
                            <FormControlLabel value="played" control={<Radio />} label="Utakmica se odigrava" />
                            <FormControlLabel value="forfeit1" control={<Radio />} label="Tim 1 predao" />
                            <FormControlLabel value="forfeit2" control={<Radio />} label="Tim 2 predao" />
                        </RadioGroup>

                        {matchOutcome === 'played' && (
                            <>
                                <Select
                                    value={selectedStadium}
                                    onChange={(e) => setSelectedStadium(e.target.value)}
                                    displayEmpty
                                    style={{ marginRight: '10px', marginTop: '20px', minWidth: '150px' }}
                                >
                                    <MenuItem value="" disabled>
                                        Odaberite Stadion
                                    </MenuItem>
                                    {stadiums.map(stadium => (
                                        <MenuItem key={stadium.id} value={stadium.id}>
                                            {stadium.nazivStadiona}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <DatePicker
                                    selected={matchDate}
                                    onChange={(date) => setMatchDate(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    placeholderText="Izaberite datum i vreme"
                                    style={{ marginTop: '20px' }}
                                />
                            </>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '20px' }}
                            onClick={handleMatchSchedule}
                        >
                            Zakazite Utakmicu
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default GroupsComponent;