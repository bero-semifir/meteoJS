const url = "http://api.openweathermap.org/data/2.5/forecast?appid=c06516a3bb199bb320181c589f72433c&lang=fr&units=metric&q=";

const weatherDiv = document.querySelector("div#meteo-container");
const form = document.querySelector('form');
const input = document.querySelector('input');
let weather = {};

/**
 * Va chercher la météo d'une ville par son nom
 * @param {*} city Nom de la ville
 */
const getWeatherByCity = (city) => {
    fetch(url + city)
        .then(resp => resp.json())
        .then(weather => {
            console.log(weather)
            weather.list.forEach(w => {
                weatherDiv.appendChild(createMeteoCard(w))
            });
        })
}

const createMeteoCard = (weatherInfo) => {
    console.log(weatherInfo)
    const meteoCard = document.createElement("div");
    meteoCard.className = "meteo-card";
    meteoCard.innerHTML = `
    <div class="card-header">
        <p class="card-title">${weatherInfo.main.temp}°C</p>
        <img src="http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}.png">
    </div>
    <hr>
    <div class="card-body">
        <ul>
            <li>Max: ${weatherInfo.main.temp_max}°C</li>
            <li>Min: ${weatherInfo.main.temp_min}°C</li>
        </ul>
        <ul>
            <li>Humidité: ${weatherInfo.main.humidity}%</li>
            <li>Pression: ${weatherInfo.main.pressure}hPa</li>
        </ul>
    </div>
    `;
    return meteoCard;
}


form.addEventListener('submit', (event) => {
    event.preventDefault();
    getWeatherByCity(input.value);
})
