import { cityData, getWeatherApi } from './logic';
import sun from './images/sun.svg';
import sunset from './images/sunset.svg';
import sunrise from './images/sunrise.svg';
import drop from './images/water.svg';

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
      const refresh = document.querySelector('.refresh');
      let inputCity = searchCity.value;

      if (inputCity) {
        refresh.classList.add('on');
        getWeatherApi(inputCity).then(() => {
          leftSide();
          searchCity.value = '';
          setTimeout(() => {
            refresh.classList.remove('on');
          }, 500);
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
      const currentTime = cityData[0].currentConditions.datetime.slice(0, 5);

      if (location.length >= 3) {
        const city = location[0];
        const state = location[1];
        const country = location[location.length - 1];
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

      if (temperatureC <= 25) {
        realTemp.style.color = 'aqua';
      } else if (25 < temperatureC && temperatureC <= 35) {
        realTemp.style.color = '#ffd700';
      } else if (35 < temperatureC && temperatureC <= 45) {
        realTemp.style.color = '#ffa500';
      } else if (45 < temperatureC) {
        realTemp.style.color = '#ff4500';
      }

      feelsLike.textContent = 'Feels Like ' + feelsLikeC + ' °C';
      weatherIcon.innerHTML = `<img src='${iconObject[weatherStatusImg]}' alt='${weatherStatus}'>`;
      latitude.textContent = latitudeData;
      longitude.textContent = longitudeData;
      time.innerHTML = `<span class='timeText'>TIME: </span><span class='currentTime'>${currentTime}</span>`;
      zone.innerHTML = `<span class='zoneText'>ZONE: </span><span class='timeZone'>${currentTimeZone}</span>`;

      locationConditions();
      sunriseStatus();
      hourlyData();
      prediction();
      warningIndicator();
      forecast();
    }
  };

  function prediction() {
    const description = document.querySelector('.description');
    const prediction = cityData[0].description;

    description.textContent = prediction;
  }
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
  data5Text.textContent = 'Precipitation';
  data1Text.textContent = 'Cloud Cover';
  data8Text.textContent = 'UV Index';
  data10Text.textContent = 'Wind Direction';
  data11Text.textContent = 'Wind Speed';
};

const sunriseStatus = function () {
  const sunStatusCover = document.querySelector('.sunStatusCover');
  const riseTime = document.querySelector('.riseTime');
  const setTime = document.querySelector('.setTime');
  const leftHr = document.querySelector('.lineLeft hr');
  const rightHr = document.querySelector('.lineRight hr');
  const sunDiv = document.querySelector('.travel .sun');
  const sunImg = document.querySelector('.travel .sun img');
  const riseText = document.querySelector('.riseText');
  const setText = document.querySelector('.setText');
  const riseImage = document.querySelector('.riseImage');
  const setImage = document.querySelector('.setImage');
  const data4Img = document.querySelector(`.data4 img`);
  const time = parseInt(cityData[0].currentConditions.datetime.slice(0, 2));
  const sunriseHour = parseInt(
    cityData[0].currentConditions.sunrise.slice(0, 2)
  );
  const sunsetHour = parseInt(cityData[0].currentConditions.sunset.slice(0, 2));
  const sunriseTime = cityData[0].currentConditions.sunrise.slice(0, 5);
  const sunsetTime = cityData[0].currentConditions.sunset.slice(0, 5);

  rightHr.classList = '';
  leftHr.classList = '';
  sunImg.classList = '';
  sunDiv.classList.remove('moon');
  sunStatusCover.classList.remove('sunDown');

  const sunStatusProperties = function () {
    function beforeSunset(timeOfDay) {
      rightHr.classList.add(timeOfDay);
      leftHr.classList.add(timeOfDay);
      riseTime.textContent = sunriseTime;
      setTime.textContent = sunsetTime;
      sunImg.classList.add('sunImage');
      sunImg.src = sun;
      riseText.textContent = 'Sunrise';
      setText.textContent = 'Sunset';
      riseImage.innerHTML = `<img src=${sunrise} alt="sunrise">`;
      setImage.innerHTML = `<img src=${sunset} alt="sunset">`;
    }

    function afterSunset(timeOfDay) {
      rightHr.classList.add(timeOfDay);
      leftHr.classList.add(timeOfDay);
      riseTime.textContent = sunsetTime;
      setTime.textContent = sunriseTime;
      sunDiv.classList.add('moon');
      sunImg.classList.add('moonImage');
      sunImg.src = data4Img.src;
      riseText.textContent = 'Sunset';
      setText.textContent = 'Sunrise';
      riseImage.innerHTML = `<img src=${sunset} alt="sunset"></img>`;
      setImage.innerHTML = `<img src=${sunrise} alt="sunrise">`;
      sunStatusCover.classList.add('sunDown');
    }

    return { beforeSunset, afterSunset };
  };

  const sunStatusPropertiesFunction = sunStatusProperties();

  if (time >= sunriseHour && time <= 12) {
    const timeDiff = 12 - time;
    rightHr.style.width = `calc((120 + ${timeDiff * (120 / (12 - sunriseHour))}) * 100vw / 1536)`;
    leftHr.style.width = `calc((120 - ${timeDiff * (120 / (12 - sunriseHour))}) * 100vw / 1536)`;
    sunStatusPropertiesFunction.beforeSunset('morning');
  } else if (time >= 13 && time <= sunsetHour) {
    const timeDiff = time - 12;
    rightHr.style.width = `calc((120 - ${timeDiff * (120 / (sunsetHour - 12))}) * 100vw / 1536)`;
    leftHr.style.width = `calc((120 + ${timeDiff * (120 / (sunsetHour - 12))}) * 100vw / 1536)`;
    sunStatusPropertiesFunction.beforeSunset('evening');
  } else if (time > sunsetHour && time <= 23) {
    const timeDiff = 24 - time;
    rightHr.style.width = `calc((120 + ${timeDiff * (120 / (24 - sunsetHour))}) * 100vw / 1536)`;
    leftHr.style.width = `calc((120 - ${timeDiff * (120 / (24 - sunsetHour))}) * 100vw / 1536)`;
    sunStatusPropertiesFunction.afterSunset('night');
  } else if (time === 0) {
    rightHr.style.width = `calc(120 * 100vw / 1536)`;
    leftHr.style.width = `calc(120 * 100vw / 1536)`;
    sunStatusPropertiesFunction.afterSunset('night');
  } else if (time > 0 && time <= sunriseHour) {
    const timeDiff = time - 0;
    rightHr.style.width = `calc((120 - ${timeDiff * (120 / sunriseHour)}) * 100vw / 1536)`;
    leftHr.style.width = `calc((120 + ${timeDiff * (120 / sunriseHour)}) * 100vw / 1536)`;
    sunStatusPropertiesFunction.afterSunset('dawn');
  }
};

const hourlyData = function () {
  const today = cityData[0].days['0'];
  const hourlydataWrapper = document.querySelector('.hourlydataWrapper');

  hourlydataWrapper.replaceChildren();

  for (let i = 0; i < 24; i++) {
    const div = document.createElement('div');
    const spanTime = document.createElement('span');
    const divImg = document.createElement('div');
    const spanTemperature = document.createElement('span');
    const precipitationPercent = document.createElement('div');
    const dropImg = document.createElement('img');
    const spanPercent = document.createElement('span');

    const weatherStatus = today.hours[`${i}`].icon;
    const weatherStatusImg = weatherStatus + '.svg';

    div.classList.add(`hour${i}`);
    div.classList.add(`timeToday`);
    spanTime.classList.add('hourToday');
    divImg.classList.add('hourlyWeather');
    spanTemperature.classList.add('hourlyTemperature');
    spanTime.textContent = today.hours[`${i}`].datetime.slice(0, 5);
    divImg.innerHTML = `<img src='${iconObject[weatherStatusImg]}' alt='${weatherStatus}'>`;
    spanTemperature.textContent = Math.floor(today.hours[`${i}`].temp) + ' °C';
    precipitationPercent.classList.add('precipitationPercent');
    dropImg.src = drop;
    dropImg.classList.add('dropImg');
    spanPercent.classList.add('spanPercent');
    spanPercent.textContent = Math.floor(today.hours[`${i}`].precipprob) + '%';

    hourlydataWrapper.appendChild(div);
    div.appendChild(spanTime);
    div.appendChild(divImg);
    div.appendChild(spanTemperature);
    div.appendChild(precipitationPercent);
    precipitationPercent.appendChild(dropImg);
    precipitationPercent.appendChild(spanPercent);
  }

  const timeTodayChildren = document.querySelectorAll('.timeToday .hourToday');
  const time = parseInt(cityData[0].currentConditions.datetime.slice(0, 2));
  timeTodayChildren.forEach((child) => {
    child.parentElement.classList.remove('inView');
    if (parseInt(child.textContent.slice(0, 2)) === time) {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              child.parentElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
              });

              child.parentElement.classList.add('inView');
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(hourlydataWrapper);
    }
  });

  hourlydataWrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hourlydataWrapper.scrollBy({
      left: e.deltaY,
      behavior: 'smooth',
    });
  });
};

