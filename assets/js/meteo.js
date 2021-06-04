const url = "http://api.openweathermap.org/data/2.5/forecast?appid=c06516a3bb199bb320181c589f72433c&lang=fr&units=metric";

const weatherDiv = document.querySelector("div#meteo-container");
const subtitle = document.querySelector("h2#subtitle");
const form = document.querySelector('form');
const input = document.querySelector('input');
const geolocBtn = document.querySelector("#geolocBtn");

/**
 * Va chercher la météo d'une ville par son nom
 * @param {String} city Nom de la ville
 */
const getWeatherByCity = (city) => {
    fetch(url + "&q=" + city)
        .then(resp => resp.json())
        .then(weather => {
            if (weather.cod === "404") {
                subtitle.innerText = `La ville ${city} n'a pas été trouvée`;
            } else if (weather.cod === "200") {
                subtitle.innerText = `${weather.city.name}`;
                weatherDiv.innerHTML = "";
                weather.list.forEach(w => {
                    weatherDiv.appendChild(createMeteoCard(w))
                });
            }
        })
}

/**
 * Affiche la météo via position du navigateur
 * @param {GeolocationPosition} position 
 */
const getWeatherByPosition = (position) => {
    fetch(`${url}&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
        .then(resp => resp.json())
        .then(weather => {
            subtitle.innerText = `${weather.city.name}`;
            weatherDiv.innerHTML = "";
            weather.list.forEach(w => {
                weatherDiv.appendChild(createMeteoCard(w))
            });
        })
}

/**
 * Créer l'élément DOM contenant la météo
 * @param {*} weatherInfo Météo
 * @returns {Element} La carte pour la météo
 */
const createMeteoCard = (weatherInfo) => {
    const meteoCard = document.createElement("div");
    meteoCard.className = "meteo-card glass";
    /*
    Permet de formater la date.
    Dans la reponse la date est en seconde (nombre de seconde écoulées depuis le 1er janvier 1970 à 00h00 UTC).
    Voir http://www.timestamp.fr/
    En JS on s'attend a des millisecondes dans l'objet Date, donc je multiplie par 1000.
    */
    let date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(weatherInfo.dt * 1000))
    // Plutôt que de faire plein de document.createElement() je remplis la zone avec du HTML
    meteoCard.innerHTML = `
    <div class="card-header">
        <div>
            <h3>${date}</h3>
            <h4>Température: ${weatherInfo.main.temp}°C</h4>
        </div>
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

// écoute des événements

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value != "") {
        getWeatherByCity(input.value);
    }
})

geolocBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
        input.value = "";
        getWeatherByPosition(position);
    })
})
