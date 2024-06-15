import React from "react";

const WeatherComponent = ({ weatherItem, cityName }) => {
  return (
    <div id="second" className="col-md-7 mb-5 bg-info">
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
    </div>
  );
};

export default WeatherComponent;