const warningIndicator = function () {
  const alert = document.querySelector('.alertIcon');
  const heatWave = document.querySelector('.heatWave');
  const rainStorm = document.querySelector('.rainStorm');
  const hurricane = document.querySelector('.hurricane');
  const snowStorm = document.querySelector('.snowStorm');
  const temperatureC = Math.floor(cityData[0].currentConditions.temp);
  const feelsLikeC = Math.floor(cityData[0].currentConditions.feelslike);
  const humidity = Math.floor(cityData[0].currentConditions.humidity);
  const precipitation = cityData[0].currentConditions.precip;
  const windspeed = Math.floor(cityData[0].currentConditions.windspeed);
  const windgust = Math.floor(cityData[0].currentConditions.windgust);
  const severeRisk = Math.floor(cityData[0].currentConditions.severerisk);
  const cloudcover = Math.floor(cityData[0].currentConditions.cloudcover);
  const snow = cityData[0].currentConditions.snow;
  const visibility = cityData[0].currentConditions.visibility;
  const pressure = cityData[0].currentConditions.pressure;

  alert.classList.remove('on');
  heatWave.classList.remove('on');
  rainStorm.classList.remove('on');
  hurricane.classList.remove('on');
  snowStorm.classList.remove('on');

  let rainStormScore = 0;

  if (
    (temperatureC >= 35 && feelsLikeC >= 38 && humidity >= 60) ||
    (temperatureC >= 35 && feelsLikeC >= 38)
  ) {
    alert.classList.add('on');
    heatWave.classList.add('on');
  }

  if (precipitation >= 10) rainStormScore++;
  if (windspeed >= 30) rainStormScore++;
  if (severeRisk >= 50) rainStormScore++;
  if (cloudcover >= 80) rainStormScore++;

  if (rainStormScore >= 2) {
    alert.classList.add('on');
    rainStorm.classList.add('on');
  }

  if (
    (windspeed >= 120 &&
      windgust >= 150 &&
      pressure <= 980 &&
      severeRisk >= 70) ||
    (windspeed >= 120 && windgust >= 150 && pressure <= 980)
  ) {
    alert.classList.add('on');
    hurricane.classList.add('on');
  }

  if (snow >= 5 && windspeed >= 30 && visibility <= 1) {
    alert.classList.add('on');
    snowStorm.classList.add('on');
  }
};

