function calculateHeatIndex(temperature, humidity) {
	// This is an example calculation of the heat index, using the formula provided by the National Weather Service.
	const c1 = -8.78469475556;
	const c2 = 1.61139411;
	const c3 = 2.33854883889;
	const c4 = -0.14611605;
	const c5 = -0.012308094;
	const c6 = -0.0164248277778;
	const c7 = 0.002211732;
	const c8 = 0.00072546;
	const c9 = -0.000003582;

	const T = temperature;
	const R = humidity;

	const HI =
		c1 +
		c2 * T +
		c3 * R +
		c4 * T * R +
		c5 * T * T +
		c6 * R * R +
		c7 * T * T * R +
		c8 * T * R * R +
		c9 * T * T * R * R;

	return HI;
}
function calculatePTI({
	temperature = 20,
	humidity = 50,
	height = 170,
	gender = "male",
	activityLevel = 1,
	personalOpinion = 0,
	windSpeed = 0,
	cloudiness = 0,
} = {}) {
	// Calculate baseline index
	let baselineIndex = 15;
	baselineIndex += gender === "male" ? 1 : 0;
	baselineIndex += (activityLevel - 1) * 2;
	baselineIndex += personalOpinion;

	// Adjust baseline index for height
	baselineIndex -= height * 0.01;

	// Calculate apparent temperature
	let apparentTemperature = temperature;
	if (windSpeed > 0) {
		const windChill =
			13.12 +
			0.6215 * temperature -
			11.37 * Math.pow(windSpeed, 0.16) +
			0.3965 * temperature * Math.pow(windSpeed, 0.16);
		apparentTemperature = windChill;
	}
	const pti =
		baselineIndex + (apparentTemperature - temperature) / 2 - humidity / 5 - cloudiness / 10;

	return pti;
}
function calculatePTIOWM(apiData = {temp: 20, feels_like: 21, humidity: 60, windSpeed: 1}, height = 170, weight = 70, opinion = 0) {
	const temp = apiData.temp - 273.15;
	const feelsLike = apiData.feels_like;
	const dewPoint = apiData.dew_point;
	const humidity = apiData.humidity;
	const windSpeed = apiData.wind_speed;
	let heatIndex = 0;
	if (temp >= 80) {
		const c1 = -42.379;
		const c2 = 2.04901523;
		const c3 = 10.14333127;
		const c4 = -0.22475541;
		const c5 = -0.00683783;
		const c6 = -0.05481717;
		const c7 = 0.00122874;
		const c8 = 0.00085282;
		const c9 = -0.00000199;
		heatIndex =
			c1 +
			c2 * temp +
			c3 * humidity +
			c4 * temp * humidity +
			c5 * temp * temp +
			c6 * humidity * humidity +
			c7 * temp * temp * humidity +
			c8 * temp * humidity * humidity +
			c9 * temp * temp * humidity * humidity;
	} else {
		heatIndex = temp;
	}
	const windChill =
		temp < 10 && windSpeed > 4.8
			? 13.12 +
			  0.6215 * temp -
			  11.37 * Math.pow(windSpeed, 0.16) +
			  0.3965 * temp * Math.pow(windSpeed, 0.16)
			: temp;

	// Calculate PTI using the heat index or wind chill, and other factors
	const pti =
		feelsLike >= heatIndex
			? (windChill + feelsLike) / 2 -
			  Math.abs(windChill - dewPoint) / 2 -
			  (1 - humidity / 100) * 14.4 +
			  opinion * 0.72 -
			  (height - 170) / 20 +
			  (weight - 70) / 40 -
			  windSpeed / 4
			: (temp + heatIndex) / 2 -
			  (1 - humidity / 100) * 14.4 +
			  opinion * 0.72 -
			  (height - 170) / 20 +
			  (weight - 70) / 40 -
			  windSpeed / 4;

	return pti;
}
export { calculatePTI, calculateHeatIndex, calculatePTIOWM };
