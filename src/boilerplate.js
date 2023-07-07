import iconSearch from './assets/searchIcon.svg';
import iconRain from './assets/rain.svg';
import iconWind from './assets/wind.svg';
import iconPrecip from './assets/precipitation.svg';
import iconFeelsLike from './assets/feelsLike.svg';
export default function boilerplateCode() {
    const searchIcon = document.querySelector('.searchIcon');
    searchIcon.src = iconSearch;
    const rainIcon = document.querySelector('.rainIcon');
    rainIcon.src = iconRain;
    const windIcon = document.querySelector('.windIcon');
    windIcon.src = iconWind;
    const precipIcon = document.querySelector('.precipitationIcon');
    precipIcon.src = iconPrecip;
    const feelsLikeIcon = document.querySelector('.feelsLikeIcon');
    feelsLikeIcon.src = iconFeelsLike;
}