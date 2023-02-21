import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import iconMap from "./iconMap";
import { Text, ActivityIndicator, Divider, MD3LightTheme } from "react-native-paper";
import { calculatePTI } from "./utils/PTI";
import TopCurrent from "./components/TopCurrent";
import { FlexiCard } from "./components/Cards";
import moment from "moment";
import "moment/min/locales";
import * as Localization from "expo-localization";
import { RainBar, RainComponent, UmbrellaIconReactive } from "./components/Bars";

/**
 * @param {number} temp temperature in celsius
 * @param {number} humidity humidity in percentage
 * @param {number} windSpeed wind speed in m/s
 * @param {number} age age in years
 * @param {string} gender gender
 * @return {number} PTI (Personal Temperature Index)
 */
function calculatePersonalTempIndex(
	temp = 20,
	humidity = 70,
	windSpeed = 10,
	age = 30,
	gender = "male" || "female",
	weight = 80,
	height = 180,
	activityLevel = 2
) {
	// Calculate baseline temperature index based on personal factors
	let baselineIndex = 20;
	baselineIndex += age / 60;
	baselineIndex += gender === "male" ? 1 : 0;
	baselineIndex -= weight / 50;
	baselineIndex -= height <= 160 ? Math.floor((160 - height) / 10) : 0;
	baselineIndex += activityLevel;
	const heatIndex = (tempCelsius, humidity) =>
		tempCelsius >= 26
			? -8.78469475556 +
			  1.61139411 * tempCelsius +
			  2.33854883889 * humidity -
			  0.14611605 * tempCelsius * humidity -
			  0.012308094 * tempCelsius ** 2 -
			  0.0164248277778 * humidity ** 2 +
			  0.002211732 * tempCelsius ** 2 * humidity +
			  0.00072546 * tempCelsius * humidity ** 2 -
			  0.000003582 * tempCelsius ** 2 * humidity ** 2
			: tempCelsius;
	baselineIndex += temp >= 26 ? heatIndex / 10 : 0;
	// Adjust for external factors
	baselineIndex -= Math.floor(humidity / 80);
	baselineIndex -= Math.floor(windSpeed / 15);

	// Calculate final personal temperature index
	let personalIndex = baselineIndex + (temp - 20) / 5;
	return personalIndex;
}

