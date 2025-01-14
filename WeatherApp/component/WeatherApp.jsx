import React, { useState, useEffect } from "react";
import "./style.css";
import axios from 'axios'
import Card from "./Card";

const WeatherApp = () => {
  const [activeTab, setActiveTab] = useState("userWeather");
  const [coordinates, setCoordinates] = useState(null);
  const [userWeatherData, setUserWeatherData] = useState(null);
  const [searchWeatherData, setSearchWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [citySearch, setCitySearch] = useState("");
  const [mapData,setMapdata] = useState([]);

  const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

  useEffect(() => {
    const savedCoordinates = sessionStorage.getItem("user-coordinates");
    if (savedCoordinates) {
      setCoordinates(JSON.parse(savedCoordinates));
    }
  }, []);

  useEffect(() => {
    if (coordinates) {
      fetchWeatherDataByCoords(coordinates.lat, coordinates.lon, "userWeather");
    }
  }, [coordinates]);

  const fetchWeatherDataByCoords = async (lat, lon, target) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data2 = await response.json();
      console.log(data2);
      if (response.ok) {
        if (target === "userWeather") setUserWeatherData(data2);
      } else {
        setError("Unable to fetch weather data.");
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherDataByCity = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const response1 = await fetch("http://127.0.0.1:8000/api/weather/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: city }),
      });
  
      const data1 = await response1.json();
      // console.log(data1);  
      if (response1.ok) {
        console.log("chla gya bhai ");
       
      } else {
        console.log("Error:", data1);  
        setError("Unable to fetch weather data.");
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
};
const fetchWeatherDataByCitys = async (city) => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/weather/filter?city=${city}`);
    const data = await response.json();
    setMapdata(data);
    console.log("API response:", data); 
  
    if (response.ok) {
      if (Array.isArray(data) && data.length > 0) {
        setSearchWeatherData(data[data.length - 1]);
        console.log("Weather Data:", data[data.length - 1]); 
      } else {
        setError("No weather data available for this city.");
        setSearchWeatherData(null);
      }
    } else {
      setError("City not found.");
    }
  } catch (err) {
    setError("Something went wrong!");
  } finally {
    setLoading(false);
  }
};


  const handleGrantAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userCoordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
        setCoordinates(userCoordinates);
      });
    } else {
      setError("Geolocation not supported.");
    }
  };

  const handleCitySearchSubmit = (e) => {
    e.preventDefault();
    if (citySearch.trim()) {
      fetchWeatherDataByCity(citySearch.trim());
      fetchWeatherDataByCitys(citySearch.trim());
    }
  };

  // const renderWeatherDetails = (weatherData) => (
  //   <div className="sub-container user-info-container active">
  //     <div className="name">
  //       <p>{weatherData.name}</p>
  //       <img
  //         src={`https://flagcdn.com/144x108/${weatherData.sys.country.toLowerCase()}.png`}
  //         alt="Country Flag"
  //       />
  //     </div>
  //     <p>{weatherData.weather[0].description}</p>
  //     <img
  //       src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
  //       alt="Weather Icon"
  //     />
  //     <p>{weatherData.main.temp} °C</p>
  //     <div className="parameter-container">
  //       <div className="parameter">
  //         <img src="wind.png" alt="Windspeed" />
  //         <p>Windspeed</p>
  //         <p>{weatherData.wind.speed} m/s</p>
  //       </div>
  //       <div className="parameter">
  //         <img src="humidity.png" alt="Humidity" />
  //         <p>Humidity</p>
  //         <p>{weatherData.main.humidity} %</p>
  //       </div>
  //       <div className="parameter">
  //         <img src="clouds.png" alt="Cloudiness" />
  //         <p>Cloudiness</p>
  //         <p>{weatherData.clouds.all} %</p>
  //       </div>
  //     </div>
  //   </div>
  const renderWeatherDetailss =(datas)=>(
   
    <div className="sub-container user-info-container active">
      <div className="name">
        <p>{datas.name || "City not found"}</p>
      </div>
      
      <p>
        {datas.weather && datas.weather[0]
          ? datas.weather[0].description
          : "Description not available"}
      </p>
      <img
        src={`http://openweathermap.org/img/w/${datas.weather[0].icon}.png`}
        alt="Weather Icon"
      />
      <p>{datas.main.temp ? `${datas.main.temp} °C` : "Temperature not available"}</p>
      <div className="parameter-container">
        <div className="parameter">
          <img src="wind.png" alt="Windspeed" />
          <p>Windspeed</p>
          <p>{datas.wind.speed ? `${datas.wind.speed} m/s` : "N/A"}</p>
        </div>
        <div className="parameter">
          <img src="humidity.png" alt="Humidity" />
          <p>Humidity</p>
          <p>{datas.main.humidity ? `${datas.main.humidity} %` : "N/A"}</p>
        </div>
        <div className="parameter">
          <img src="clouds.png" alt="Cloudiness" />
          <p>Cloudiness</p>
          <p>{datas.clouds.all ? `${datas.clouds.all} %` : "N/A"}</p>
        </div>
      </div>
    </div>
   
    )

  const renderWeatherDetails = (weatherData) => (
    <div className="sub-container user-info-container active">
      <div className="name">
        <p>{weatherData.city || "City not found"}</p>
      </div>
      <p>
        {weatherData.clouds && weatherData.clouds
          ? weatherData.description
          : "Description not available"}
      </p>
      <p>{weatherData.temp ? `${weatherData.temp} °C` : "Temperature not available"}</p>
      <div className="parameter-container">
        <div className="parameter">
          <img src="wind.png" alt="Windspeed" />
          <p>Windspeed</p>
          <p>{weatherData.speed ? `${weatherData.speed} m/s` : "N/A"}</p>
        </div>
        <div className="parameter">
          <img src="humidity.png" alt="Humidity" />
          <p>Humidity</p>
          <p>{weatherData.humidity ? `${weatherData.humidity} %` : "N/A"}</p>
        </div>
        <div className="parameter">
          <img src="clouds.png" alt="Cloudiness" />
          <p>Cloudiness</p>
          <p>{weatherData.clouds ? `${weatherData.clouds} %` : "N/A"}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wrapper">
      <h1>Weather App</h1>

      <div className="tab-container">
        <p
          className={`tab ${activeTab === "userWeather" ? "current-tab" : ""}`}
          onClick={() => setActiveTab("userWeather")}
        >
          Your Weather
        </p>
        <p
          className={`tab ${activeTab === "searchWeather" ? "current-tab" : ""}`}
          onClick={() => setActiveTab("searchWeather")}
        >
          Search Weather
        </p>
      </div>

      <div className="weather-container">
        {activeTab === "userWeather" && (
          <>
            {!coordinates && (
              <div className="sub-container grant-location-container active">
                <img src="location.png" width={160} alt="Location" />
                <p>Grant Location Access</p>
                <p>Allow Access to get weather Information</p>
                <button className="btn" onClick={handleGrantAccess}>
                  Grant Access
                </button>
              </div>
            )}

            {loading && (
              <div className="sub-container loading-container active">
                <img src="loading.png" width={200} alt="Loading" />
                <p>Loading</p>
              </div>
            )}

            {userWeatherData && !loading && renderWeatherDetailss(userWeatherData)}
          </>
        )}

        {activeTab === "searchWeather" && (
          <>
            <form
              className="form-container active"
              onSubmit={handleCitySearchSubmit}
            >
              <input
                placeholder="Search for City..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
              />
              <button className="btn" type="submit">
                <img width={20} src="search.png" alt="Search" />
              </button>
            </form>

            {loading && (
              <div className="sub-container loading-container active">
                <img src="loading.png" alt="Loading" />
                <p>Loading</p>
              </div>
            )}

            {searchWeatherData && !loading && renderWeatherDetails(searchWeatherData)}
          </>
        )}
      </div>
{activeTab === "searchWeather" && <div className="prev">
      <h3 >Previous Day Weather</h3>
      </div>
}
        <div className="cards">

     

        { activeTab === "searchWeather" && 
              mapData.map((data)=>{
              
                return (
                  <Card data= {data}></Card>
                )
             
              })
        }
        </div>



    </div>
  );
};

export default WeatherApp;








