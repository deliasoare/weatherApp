import Styles from './styles/styles.scss';
import iconRain from './assets/rain.svg';
import leftArrow from './assets/leftArrow.svg';
import rightArrow from './assets/rightArrow.svg';

import boilerplateCode from './boilerplate';
let currentMeasurements = 'C';
let currentResults;
let firstSearch = true;
let secondaryInfoSelected = 'days';
const mainColor = '#f869a0';
const daysButton = document.querySelector('.days');
const hoursButton = document.querySelector('.hours');
let hourContainers = [];

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
const manipDataWResults = function() {
    const daysOfTheWeek = function() {
        document.querySelector('.weekSummary').innerHTML = '';
        document.querySelector('.switchBetweenHours').style.display = 'none';

        const daysContainer = document.querySelector('.weekSummary');
        daysContainer.innerHTML = '';
        for(let i = 1; i < currentResults.forecast.forecastday.length; i++) {
            const day = document.createElement('div');
            day.classList = 'upcomingDayDiv';
            const name = document.createElement('div');
            name.classList = 'dayName';
            const date = new Date(currentResults.forecast.forecastday[i].date);
            name.textContent = date.toDateString();
            const avgTempDiv = document.createElement('div');
            const avgTemp = document.createElement('div');
            avgTemp.classList = 'avgTemp';
            avgTemp.textContent = currentMeasurements === 'C' ? `${currentResults.forecast.forecastday[i].day.avgtemp_c} °C` : `${currentResults.forecast.forecastday[i].day.avgtemp_f} °F`;
            const avgTempIcon = document.createElement('img');
            avgTempIcon.classList = 'avgTempIcon weatherIcon';
            avgTempIcon.src = currentResults.forecast.forecastday[i].day.condition.icon;
            const rainChanceDiv = document.createElement('div');
            rainChanceDiv.classList = 'rainChanceDiv';
            const rainChanceIcon = document.createElement('img');
            rainChanceIcon.classList = 'rainChanceIcon weatherIcon';
            rainChanceIcon.src = iconRain;
            const rainChance = document.createElement('div');
            rainChance.classList = 'rainChance';
            rainChance.textContent = `${currentResults.forecast.forecastday[i].day.daily_chance_of_rain}%` ;

            avgTempDiv.append(avgTempIcon, avgTemp);
            rainChanceDiv.append(rainChanceIcon, rainChance);

            day.append(name, avgTempDiv, rainChanceDiv);
            daysContainer.append(day);

        }
    }

    const createSlides = () => {
        let CONTAINERS = [];
        for (let i = 0; i <= 2; i++) {
            CONTAINERS[i] = document.createElement('div');
            CONTAINERS[i].classList = `hourContainer container${i + 1}`;
        }
        
        let currentDate = new Date(currentResults.location.localtime);
        let firstHour = currentDate.getHours() + 1;
        let currentHour = firstHour;    
        let currentDay = 0;
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 8; i++) {
                const hour = document.createElement('div');
                hour.classList = 'hourDiv';

                if (currentHour + 1 >= 24 ) {
                    currentDay++;
                    currentHour = currentHour - 23;
                }
                else
                    currentHour = currentHour + 1;
                const name = document.createElement('div');
                name.classList = 'hourName';
                name.textContent = currentHour > 12 ? `${currentHour - 12} pm` : `${currentHour} am`;
                const avgTempDiv = document.createElement('div');
                const avgTempIcon = document.createElement('img');
                avgTempIcon.src = currentResults.forecast.forecastday[currentDay].hour[currentHour].condition.icon;
                avgTempIcon.classList = 'weatherIcon';
                const avgTemp = document.createElement('div');
                avgTemp.textContent = currentMeasurements === 'C' ? `${currentResults.forecast.forecastday[currentDay].hour[currentHour].feelslike_c} °C` : `${currentResults.forecast.forecastday[currentDay].hour[currentHour].feelslike_f} °F`
                const rainChanceDiv = document.createElement('div');
                const rainChanceIcon = document.createElement('img');
                rainChanceIcon.classList = 'weatherIcon';
                rainChanceIcon.src = iconRain;
                const rainChance = document.createElement('div');
                rainChance.textContent = `${currentResults.forecast.forecastday[currentDay].hour[currentHour].chance_of_rain}%`

                avgTempDiv.append(avgTempIcon, avgTemp);
                rainChanceDiv.append(rainChanceIcon, rainChance);

                hour.append(name, avgTempDiv, rainChanceDiv);
                
                CONTAINERS[j].append(hour);
            }
        }
        return CONTAINERS;
    }
    let currentSlide = 0;
        const sliderManipulation = () => {
            const circles = document.querySelectorAll('.circle');
            for (let i = 0; i < circles.length; i++) {
                circles[i].addEventListener('click', function() {
                    currentSlide = i;
                    hoursOfTheDay();
                    circles.forEach(circle => {
                        circle.style.background = 'transparent';
                    })
                    circles[i].style.background = mainColor;
                })
            }
            document.querySelector('.leftArrow').addEventListener('click', function() {
                currentSlide--;
                if (currentSlide < 0)
                    currentSlide = 2;
                circles.forEach(circle => {
                    circle.style.background = 'transparent';
                });
                circles[currentSlide].style.background = mainColor;
                hoursOfTheDay();
            })
            document.querySelector('.rightArrow').addEventListener('click', function() {
                currentSlide++;
                if (currentSlide > 2)
                    currentSlide = 0;

                circles.forEach(circle => {
                    circle.style.background = 'transparent';
                })
                circles[currentSlide].style.background = mainColor;
                hoursOfTheDay();
            })
        }

        const hoursOfTheDay = function() {
            const container = document.querySelector('.weekSummary');
            container.innerHTML = '';
            document.querySelector('.leftArrow').src = leftArrow;
            document.querySelector('.rightArrow').src = rightArrow;
            document.querySelector('.switchBetweenHours').style.display = 'flex';

            container.append(hourContainers[currentSlide]);
        }
    return {daysOfTheWeek, hoursOfTheDay, sliderManipulation, createSlides};
}();
function fillFormWithInfo(location) {
    getLocationInfo(location)
    .then(result => {
        if (result.error)
            return;
        document.querySelector('.errorWarning').style.display = 'none';
        currentResults = result;
        hourContainers = manipDataWResults.createSlides();
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
        }
        else {
            fahrenSystemFunc(result);
        }
        if (secondaryInfoSelected === 'days')
            manipDataWResults.daysOfTheWeek();
        else
            manipDataWResults.hoursOfTheDay();        
        document.querySelector('.rainChance').textContent = `${result.forecast.forecastday[0].hour[date.getHours()].chance_of_rain}%`
    })
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
    if (secondaryInfoSelected === 'days')
        manipDataWResults.daysOfTheWeek();
    else
        manipDataWResults.hoursOfTheDay();
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

daysButton.addEventListener('click', function() {
    hoursButton.style.background = 'transparent';
    document.querySelector('.switchBetweenHours').style.display = 'flex';
    daysButton.style.background = mainColor;
    manipDataWResults.daysOfTheWeek();
    secondaryInfoSelected = 'days';
})
hoursButton.addEventListener('click', function() {
    daysButton.style.background = 'transparent';
    hoursButton.style.background = mainColor;
    manipDataWResults.hoursOfTheDay();
    secondaryInfoSelected = 'hours';
    manipDataWResults.sliderManipulation();
})
window.onload = function() {
    boilerplateCode();
    fillFormWithInfo("Bucharest");
    firstSearch = false;
}