const forecast = function () {
  const days = cityData[0].days;
  const upcomingForecastWrapper = document.querySelector(
    '.upcomingForecastWrapper'
  );

  upcomingForecastWrapper.replaceChildren();

  for (let i = 0; i < 15; i++) {
    const div = document.createElement('div');
    const date = document.createElement('div');
    const calendarDate = document.createElement('span');
    const calendarDay = document.createElement('span');
    const condition = document.createElement('div');
    const minMaxTemperature = document.createElement('div');
    const minTemperature = document.createElement('span');
    const forwardSlash = document.createElement('span');
    const maxTemperature = document.createElement('span');
    const precipitationPercent = document.createElement('div');
    const dropImg = document.createElement('img');
    const spanPercent = document.createElement('span');
    const moonphaseForecast = document.createElement('div');
    const moonphaseForecastImg = document.createElement('img');

    const weatherStatus = days[`${i}`].icon;
    const weatherStatusImg = weatherStatus + '.svg';
    const datetime = days[`${i}`].datetime;
    const [yyyy, mm, dd] = datetime.split('-');
    const monthName = new Date(parseInt(yyyy), parseInt(mm) - 1).toLocaleString(
      'default',
      { month: 'short' }
    );
    const weekDayName = new Date(
      parseInt(yyyy),
      parseInt(mm) - 1,
      parseInt(dd)
    ).toLocaleString('default', { weekday: 'short' });
    const getTempMax = Math.floor(days[`${i}`].tempmax);
    const getTempMin = Math.floor(days[`${i}`].tempmin);

    const moonPhase = parseFloat(days[`${i}`].moonphase);
    moonphaseForecast.classList.add('moonphaseForecast');
    if (moonPhase === 0 || moonPhase === 1) {
      moonphaseForecastImg.src = moonIconObject['moonN.svg'];
    } else if (0 < moonPhase && moonPhase < 0.25) {
      moonphaseForecastImg.src = moonIconObject['moonWXC.svg'];
    } else if (moonPhase === 0.25) {
      moonphaseForecastImg.src = moonIconObject['moonFQ.svg'];
    } else if (0.25 < moonPhase && moonPhase < 0.5) {
      moonphaseForecastImg.src = moonIconObject['moonWXG.svg'];
    } else if (moonPhase === 0.5) {
      moonphaseForecastImg.src = moonIconObject['moonF.svg'];
    } else if (0.5 < moonPhase && moonPhase < 0.75) {
      moonphaseForecastImg.src = moonIconObject['moonWNG.svg'];
    } else if (moonPhase === 0.75) {
      moonphaseForecastImg.src = moonIconObject['moonLQ.svg'];
    } else if (0.75 < moonPhase && moonPhase < 1) {
      moonphaseForecastImg.src = moonIconObject['moonWNC.svg'];
    }

    div.classList.add(`day${i}`);
    div.classList.add('daysForecast');
    date.classList.add('date');
    calendarDate.classList.add('calendarDate');
    calendarDate.textContent = `${dd} ${monthName}`;
    calendarDay.classList.add('calendarDay');
    calendarDay.textContent = `${weekDayName}`;
    condition.classList.add('conditionForecast');
    condition.innerHTML = `<img src='${iconObject[weatherStatusImg]}' alt='${weatherStatus}'>`;
    minMaxTemperature.classList.add('minMaxTemperature');
    minTemperature.classList.add('minTemperature');
    minTemperature.textContent = getTempMin + ' °C';
    forwardSlash.classList.add('forwardSlash');
    forwardSlash.textContent = ' / ';
    maxTemperature.classList.add('maxTemperature');
    maxTemperature.textContent = getTempMax + ' °C';
    precipitationPercent.classList.add('precipitationPercent');
    dropImg.src = drop;
    dropImg.classList.add('dropImg');
    spanPercent.classList.add('spanPercent');
    spanPercent.textContent = Math.floor(days[`${i}`].precipprob) + '%';

    upcomingForecastWrapper.appendChild(div);
    div.appendChild(date);
    date.appendChild(calendarDate);
    date.appendChild(calendarDay);
    div.appendChild(condition);
    div.appendChild(precipitationPercent);
    precipitationPercent.appendChild(dropImg);
    precipitationPercent.appendChild(spanPercent);
    div.appendChild(moonphaseForecast);
    moonphaseForecast.appendChild(moonphaseForecastImg);
    div.appendChild(minMaxTemperature);
    minMaxTemperature.appendChild(minTemperature);
    minMaxTemperature.appendChild(forwardSlash);
    minMaxTemperature.appendChild(maxTemperature);
  }

  const day0 = document.querySelector('.day0 .calendarDay');
  const day1 = document.querySelector('.day1 .calendarDay');
  day0.textContent = 'Today';
  day1.textContent = 'Tomorrow';
};

const refresh = (function () {
  const refreshIcon = document.querySelector('.refresh');
  const searchCityButton = document.querySelector('.searchCityButton');
  const searchCity = document.querySelector('#searchCity');

  refreshIcon.addEventListener('click', () => {
    if (cityData.length !== 0) {
      const address = cityData[0].address;
      searchCity.value = address;
      searchCityButton.click();
    }
  });
})();
