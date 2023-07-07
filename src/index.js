import Styles from './styles/styles.scss';
import iconRain from './assets/rain.svg';


import boilerplateCode from './boilerplate';
let currentMeasurements = 'C';
let currentResults;
let firstSearch = true;

async function getLocationInfo(location) {
    if (firstSearch !== true) {
        document.querySelector('.errorWarning').style.display = 'flex';  
        document.querySelector('.loading').style.display = 'flex';
        document.querySelector('.error').style.display = 'none';

        setTimeout(function() {
            document.querySelector('.loading').style.display = 'none';
            document.querySelector('.error').style.display = 'flex';
        }, 3000)

        document.querySelector('.close').addEventListener('click', function() {
            document.querySelector('.errorWarning').style.display = 'none';
        })
        window.onclick = (e) => {
            if (e.target === document.querySelector('.errorWarning') && document.querySelector('.error').style.display === 'flex')
               document.querySelector('.errorWarning').style.display = 'none';
        }
    }
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
function daysOfTheWeek(result, degrees) {
    const weekDay = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    }
    const daysContainer = document.querySelector('.weekSummary');
    daysContainer.innerHTML = '';
    for(let i = 1; i < result.forecast.forecastday.length; i++) {
        const day = document.createElement('div');
        day.classList = 'upcomingDayDiv';
        const name = document.createElement('div');
        name.classList = 'dayName';
        const date = new Date(result.forecast.forecastday[i].date);
        name.textContent = date.toDateString();
        const avgTempDiv = document.createElement('div');
        const avgTemp = document.createElement('div');
        avgTemp.classList = 'avgTemp';
        avgTemp.textContent = degrees === 'C' ? `${result.forecast.forecastday[i].day.avgtemp_c} °C` : `${result.forecast.forecastday[i].day.avgtemp_f} °F`;
        const avgTempIcon = document.createElement('img');
        avgTempIcon.classList = 'avgTempIcon weatherIcon';
        avgTempIcon.src = result.forecast.forecastday[i].day.condition.icon;
        const rainChanceDiv = document.createElement('div');
        rainChanceDiv.classList = 'rainChanceDiv';
        const rainChanceIcon = document.createElement('img');
        rainChanceIcon.classList = 'rainChanceIcon weatherIcon';
        rainChanceIcon.src = iconRain;
        const rainChance = document.createElement('div');
        rainChance.classList = 'rainChance';
        rainChance.textContent = `${result.forecast.forecastday[i].day.daily_chance_of_rain}%` ;

        avgTempDiv.append(avgTempIcon, avgTemp);
        rainChanceDiv.append(rainChanceIcon, rainChance);

        day.append(name, avgTempDiv, rainChanceDiv);
        daysContainer.append(day);

    }
}
function fillFormWithInfo(location) {
    getLocationInfo(location)
    .then(result => {
        if (result.error)
            return;
        document.querySelector('.errorWarning').style.display = 'none';
        console.log(result);
        currentResults = result;
        document.querySelector('.name').textContent = `${result.location.name}, ${result.location.country}`;
        const date = new Date(result.location.localtime)
        const dayMonthYr = date.toDateString();
        const time = `${date.getHours < 10 ? `0${date.getHours}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
        document.querySelector('.dayInfo').textContent = dayMonthYr;
        document.querySelector('.currentTime').textContent = time;
        document.querySelector('.weatherDescription').textContent = result.current.condition.text;
        document.querySelector('.degreesIcon').src = result.current.condition.icon;
        if (currentMeasurements === "C") {
            celsiusSystemFunc(result);
            daysOfTheWeek(result, 'C');
        }
        else {
            fahrenSystemFunc(result);
            daysOfTheWeek(result, 'F');
        }

        document.querySelector('.rainChance').textContent = `${result.forecast.forecastday[0].hour[date.getHours()].chance_of_rain}%`
    })
}

document.querySelector('.toggleDegreesButton').addEventListener('click', function() {
    if (currentMeasurements === 'C') {
        currentMeasurements = 'F';
        fahrenSystemFunc(currentResults);
        daysOfTheWeek(currentResults, 'F');
    }
    else {
        currentMeasurements = 'C';
        celsiusSystemFunc(currentResults);
        daysOfTheWeek(currentResults, 'C');
    }
})

document.querySelector('.searchIcon').addEventListener('click', function() {
    if (document.querySelector('.input-search').style.width === '50px') 
        return;
    let input = document.querySelector('.input-search').value;
    fillFormWithInfo(input);
})

document.addEventListener('keydown', function(e) {
    if (document.activeElement !== document.querySelector('.input-search'))
        return;
    if (e.key === "Enter") {
        let input = document.querySelector('.input-search').value;
        fillFormWithInfo(input);
    }
})

window.onload = function() {
    boilerplateCode();
    fillFormWithInfo("Bucharest");
    firstSearch = false;
}