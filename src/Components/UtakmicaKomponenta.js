import React, { useState, useEffect } from 'react';
import StadionService from '../Api/StadionService.js';
import TimService from '../Api/TimService.js';
import { Button, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ScheduleMatchComponent = ({ teams }) => {
    const [matchDate, setMatchDate] = useState(null);
    const [selectedTeam1, setSelectedTeam1] = useState('');
    const [selectedTeam2, setSelectedTeam2] = useState('');
    const [matchOutcome, setMatchOutcome] = useState('played');
    const [stadiums, setStadiums] = useState([]);
    const [selectedStadium, setSelectedStadium] = useState('');

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

    const handleMatchSchedule = async () => {
        // Placeholder for handling the match scheduling logic
        // You would typically create a new service method in `UtakmicaService.js` to handle this
    };

    return (
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
                        style={{ marginRight: '10px', marginTop: '20px', minWidth: '150px', color:'white' }}
                    >
                        <MenuItem value="" disabled>
                            Odaberite Stadion
                        </MenuItem>
                        {stadiums.map(stadium => (
                            <MenuItem key={stadium.id} value={stadium.id}>
                                {stadium.imeStadiona}
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
    );
};

export default ScheduleMatchComponent;
