let cityData = [];

async function getWeatherApi(city) {
  try {
    cityData.length = 0;
    const cityName = city.trim();
    const resolve = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=us&key=TJKLDPKEX986CRYB7PZ6PBN8K&contentType=json`,
      { mode: 'cors' }
    );
    const resolveReference = await resolve.json();
    cityData.push(resolveReference);
    console.log(cityData);
  } catch (error) {
    alert('City not found!', error);
  }
}

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
    const locationName = document.querySelector('.locationName');
    const locationTemp = document.querySelector('.locationTemp');

    if (cityData.length !== 0) {
      const location = cityData[0].resolvedAddress.split(', ');
      const temperatureF = Math.floor(cityData[0].currentConditions.temp);
      const temperatureC = Math.floor((temperatureF - 32) * (5 / 9));
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

      locationTemp.textContent = temperatureC + '°C';
    }
  };
})();
