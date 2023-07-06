import Styles from './styles/styles.scss';
import moment from 'moment';

import boilerplateCode from './boilerplate';
let currentMeasurements = 'C';
let currentResults;

async function getLocationInfo(location) {
    const info = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=53a560bacc8a4f86884150535230407&q=${location}&days=7&aqi=no&alerts=no`, {mode: 'cors'});
    const london = info.json();

    return london;
}

function celsiusSystemFunc(result) {
    document.querySelector('.degrees').textContent = `${result.current.temp_c} °C`
    document.querySelector('.feelsLike').textContent = `${result.current.feelslike_c} °C`;
    document.querySelector('.wind').textContent = `${result.current.wind_kph} km/h`;
    document.querySelector('.precipitation').textContent = `${result.current.precip_mm} mm`;
}
function fahrenSystemFunc(result) {
    document.querySelector('.degrees').textContent = `${result.current.temp_f} °F`;
    document.querySelector('.feelsLike').textContent = `${result.current.feelslike_f} °F`;
    document.querySelector('.wind').textContent = `${result.current.wind_mph} m/h`;
    document.querySelector('.precipitation').textContent = `${result.current.precip_in} in`;
}
function fillFormWithInfo(location) {
    getLocationInfo(location)
    .then(result => {
        console.log(result);
        currentResults = result;
        document.querySelector('.name').textContent = result.location.name;
        const date = new Date(result.location.localtime)
        const dayMonthYr = date.toDateString();
        const time = `${date.getHours < 10 ? `0${date.getHours}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
        document.querySelector('.dayInfo').textContent = dayMonthYr;
        document.querySelector('.currentTime').textContent = time;
        document.querySelector('.weatherDescription').textContent = result.current.condition.text;
        if (currentMeasurements === "C") 
            celsiusSystemFunc(result);
        else 
            fahrenSystemFunc(result);
        document.querySelector('.rainChance').textContent = `${result.forecast.forecastday[0].hour[date.getHours()].chance_of_rain}%`

        
    });
}

document.querySelector('.toggleDegreesButton').addEventListener('click', function() {
    if (currentMeasurements === 'C') {
        currentMeasurements = 'F';
        fahrenSystemFunc(currentResults);
    }
    else {
        currentMeasurements = 'C';
        celsiusSystemFunc(currentResults);
    }
})
window.onload = function() {
    boilerplateCode();
    fillFormWithInfo("Bucharest");
}