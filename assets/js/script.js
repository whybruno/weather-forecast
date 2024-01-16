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

  // Extracts relevant weather data
  function displayCurrentWeather(data) {
    const city = data.city.name;
    const date = data.list[0].dt;
    // const dateFormat = dayjs(date * 1000).format('DD/MM/YYYY');
    const icon = `http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`;
    const temperature = Math.round(data.list[0].main.temp);
    const humidity = data.list[0].main.humidity;
    const wind = data.list[0].wind.speed;

    // Updates the displayed weather information
    todayCity.text(city);
    todayIcon.html('<img src="' + icon + '" alt="weather icon">');
    todayTemperature.text(`${temperature}°C`);
    todayHumidity.text(`${humidity}%`);
    todayWind.text(`${wind}m/s`);

    // Iterates through forecast data
    for (i=0;i<5;i++){
      // Extracts information for each forecast
      var forDate = new Date((data.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
      var iconCode = data.list[((i+1)*8)-1].weather[0].icon;
      var forIconURL="https://openweathermap.org/img/wn/"+iconCode+".png";
      var forTemp = Math.round(data.list[((i+1)*8)-1].main.temp);
      var forHumidity= data.list[((i+1)*8)-1].main.humidity;
      var forWind= data.list[((i+1)*8)-1].wind.speed;
      
      // Updates HTML elements with forecast data
      $("#forDate"+i).text(forDate);
      $("#forIcon"+i).html("<img src="+forIconURL+">");
      $("#forTemp"+i).text(`${forTemp}°C`);
      $("#forHumidity"+i).text(forHumidity+"%");
      $("#forWind"+i).text(forWind+"m/s");
    };

  };

  // Listens for form submission
  $('#search-form').submit(async function(event) {
    event.preventDefault();
    // Gathers city name input
    const cityName = $('#search-input').val().toLowerCase();
    // Attempts to fetch weather data
    try {
      const weatherData = await fetchWeatherData(cityName);
      // Processes fetched data
      if (weatherData) {
        displayCurrentWeather(weatherData);

        addCityToHistory(cityName);
      } else {
        alert('City not found.');
      }
    // Handles errors  
    } catch (error) {
      console.error('Error fetching weather data:', error);
    };
  });

});





