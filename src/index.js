import Styles from './styles/styles.scss';
import moment from 'moment';

import boilerplateCode from './boilerplate';
let currentMeasurements = 'C';

async function getLocationInfo(location) {
    const info = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=53a560bacc8a4f86884150535230407&q=${location}&days=7&aqi=no&alerts=no`, {mode: 'cors'});
    const london = info.json();

    return london;
}

function fillFormWithInfo(location) {
    getLocationInfo(location)
    .then(result => {
        console.log(result);
        document.querySelector('.name').textContent = result.location.name;
        const date = new Date(result.current.last_updated)
        const dayMonthYr = date.toDateString();
        const time = `${date.getHours < 10 ? `0${date.getHours}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
        document.querySelector('.dayInfo').textContent = dayMonthYr;
        document.querySelector('.currentTime').textContent = time;
        document.querySelector('.weatherDescription').textContent = result.current.condition.text;
        if (currentMeasurements === "C") {
            document.querySelector('.degrees').textContent = `${result.current.temp_c} °C`
        }
        else {
            document.querySelector('.degrees').textContent = `${result.current.temp_f} °F`;
        }
    });
}

window.onload = function() {
    boilerplateCode();
    fillFormWithInfo("Bucharest");
}