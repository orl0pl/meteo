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

    const HI = c1 + c2 * T + c3 * R + c4 * T * R + c5 * T * T + c6 * R * R + c7 * T * T * R + c8 * T * R * R + c9 * T * T * R * R;

    return HI;
}
function calculatePTI({ temperature = 20, humidity = 50, height = 170, gender = 'male', activityLevel = 1, personalOpinion = 0, windSpeed = 0, cloudiness = 0 } = {}) {
    // Calculate baseline index
    let baselineIndex = 15;
    baselineIndex += (gender === 'male') ? 1 : 0;
    baselineIndex += (activityLevel - 1) * 2;
    baselineIndex += personalOpinion;

    // Adjust baseline index for height
    baselineIndex -= height * 0.01;

    // Calculate apparent temperature
    let apparentTemperature = temperature;
    if (windSpeed > 0) {
        const windChill = 13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temperature * Math.pow(windSpeed, 0.16);
        apparentTemperature = windChill;
    }
    const pti = baselineIndex + (apparentTemperature - temperature) / 2 - humidity / 5 - cloudiness / 10;

    return pti;
}

export { calculatePTI, calculateHeatIndex };  