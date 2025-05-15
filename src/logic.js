export let cityData = [];

export async function getWeatherApi(city) {
  try {
    cityData.length = 0;
    const cityName = city.trim();
    const resolve = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=metric&key=TJKLDPKEX986CRYB7PZ6PBN8K&contentType=json`,
      { mode: 'cors' }
    );
    const resolveReference = await resolve.json();
    cityData.push(resolveReference);
    console.log(cityData);
  } catch (error) {
    alert('City not found!', error);
  }
}
