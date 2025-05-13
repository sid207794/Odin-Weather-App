async function getWeatherApi() {
  try {
    const resolve = await fetch(
      'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/28.8215%2C79.0306?unitGroup=us&key=TJKLDPKEX986CRYB7PZ6PBN8K&contentType=json',
      { mode: 'cors' }
    );
    const resolveReference = resolve.json();
  } catch (error) {
    alert('Error', error);
  }
}