export default function CurrentScreen({ weather, location, t }) {
	//const theme = useTheme();
	const theme = {
		...MD3LightTheme,
	};
	const [weatherIcon, setWeatherIcon] = useState("help");
	const [weatherIconColor, setWeatherIconColor] = useState(
		theme.dark ? iconMap["01d"].color_dark : iconMap["01d"].color
	);
	useEffect(() => {
		if (weather !== {} && weather.current !== undefined) {
			console.log(weatherIcon);
			setWeatherIcon(
				iconMap[weather.current.weather[0].icon].icon !== undefined
					? iconMap[weather.current.weather[0].icon].icon
					: "help"
			);
			setWeatherIconColor(
				theme.dark
					? iconMap[weather.current.weather[0].icon].color_dark !== undefined
						? iconMap[weather.current.weather[0].icon].color_dark
						: "00FFFF"
					: iconMap[weather.current.weather[0].icon].color !== undefined
					? iconMap[weather.current.weather[0].icon].color
					: "#FF0000"
			);
		}
	});

	return weather.current !== undefined ? (
		<ScrollView
			style={{
				padding: 8,
				backgroundColor: theme.colors.background,
				display: "flex",
			}}
		>
			<View style={[styles.border, { display: "flex", flex: 1, flexDirection: "column" }]}>
				<TopCurrent
					weather={weather}
					weatherIcon={weatherIcon}
					weatherIconColor={weatherIconColor}
					theme={theme}
					t={t}
				/>
				<Divider style={{ marginHorizontal: 16 }} />
				<View style={{ padding: 20 }}>
					<Text style={{ marginBottom: 16 }} variant="titleMedium">
						{t("title.rain")}
					</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							flex: 1,
						}}
					>
						<RainComponent weather={weather} theme={theme} />
						<UmbrellaIconReactive weather={weather} theme={theme} />
					</View>
				</View>
				<Divider style={{ marginHorizontal: 16 }} />
				<View style={{ padding: 20 }}>
					<Text style={{ marginBottom: 16 }} variant="titleMedium">
						{t("title.today_and_tommorow")}
					</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							flex: 1,
							marginBottom: theme.roundness * 2,
						}}
					>
						<View
							style={[
								{
									backgroundColor: theme.colors.primaryContainer,
									marginHorizontal: 4,
									flex: 1,
									justifyContent: "center",
									flexDirection: "row",
									alignItems: "center",
									borderRadius: theme.roundness * 2,
									padding: theme.roundness * 2,
									flexWrap: "wrap",
								},
							]}
						>
							<MaterialCommunityIcons name="thermometer-chevron-down" size={24} />
							<Text
								variant="bodyMedium"
								style={{
									marginLeft: theme.roundness,
									backgroundColor: theme.colors.secondary,
									padding: theme.roundness,
									borderRadius: theme.roundness,
									flex: 0,
									color: theme.colors.onSecondary,
								}}
							>
								{" " +
									calculatePTI({
										temperature: weather.daily[0].temp.min - 273.15,
										humidity: weather.daily[0].humidity,
										windSpeed: weather.daily[0].wind_speed,
									}).toFixed(1) +
									" " +
									t("pti") +
									" (" +
									(weather.daily[0].temp.min - 273.15).toFixed(0) +
									"°)"}
							</Text>
						</View>
						<View
							style={[
								{
									backgroundColor: theme.colors.primaryContainer,
									marginHorizontal: 4,
									flex: 1,
									justifyContent: "center",
									flexDirection: "row",
									alignItems: "center",
									borderRadius: theme.roundness * 2,
									padding: theme.roundness * 2,
									flexWrap: "wrap",
								},
							]}
						>
							<MaterialCommunityIcons name="thermometer-chevron-up" size={24} />
							<Text
								variant="bodyMedium"
								style={{
									marginLeft: theme.roundness,
									backgroundColor: theme.colors.secondary,
									padding: theme.roundness,
									borderRadius: theme.roundness,
									flex: 0,
									color: theme.colors.onSecondary,
								}}
							>
								{" " +
									calculatePTI({
										temperature: weather.daily[0].temp.max - 273.15,
										humidity: weather.daily[0].humidity,
										windSpeed: weather.daily[0].wind_speed,
									}).toFixed(1) +
									" " +
									t("pti") +
									" (" +
									(weather.daily[0].temp.max - 273.15).toFixed(0) +
									"°)"}
							</Text>
						</View>
					</View>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							flex: 1,
						}}
					>
						<FlexiCard
							theme={theme}
							label={t("parameters.morning")}
							unit=" °C"
							value={
								<>
									<Text
										variant="bodyMedium"
										style={{
											backgroundColor: theme.colors.secondary,
											padding: theme.roundness,
											borderRadius: theme.roundness,
											flex: 0,
											color: theme.colors.onSecondary,
										}}
									>
										{calculatePTI({
											temperature: weather.hourly.find(
												(x) => (new Date(x.dt * 1000).getHours() == 9).temp - 273.15
											),
											humidity: weather.hourly.find(
												(x) => (new Date(x.dt * 1000).getHours() == 9).humidity
											),
											windSpeed: weather.hourly.find(
												(x) => (new Date(x.dt * 1000).getHours() == 9).wind_speed
											),
										}).toFixed(1)}{" "}
										{t("pti")}
									</Text>
									<Text
										variant="bodySmall"
										style={{
											backgroundColor: theme.colors.primary,
											padding: theme.roundness,
											borderRadius: theme.roundness,
											color: theme.colors.onPrimary,
											marginTop: theme.roundness,
											flex: 0,
										}}
									>
										<MaterialCommunityIcons name="water" />
										{(
											weather.hourly.find((x) => new Date(x.dt * 1000).getHours() == 9).pop * 100
										).toFixed(0) + "%"}
									</Text>
								</>
							}
							rotation={0}
							icon="weather-sunset-up"
						/>
						<FlexiCard
							theme={theme}
							label={t("parameters.day")}
							unit=" °C"
							value={
								<>
									<Text
										variant="bodyMedium"
										style={{
											backgroundColor: theme.colors.secondary,
											padding: theme.roundness,
											borderRadius: theme.roundness,
											flex: 0,
											color: theme.colors.onSecondary,
										}}
									>
										{calculatePTI({
											temperature: weather.daily[0].temp.day - 273.15,
											humidity: weather.daily[0].humidity,
										}).toFixed(1)}{" "}
										{t("pti")}
									</Text>
									<Text
										variant="bodySmall"
										style={{
											backgroundColor: theme.colors.primary,
											padding: theme.roundness,
											borderRadius: theme.roundness,
											color: theme.colors.onPrimary,
											marginTop: theme.roundness,
											flex: 0,
										}}
									>
										<MaterialCommunityIcons name="water" />
										{(weather.daily[0].pop * 100).toFixed(0) + "%"}
									</Text>
								</>
							}
							rotation={0}
							icon="white-balance-sunny"
						/>
						<FlexiCard
							theme={theme}
							label={t("parameters.night")}
							unit=" °C"
							value={
								<>
									<Text
										variant="bodyMedium"
										style={{
											backgroundColor: theme.colors.secondary,
											padding: theme.roundness,
											borderRadius: theme.roundness,
											flex: 0,
											color: theme.colors.onSecondary,
										}}
									>
										{calculatePTI({
											temperature: weather.hourly.find(
												(x) => (new Date(x.dt * 1000).getHours() == 2).temp - 273.15
											),
											humidity: weather.hourly.find(
												(x) => (new Date(x.dt * 1000).getHours() == 2).humidity
											),
											windSpeed: weather.hourly.find(
												(x) => (new Date(x.dt * 1000).getHours() == 2).wind_speed
											),
										}).toFixed(1)}{" "}
										{t("pti")}
									</Text>
									<Text
										variant="bodySmall"
										style={{
											backgroundColor: theme.colors.primary,
											padding: theme.roundness,
											borderRadius: theme.roundness,
											color: theme.colors.onPrimary,
											marginTop: theme.roundness,
											flex: 0,
										}}
									>
										<MaterialCommunityIcons name="water" />
										{(
											weather.hourly.find((x) => new Date(x.dt * 1000).getHours() == 2).pop * 100
										).toFixed(0) + "%"}
									</Text>
								</>
							}
							rotation={0}
							icon="weather-night"
						/>
					</View>
				</View>
				<Divider style={{ marginHorizontal: 16 }} />
				{
					//TODO:OTHER
				}
				<View style={{ padding: 20 }}>
					<Text style={{ marginBottom: 16 }} variant="titleMedium">
						{t("title.current_parameters")}
					</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							flex: 1,
						}}
					>
						<FlexiCard
							theme={theme}
							label={t("parameters.wind")}
							unit=" m/s"
							value={weather.current.wind_speed.toFixed(1)}
							rotation={weather.current.wind_deg}
							icon="navigation-outline"
						/>
						<FlexiCard
							theme={theme}
							label={t("parameters.temperature")}
							unit=" °C"
							value={(-273.15 + weather.current.temp).toFixed(1)}
							rotation={0}
							icon="thermometer"
						/>

						<FlexiCard
							theme={theme}
							label={t("parameters.feels_like")}
							unit=" °C"
							value={(-273.15 + weather.current.feels_like).toFixed(1)}
							rotation={0}
							icon="thermometer-plus"
						/>
					</View>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							flex: 1,
							marginTop: 8,
						}}
					>
						<FlexiCard
							theme={theme}
							label={t("parameters.uvi")}
							unit=""
							value={Math.round(weather.current.uvi)}
							rotation={0}
							icon="sun-wireless"
							color={weather.current.uvi > 3 ? theme.colors.error : theme.colors.primary}
							bgColor={
								weather.current.uvi > 3
									? theme.colors.errorContainer
									: theme.colors.primaryContainer
							}
						/>
						<FlexiCard
							theme={theme}
							label={t("parameters.pressure")}
							unit=" hPa"
							value={weather.current.pressure}
							rotation={0}
							icon="gauge"
						/>

						<FlexiCard
							theme={theme}
							label={t("parameters.dew_point")}
							unit=" °C"
							value={(-273.15 + weather.current.dew_point).toFixed(1)}
							rotation={0}
							icon="water-outline"
						/>
					</View>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							flex: 1,
							marginTop: 8,
						}}
					>
						<FlexiCard
							theme={theme}
							label={t("parameters.wind_gust")}
							unit=" m/s"
							value={weather.current.wind_gust.toFixed(1)}
							rotation={0}
							icon="weather-windy"
						/>
						<FlexiCard
							theme={theme}
							label={t("parameters.humidity")}
							unit="%"
							value={weather.current.humidity}
							rotation={0}
							icon="water-percent"
						/>

						<FlexiCard
							theme={theme}
							label={t("parameters.visibility")}
							unit=""
							value={
								weather.current.visibility < 10000
									? (weather.current.visibility / 1000).toFixed(1) + " km"
									: t("parameters.goodView")
							}
							rotation={0}
							icon="image-filter-hdr"
						/>
					</View>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							flex: 1,
							marginTop: 8,
						}}
					>
						<FlexiCard
							theme={theme}
							label={t("parameters.sunrise")}
							unit=""
							value={`${new Date(weather.current.sunrise * 1000)
								.getHours()
								.toString()
								.padStart(2, "0")}:${new Date(weather.current.sunrise * 1000)
								.getMinutes()
								.toString()
								.padStart(2, "0")}`}
							rotation={0}
							icon="weather-sunset-up"
						/>

						<FlexiCard
							theme={theme}
							label={t("parameters.sunset")}
							unit=""
							value={`${new Date(weather.current.sunset * 1000)
								.getHours()
								.toString()
								.padStart(2, "0")}:${new Date(weather.current.sunset * 1000)
								.getMinutes()
								.toString()
								.padStart(2, "0")}`}
							rotation={0}
							icon="weather-sunset-down"
						/>
					</View>
				</View>
				<Text variant="bodyMedium" style={{ marginBottom: 16, marginHorizontal: 16 }}>
					{t("title.updated", { time: moment(weather.current.dt * 1000).fromNow() })}
				</Text>
				<Text variant="bodyMedium" style={{ marginBottom: 16, marginHorizontal: 16 }}>
					{t("title.location", { lat: location.coords.latitude, lon: location.coords.longitude })}
				</Text>
			</View>
			<Text>
				{
					//JSON.stringify(weather, null, 2)
				}
			</Text>
		</ScrollView>
	) : (
		<View
			style={{
				display: "flex",
				flex: 1,
				alignContent: "center",
				justifyContent: "center",
			}}
		>
			<ActivityIndicator size="large" color={theme.colors.primary} />
		</View>
	);
}
const styles = StyleSheet.create({
	border: {
		borderWidth: 1,
		borderColor: "#CAC4D0",
		borderRadius: 16,
	},
});
