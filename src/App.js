import React, { useState } from "react";
import "./App.css";
import WeatherComponent from "./WeatherComponent";

const API_key = "2cada9ca74d775498c3a285526d16cc2";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);

  const createContent = (weatherItem, index) => {
    let cityName = inputValue;
    return (
      <li
        key={index}
        className="weather-content col-md-3 me-5 mb-5 col-sm-4 bg-info "
      >
        <h2>
          {cityName} ({weatherItem.dt_txt.split(" ")[0]})
        </h2>
        <img
          src={`https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`}
          alt="Weather Icon"
        />
        <h4>Temperature: {weatherItem.main.temp}k</h4>
        <h4>Wind: {weatherItem.wind.speed}m/s</h4>
        <h4>Humidity: {weatherItem.main.humidity}%</h4>
      </li>
    );
  };

  const getDetails = (name, lat, lon) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`
    )
      .then((res) => res.json())
      .then((data) => {
        const sevendays = data.list;
        const sevendaysSet = new Set();
        const sevenArray = [];
        const sevenArray2 = [];
        let y = 2;

        sevendays.forEach((forecast) => {
          const newDay = new Date(forecast.dt_txt).getDate();

          if (!sevendaysSet.has(newDay)) {
            sevendaysSet.add(newDay);
            sevenArray.push(forecast);
          } else if (y > 0) {
            let dt = new Date(forecast.dt_txt);
            dt.setDate(newDay + 8 - y);
            sevenArray2.push({
              ...forecast,
              dt_txt: dt.toISOString().substring(0, 10),
            });
            y -= 1;
          }
        });

        setWeatherData([...sevenArray, ...sevenArray2]);
        setCurrentWeather(sevenArray[0]);
      })
      .catch(() => {
        alert("Error occurred while fetching weather details");
      });
  };

  const getValue = () => {
    const cityName = inputValue;
    if (!cityName) return;

    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.length)
          return alert("An error occurred while finding the name");

        const { name, lat, lon } = data[0];
        getDetails(name, lat, lon);
      })
      .catch(() => {
        alert("Error occurred while fetching location");
      });
  };

  const getCoordinate = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&limit=1&lon=${longitude}&appid=${API_key}`
        )
          .then((res) => res.json())
          .then((data) => {
            const { name, lat, lon } = data[0];
            getDetails(name, lat, lon);
          })
          .catch(() => alert("Location not detected"));
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) alert("Permission denied");
      }
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4 me-5 mb-5 a">
          <h1 style={{ textAlign: "center" }}>WEATHER APP</h1>
          <div id="first">
            <h1 style={{ textAlign: "center" }}>
              Enter Your Preffered Details
            </h1>
            <input
              placeholder="eg:delhi,mumbai"
              className="elements-input"
              id="inputvalue"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button className="elements-input" id="search" onClick={getValue}>
              Search
            </button>
            <div id="separate"></div>
            <button
              className="elements-input"
              id="location"
              onClick={getCoordinate}
            >
              Use Location
            </button>
          </div>
        </div>
      </div>
      {weatherData.length !== 0 && (
        <ul id="forecast" className="row">
          <li className=" weather-content col-md-7 mb-5 bg-info b">
            {currentWeather && (
              <WeatherComponent
                weatherItem={currentWeather}
                cityName={inputValue}
              />
            )}
          </li>
          {weatherData
            .slice(1)
            .map((weatherItem, index) => createContent(weatherItem, index))}
        </ul>
      )}
    </div>
  );
};

export default App;
