import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import Modal from './components/Modal';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('Karachi');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const apiKey = '1f1d2ab0fbd7dcaf76f3e4d8c12602d4';


  const weatherUrl = (location, unit) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=${unit}&appid=${apiKey}`;

  const fetchWeatherData = async () => {
    try {
      console.log(`Fetching weather data for: ${location}`); 

     
      const weatherResponseF = await axios.get(weatherUrl(location, 'imperial'));
      console.log("Weather data (Fahrenheit):", weatherResponseF.data); 
    
      const weatherResponseC = await axios.get(weatherUrl(location, 'metric'));
      console.log("Weather data (Celsius):", weatherResponseC.data); 

      setData({
        weatherDataF: weatherResponseF.data,
        weatherDataC: weatherResponseC.data,
        hourlyData: await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=imperial&appid=${apiKey}`).then(res => res.data)
      });
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      if (error.request) {
        console.error("Error request:", error.request);
      }
      setShowErrorModal(true);
      setErrorMessage('Failed to fetch weather data. Please check the city name.');
    }
  };
// eslint-disable-next-line
  useEffect(() => {
    fetchWeatherData();
  }, []);
  
  const searchLocation = (event) => {
    if (event.key === 'Enter') {
   
      if (location.trim() !== '') {
        fetchWeatherData(); 
      } else {
        console.warn("Location input is empty.");
      }
    }
  };

  const handleInputChange = (event) => {
    setLocation(event.target.value);
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={handleInputChange}
          onKeyDown={searchLocation} 
          placeholder="Enter Location"
          type="text"
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p className='city-name'>{data.weatherDataF?.name}</p>
          </div>
          <div className="temp">
            {data.weatherDataF?.main ? (
              <>
                <h1>{data.weatherDataF.main.temp.toFixed()}°F</h1>
                <p>{data.weatherDataC?.main ? `${data.weatherDataC.main.temp.toFixed()}°C` : null}</p>
              </>
            ) : null}
          </div>
          <div className="description">
            {data.weatherDataF?.weather ? <p>{data.weatherDataF.weather[0].main}</p> : null}
          </div>
        </div>

        {/* Hourly forecast */}
        <div className="hourly-container">
          {data.hourlyData?.list && data.hourlyData.list.slice(0, 6).map((hour, index) => (
            <div key={index} className="hourly-box">
              <p className='hourly-p'>{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p className='hourly-p'>{hour.main.temp.toFixed()}°F</p>
              <p className='hourly-p'>{hour.weather[0].main}</p>
            </div>
          ))}
        </div>

        {/* Bottom details */}
        <div className="bottom">
          <div className="feels">
            {data.weatherDataF?.main ? <p className='bold'>{data.weatherDataF.main.feels_like.toFixed()}°F</p> : null}
            <p className='bottom-p'>Feels Like</p>
          </div>
          <div className="humidity">
            {data.weatherDataF?.main ? <p className='bold'>{data.weatherDataF.main.humidity}%</p> : null}
            <p className='bottom-p'>Humidity</p>
          </div>
          <div className="wind">
            {data.weatherDataF?.wind ? <p className='bold'>{data.weatherDataF.wind.speed.toFixed()} MPH</p> : null}
            <p className='bottom-p'>Wind Speed</p>
          </div>
        </div>
      </div>

      {showErrorModal && (
        <Modal message={errorMessage} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
