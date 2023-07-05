import Styles from './styles/styles.scss'

async function getLocationInfo(location="London") {
    const info = await fetch("http://api.weatherapi.com/v1/forecast.json?key=53a560bacc8a4f86884150535230407&q=London&days=7&aqi=no&alerts=no", {mode: 'cors'});
    const london = info.json();

    return london;
}

getLocationInfo()
.then(console.log)
