import React from 'react';
import './style.css';

const Card = ({ data }) => {

    return (
        <div className="card">
            <h2 className="card-location">   {data.city}</h2>
            <p className="card-temperature"> Temp:{data.temp}°C</p>
            <p className="card-description">Clouds: {data.clouds}</p>
            <p> Date: {data.recorded_at.substr(0,10)}</p>
        </div>
    );
};

export default Card;