const apiKey = "PLACE_API_KEY"; // Replace with your OpenWeatherMap API Key


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



// Search by city
function getWeather() {
    const loc = document.getElementById("locationInput").value.trim();
    if (!loc) { alert("Enter a location"); return; }
    fetchWeather(loc);
}

// By GPS
function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&appid=${apiKey}`)
                .then(res => res.json())
                .then(data => { displayCurrentWeather(data); getForecast(data.name); });
        });
    }
}

// Current weather fetch
function fetchWeather(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) { alert("Location not found"); return; }
            displayCurrentWeather(data);
            getForecast(location);
        });
}

// Display + save to DB
function displayCurrentWeather(data) {
    const iconUrl = weatherIconMap[data.weather[0].icon] || "";
    document.getElementById("weatherResult").innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Weather: ${data.weather[0].description}</p>
        ${iconUrl ? `<img src="${iconUrl}" alt="">` : ""}
    `;

    // Save to backend
    fetch('http://localhost:3000/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            location: data.name,
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
            weather_data: data
        })
    }).then(r => r.json()).then(resp => console.log("Saved to DB:", resp));
}

// Forecast
function getForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            let html = "<h3>5-Day Forecast</h3><div style='display:flex;flex-wrap:wrap;justify-content:center;'>";
            for (let i = 0; i < data.list.length; i += 8) {
                const d = data.list[i];
                const iconUrl = weatherIconMap[d.weather[0].icon] || "";
                html += `<div class="forecast-day">${new Date(d.dt_txt).toLocaleDateString()}${iconUrl ? `<img src="${iconUrl}" alt="">` : ""}<div>${Math.round(d.main.temp)}°C</div><div>${d.weather[0].main}</div></div>`;
            }
            html += "</div>";
            document.getElementById("forecastResult").innerHTML = html;
        });
}

// 🆕 New Function to view DB-stored records
function viewStoredRecords() {
    fetch('http://localhost:3000/records')
        .then(res => res.json())
        .then(records => {
            if (!records.length) {
                document.getElementById("storedRecords").innerHTML = "<h3>No stored records</h3>";
                return;
            }
            let html = "<h3>Stored Weather Records</h3><table border='1' style='margin:auto;border-collapse:collapse;'><tr><th>ID</th><th>Location</th><th>Date Range</th><th>Temperature</th><th>Conditions</th></tr>";
            records.forEach(r => {
                let weatherInfo = "";
                try {
                    const wd = JSON.parse(r.weather_data);
                    weatherInfo = `${wd.main.temp}°C - ${wd.weather[0].description}`;
                } catch (e) {
                    weatherInfo = "N/A";
                }
                html += `<tr>
                    <td>${r.id}</td>
                    <td>${r.location}</td>
                    <td>${r.start_date} → ${r.end_date}</td>
                    <td>${weatherInfo}</td>
                    <td>${r.created_at}</td>
                </tr>`;
            });
            html += "</table>";
            document.getElementById("storedRecords").innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            document.getElementById("storedRecords").innerHTML = "<p>Error loading records</p>";
        });
}

function showInfo() {
    alert("PMA Weather App - AI Engineer Intern Assessment");
}

