$(document).ready(function() {
  const APIKey = 'a443952c5b9202fc8b80f0ed06d94cec';
  const citiesLogs = $('#cities-logs');
  const todayCity = $('#today-city');
  const todayIcon = $('#today-icon');
  const todayTemperature = $('#today-tem');
  const todayHumidity = $('#today-hum');
  const todayWind = $('#today-win');

  // checks for previously stored city logs in localStorage
  const storedHistory = localStorage.getItem('cityLogs');
  if (storedHistory) {
    // parses the stored JSON string into an array of city names
    const parsedHistory = JSON.parse(storedHistory);
    parsedHistory.forEach(cityName => addCityToHistory(cityName));
  }

  // checks for previously stored weather data in localStorage
  const storedData = localStorage.getItem('currentWeatherData');
  // executes if weather data was found
  if (storedData) {
    // parses the stored JSON string into a JavaScript object
    const parsedData = JSON.parse(storedData);

    // Updates the displayed weather information
    todayCity.text(parsedData.city);
    todayIcon.html('<img src="' + parsedData.icon + '" alt="weather icon">');
    todayTemperature.text(`${parsedData.temperature}°C`);
    todayHumidity.text(`${parsedData.humidity}%`);
    todayWind.text(`${parsedData.wind}m/s`);
  };

  // Retrieves and displays previously stored forecast data
  for (let i = 0; i < 5; i++) {
    // Retrieves a piece of data stored under a key like
    const forecastData = localStorage.getItem(`forecastData${i}`);
    // Executes if forecast data was found for that index
    if (forecastData) {
      //  Parses the stored JSON string into a JavaScript object
      const parsedForecastData = JSON.parse(forecastData);

      // Extracts specific forecast information
      const foreDate = parsedForecastData.forDate;
      const foreIconURL = parsedForecastData.forIconURL;
      const foreTemp = parsedForecastData.forTemp;
      const foreHumidity = parsedForecastData.forHumidity;
      const foreWind = parsedForecastData.forWind;

      // Updates the content of HTML elements with IDs like
      $("#forDate"+i).text(foreDate);
      $("#forIcon"+i).html("<img src="+foreIconURL+">");
      $("#forTemp"+i).text(`${foreTemp}°C`);
      $("#forHumidity"+i).text(foreHumidity+"%");
      $("#forWind"+i).text(foreWind+"m/s");
    } else {
      //
    };
  };

  // Defines a function named fetchWeatherData that can be awaited
  async function fetchWeatherData(cityName) {
    // Constructs the API request URL
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${APIKey}`;
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
    const icon = `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`;
    const temperature = Math.round(data.list[0].main.temp);
    const humidity = data.list[0].main.humidity;
    const wind = data.list[0].wind.speed;

    // Updates the displayed weather information
    todayCity.text(city);
    todayIcon.html('<img src="' + icon + '" alt="weather icon">');
    todayTemperature.text(`${temperature}°C`);
    todayHumidity.text(`${humidity}%`);
    todayWind.text(`${wind}m/s`);

    // Save a piece of data in the browser's local storage
    localStorage.setItem('currentWeatherData', JSON.stringify({
      city: city,
      date: date,
      icon: icon,
      temperature: temperature,
      humidity: humidity,
      wind: wind,
    }));

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

      // Stores forecast data in localStorage
      localStorage.setItem(`forecastData${i}`, JSON.stringify({
        forDate: forDate,
        iconCode: iconCode,
        forIconURL: forIconURL,
        forTemp: forTemp,
        forHumidity: forHumidity,
        forWind: forWind
      }));
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

  // Create a history of cities searched by the user
  function addCityToHistory(cityName) {
    // Checks for existing city in history
    const existingItem = citiesLogs.find(`div:contains(${cityName.toUpperCase()})`);
    // Adds city to history if not already present
    if (!existingItem.length) {
      const historyItem = $('<div class="cities-logs-item my-1 text-center" href="#">' + cityName.toUpperCase() + '</div>')
        .on('click', function() {
          fetchWeatherData(cityName)
            .then(displayCurrentWeather)
        });
        // Adds the history item to the beginning of the "citiesLogs" element.
        citiesLogs.prepend(historyItem);

        // Retrieves a list of previously searched cities from localStorage
        // Creating an empty array if none exists
        const cityLogs = JSON.parse(localStorage.getItem('cityLogs')) || [];
        // Adds the new city to the city logs array
        cityLogs.push(cityName);
        // Saves the updated city logs array back to localStorage for persistence
        localStorage.setItem('cityLogs', JSON.stringify(cityLogs));
    };
  };

});





