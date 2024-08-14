import React from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate(); // Updated hook

    const handleProceed = () => {
        navigate('/main'); // Updated method
    };

    return (
        <div className="landing-container">
<h1 style={{ fontFamily: 'Roboto, sans-serif', fontSize: '24px'}}>
  Dobrodošli na Svetsko Prvenstvo u Kataru 2022
</h1>            <img src="/logo.png" alt="World Cup Logo" className="logo"/>
            <button onClick={handleProceed} className="proceed-button">Nastavi</button>
            </div>
    );
};

export default LandingPage;
