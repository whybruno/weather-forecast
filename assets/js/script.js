$(document).ready(function() {
  const APIKey = 'a443952c5b9202fc8b80f0ed06d94cec';
  const citiesLogs = $('#cities-logs');
  const todayCity = $('#today-city');
  const todayIcon = $('#today-icon');
  const todayTemperature = $('#today-tem');
  const todayHumidity = $('#today-hum');
  const todayWind = $('#today-win');

  // Defines a function named fetchWeatherData that can be awaited
  async function fetchWeatherData(cityName) {
    // Constructs the API request URL
    const queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${APIKey}`;
    // Attempts to fetch weather data
    try {
      // Fetches the data
      const response = await fetch(queryURL);
      const data = await response.json();
      // Returns the weather data
      return data;
    // Handles errors
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    };
  };
});





