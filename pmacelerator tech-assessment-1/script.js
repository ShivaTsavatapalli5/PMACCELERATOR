const apiKey = "84c2ca532842bd3306233af3caf59d63"; // Replace with your OpenWeatherMap API Key


// Replace these with your actual icon URLs (full URLs or relative paths)
const weatherIconMap = {
    "01d": "https://cdn-icons-png.flaticon.com/512/12446/12446270.png",
    "01n": "https://cdn-icons-png.flaticon.com/512/17/17279.png",
    "02d": "https://cdn-icons-png.flaticon.com/512/11166/11166805.png",
    "02n": "https://cdn-icons-png.flaticon.com/512/6591/6591848.png",
    "03d": "https://static.vecteezy.com/system/resources/previews/035/264/739/non_2x/cloudy-weather-icon-3d-neture-blue-design-for-element-free-png.png",
    "03n": "https://img.freepik.com/premium-vector/cloudy-night-icon_192037-7685.jpg",
    "04d": "https://cdn-icons-png.flaticon.com/512/5712/5712721.png",
    "04n": "https://cdn3.iconfinder.com/data/icons/weather-ios-11-black-white/50/Partly_Cloudy_Night_Cloudy_Sun_Cloud_Nebulosity_Apple_Weather-512.png",
    "09d": "https://i.pinimg.com/564x/78/97/7d/78977d761bbf1062cf46d570f424db60.jpg",
    "09n": "https://i.pinimg.com/564x/20/1c/f7/201cf775467d8fde4f33dbd84652c842.jpg",
    "10d": "https://static.vecteezy.com/system/resources/previews/022/425/954/non_2x/cloud-with-thunder-and-rain-drop-in-gray-and-yellow-filled-color-icon-heavy-rain-storm-thunderstorm-rainstorm-weather-forecast-vector.jpg",
    "10n": "https://i.pinimg.com/564x/6a/70/70/6a70705081c6f6b4b8d050208e02afd7.jpg",
    "11d": "https://cdn-icons-png.flaticon.com/512/1959/1959334.png",
    "11n": "https://thumbs.dreamstime.com/b/weather-night-thunderstorm-moon-icon-simple-black-style-cloud-lightning-isolated-white-background-climate-sign-vector-152013728.jpg",
    "13d": "https://static.vecteezy.com/system/resources/previews/012/741/530/non_2x/blue-cloud-with-snow-icon-snowy-weather-sign-vector.jpg",
    "13n": "https://c8.alamy.com/comp/2AH6W1M/sleet-weather-glyph-icon-wet-snow-mixed-snow-and-rain-weather-forecast-silhouette-symbol-negative-space-vector-isolated-illustration-2AH6W1M.jpg",
    "50d": "https://cdn1.iconfinder.com/data/icons/weather-forecast-meteorology-color-1/128/weather-foggy-sunny-512.png",
    "50n": "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_40-512.png"
};

// Fetch current weather by city or ZIP
function getWeather() {
    const location = document.getElementById("locationInput").value.trim();
    if (!location) {
        alert("Please enter a location");
        return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                alert("Location not found!");
                return;
            }

            displayCurrentWeather(data);
            getForecast(location);
        })
        .catch(() => alert("Error fetching weather data"));
}

// Fetch current weather by GPS location
function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

                fetch(weatherUrl)
                    .then(res => res.json())
                    .then(data => {
                        if (data.cod !== 200) {
                            alert("Error fetching weather for your location");
                            return;
                        }
                        displayCurrentWeather(data);
                        getForecast(data.name);
                    })
                    .catch(() => alert("Error fetching GPS weather data"));
            },
            () => {
                alert("Geolocation permission denied.");
            }
        );
    } else {
        alert("Geolocation not supported.");
    }
}

// Display current weather details with custom icons
function displayCurrentWeather(data) {
    const iconCode = data.weather[0].icon;
    const iconUrl = weatherIconMap[iconCode] || "";

    document.getElementById("weatherResult").innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Feels Like: ${data.main.feels_like}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Weather: ${data.weather[0].description}</p>
        ${iconUrl ? `<img src="${iconUrl}" alt="${data.weather[0].description}" style="height:50px;width:50px">` : ""}

    `;
}

// Fetch and display 5-day forecast with custom icons
function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== "200") {
                document.getElementById("forecastResult").innerHTML = "<p>Forecast not available</p>";
                return;
            }

            let forecastHtml = "<h3>5-Day Forecast</h3><div style='display:flex; flex-wrap:wrap; justify-content:center;'>";

            for (let i = 0; i < data.list.length; i += 8) {
                const day = data.list[i];
                const date = new Date(day.dt_txt).toLocaleDateString();
                const iconCode = day.weather[0].icon;
                const iconUrl = weatherIconMap[iconCode] || "";

                forecastHtml += `
                    <div class="forecast-day">
                        <div>${date}</div>
                        ${iconUrl ? `<img src="${iconUrl}" alt="${day.weather[0].description}" style="height:50px;width:50px" />` : ""}
                        <div>${Math.round(day.main.temp)}°C</div>
                        <div>${day.weather[0].main}</div>
                    </div>
                `;
            }

            forecastHtml += "</div>";
            document.getElementById("forecastResult").innerHTML = forecastHtml;
        })
        .catch(() => alert("Error fetching forecast data"));
}

// Info button popup
function showInfo() {
    alert("AI_Engineer");
}
