import React, { useState, useEffect } from 'react';
import StadionService from '../Api/StadionService.js';
import { Button, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import UtakmicaService from '../Api/UtakmicaService.js';

const ScheduleMatchComponent = ({ teams, onMatchScheduled }) => {
    const [matchDate, setMatchDate] = useState(null);
    const [selectedTeam1, setSelectedTeam1] = useState('');
    const [selectedTeam2, setSelectedTeam2] = useState('');
    const [matchOutcome, setMatchOutcome] = useState('played');
    const [stadiums, setStadiums] = useState([]);
    const [selectedStadium, setSelectedStadium] = useState('');
    const [availableTeamsForTeam1, setAvailableTeamsForTeam1] = useState([]);
    const [availableTeamsForTeam2, setAvailableTeamsForTeam2] = useState([]);

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
        const forfeitDate = new Date('2024-08-16T20:00:00');
        const isForfeit = matchOutcome !== 'played';
    
        const matchDetails = {
            id: 0,
            tim1Id: selectedTeam1,
            tim2Id: selectedTeam2,
            vremePocetka: isForfeit ? forfeitDate.toISOString() : matchDate ? matchDate.toISOString() : null,
            tim1Golovi: isForfeit ? 0 : null,
            tim2Golovi: isForfeit ? 0 : null,
            stadionId: isForfeit ? null : selectedStadium,
            predato: isForfeit,
            tim1Predao: matchOutcome === 'forfeit1',
            tim2Predao: matchOutcome === 'forfeit2'
        };
    
        console.log('JSON sent to API:', JSON.stringify(matchDetails));
    
        try {
            const response = await UtakmicaService.scheduleMatch(matchDetails);
            alert("Utakmica je uspešno zakazana!");
            resetForm();
            onMatchScheduled(); // Refresh the matches table in GrupaKomponenta
        } catch (error) {
            console.error('Failed to schedule the match:', error);
            // Provera da li postoji detaljan opis greške u odgovoru servera
            const errorMessage = error.response && error.response.data ? error.response.data : "Došlo je do greške pri zakazivanju utakmice. Molimo pokušajte ponovo.";
            alert(errorMessage);
        }
    };
    
    const resetForm = () => {
        setSelectedTeam1('');
        setSelectedTeam2('');
        setSelectedStadium('');
        setMatchDate(null);
        setMatchOutcome('played');
    };

    const handleDateChange = (date) => {
        if (!date) return;
      
        // Dobijanje trenutne vremenske zone u minutama i konvertovanje u milisekunde
        const timezoneOffset = date.getTimezoneOffset() * 60000;
      
        // Prilagođavanje izabranog vremena prema vremenskoj zoni
        const localDate = new Date(date.getTime() - timezoneOffset);
      
        // Postavljanje prilagođenog datuma
        setMatchDate(localDate);
      };

    useEffect(() => {
        if (teams.length) {
            if (selectedTeam1) {
                setAvailableTeamsForTeam2(teams.filter(team => team.id !== selectedTeam1));
            } else {
                setAvailableTeamsForTeam2(teams);
            }
            if (selectedTeam2) {
                setAvailableTeamsForTeam1(teams.filter(team => team.id !== selectedTeam2));
            } else {
                setAvailableTeamsForTeam1(teams);
            }
        }
    }, [teams, selectedTeam1, selectedTeam2]);

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
                {availableTeamsForTeam1.map(team => (
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
                {availableTeamsForTeam2.map(team => (
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
                                {stadium.imeStadiona}
                            </MenuItem>
                        ))}
                    </Select>

                    <DatePicker
  selected={matchDate}
  onChange={handleDateChange}
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
