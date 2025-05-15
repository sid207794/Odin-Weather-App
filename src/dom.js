import { cityData, getWeatherApi } from './logic';

const weatherIcons = require.context('./images/weatherIcons', false, /\.svg$/);
const iconObject = {};
weatherIcons.keys().forEach((key) => {
  const iconName = key.replace('./', '');
  iconObject[iconName] = weatherIcons(key);
});

const moonIcons = require.context('./images/moonIcons', false, /\.svg$/);
const moonIconObject = {};
moonIcons.keys().forEach((key) => {
  const moonIcon = key.replace('./', '');
  moonIconObject[moonIcon] = moonIcons(key);
});

const navigationBar = (function () {
  const rightSide = (function () {
    const searchCityButton = document.querySelector('.searchCityButton');

    searchCityButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const searchCity = document.querySelector('#searchCity');
      let inputCity = searchCity.value;

      if (inputCity) {
        getWeatherApi(inputCity).then(() => {
          leftSide();
          searchCity.value = '';
        });
      }
    });
  })();

  const leftSide = function () {
    const weatherIcon = document.querySelector('.weatherIcon');
    const locationName = document.querySelector('.locationName');
    const locationTemp = document.querySelector('.locationTemp');
    const realTemp = document.querySelector('.realTemp');
    const feelsLike = document.querySelector('.feelsLike');
    const latitude = document.querySelector('.latitudeData');
    const longitude = document.querySelector('.longitudeData');
    const time = document.querySelector('.time');
    const zone = document.querySelector('.zone');

    if (cityData.length !== 0) {
      const location = cityData[0].resolvedAddress.split(', ');
      const temperatureC = Math.floor(cityData[0].currentConditions.temp);
      const feelsLikeC = Math.floor(cityData[0].currentConditions.feelslike);
      const weatherStatus = cityData[0].currentConditions.icon;
      const weatherStatusImg = weatherStatus + '.svg';
      const latitudeData = cityData[0].latitude;
      const longitudeData = cityData[0].longitude;
      const currentTimeZone = cityData[0].timezone;
      const currentTime = cityData[0].currentConditions.datetime;

      if (location.length === 3) {
        const city = location[0];
        const state = location[1];
        const country = location[2];
        locationName.textContent = `${city}, ${country}`;
      } else if (location.length === 2) {
        const state = location[0];
        const country = location[1];
        locationName.textContent = `${state}, ${country}`;
      } else if (location.length === 1) {
        const country = location[0];
        locationName.textContent = `${country}`;
      }

      locationTemp.textContent = temperatureC + ' °C';
      realTemp.textContent = temperatureC + ' °C';
      feelsLike.textContent = 'Feels Like ' + feelsLikeC + ' °C';
      weatherIcon.innerHTML = `<img src='${iconObject[weatherStatusImg]}' alt='${weatherStatus}'>`;
      latitude.textContent = latitudeData;
      longitude.textContent = longitudeData;
      time.innerHTML = `<span class='timeText'>TIME: </span><span class='currentTime'>${currentTime}</span>`;
      zone.innerHTML = `<span class='zoneText'>ZONE: </span><span class='timeZone'>${currentTimeZone}</span>`;

      locationConditions();
    }
  };
})();

const locationConditions = function () {
  const moreConditions = document.querySelector('.moreConditions');
  const weatherStatus = cityData[0].currentConditions.icon;
  const weatherStatusImg = weatherStatus + '.svg';
  let conditionsArray = [
    'conditions',
    'cloudcover',
    'dew',
    'humidity',
    'moonphase',
    'precip',
    'pressure',
    'snow',
    'uvindex',
    'visibility',
    'winddir',
    'windspeed',
  ];

  let unitsArray = [
    '%',
    ' °C',
    '%',
    '',
    ' mm',
    ' hPa',
    ' cm',
    '',
    ' Km',
    ' °',
    ' Km/h',
  ];

  const conditionIcons = require.context(
    './images/conditionArrayIcons',
    false,
    /\.svg$/
  );
  const conditionIconsObject = {};
  conditionIcons.keys().forEach((key) => {
    const fileName = key.replace('./', '');
    conditionIconsObject[fileName] = conditionIcons(key);
  });

  moreConditions.replaceChildren();
  for (let i = 0; i < 12; i++) {
    const div = document.createElement('div');
    const divImg = document.createElement('div');
    const img = document.createElement('img');
    const text = document.createElement('span');
    const data = document.createElement('span');
    div.classList.add(`data${i}`);
    div.classList.add('conditionData');
    divImg.classList.add('dataImg');
    text.classList.add('imgText');
    data.classList.add('textData');

    moreConditions.appendChild(div);
    div.appendChild(divImg);
    divImg.appendChild(img);
    div.appendChild(text);
    div.appendChild(data);
  }

  const data0Img = document.querySelector(`.data0 img`);
  const data0Text = document.querySelector(`.data0 .imgText`);
  const data0TextData = document.querySelector(`.data0 .textData`);
  data0Img.src = iconObject[weatherStatusImg];
  data0Text.textContent = 'Condition';
  data0TextData.textContent = cityData[0].currentConditions.conditions;

  for (let i = 1; i < 12; i++) {
    const dataImg = document.querySelector(`.data${i} img`);
    const dataText = document.querySelector(`.data${i} .imgText`);
    const dataTextData = document.querySelector(`.data${i} .textData`);
    dataImg.src = conditionIconsObject[conditionsArray[i] + '.svg'];
    dataText.textContent =
      conditionsArray[i].charAt(0).toUpperCase() + conditionsArray[i].slice(1);

    const conditionValue = cityData[0].currentConditions[conditionsArray[i]];
    if (conditionValue === null) {
      dataTextData.textContent = 'n/a';
    } else {
      dataTextData.textContent =
        cityData[0].currentConditions[conditionsArray[i]] + unitsArray[i - 1];
    }
  }

  const moonPhase = parseFloat(cityData[0].currentConditions.moonphase);
  const data4Img = document.querySelector(`.data4 img`);
  if (moonPhase === 0 || moonPhase === 1) {
    data4Img.src = moonIconObject['moonN.svg'];
  } else if (0 < moonPhase && moonPhase < 0.25) {
    data4Img.src = moonIconObject['moonWXC.svg'];
  } else if (moonPhase === 0.25) {
    data4Img.src = moonIconObject['moonFQ.svg'];
  } else if (0.25 < moonPhase && moonPhase < 0.5) {
    data4Img.src = moonIconObject['moonWXG.svg'];
  } else if (moonPhase === 0.5) {
    data4Img.src = moonIconObject['moonF.svg'];
  } else if (0.5 < moonPhase && moonPhase < 0.75) {
    data4Img.src = moonIconObject['moonWNG.svg'];
  } else if (moonPhase === 0.75) {
    data4Img.src = moonIconObject['moonLQ.svg'];
  } else if (0.75 < moonPhase && moonPhase < 1) {
    data4Img.src = moonIconObject['moonWNC.svg'];
  }

  const data5Text = document.querySelector(`.data5 .imgText`);
  const data1Text = document.querySelector(`.data1 .imgText`);
  const data8Text = document.querySelector(`.data8 .imgText`);
  const data10Text = document.querySelector(`.data10 .imgText`);
  const data11Text = document.querySelector(`.data11 .imgText`);
  data5Text.textContent = 'Precipitate';
  data1Text.textContent = 'Cloud Cover';
  data8Text.textContent = 'UV Index';
  data10Text.textContent = 'Wind Direction';
  data11Text.textContent = 'Wind Speed';
};
