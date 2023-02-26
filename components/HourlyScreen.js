import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, FlatList, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import iconMap from "./iconMap";
import { Text, ActivityIndicator, Divider, MD3LightTheme } from "react-native-paper";
import { calculatePTI } from "./utils/PTI";
import TopCurrent from "./components/TopCurrent";
import { FlexiCard } from "./components/Cards";
import moment from "moment";
import "moment/min/locales";
import HourlyElement from "./components/HourlyElement";
import * as Localization from "expo-localization";
import { RainComponent, UmbrellaIconReactive } from "./components/Bars";
//TODO: Add weather alerts
moment.locale(Localization.locale.slice(0, 2));

export default function HourlyScreen({ weather, location, t }) {
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

	return weather.hourly !== undefined ? (
		//<TouchableWithoutFeedback>
			<FlatList style={{
				padding: 8,
				backgroundColor: theme.colors.background,
				display: "flex",
				marginBottom: 16,
			}} initialNumToRender={3}
		
			 data={weather.hourly} keyExtractor={(item) => item.dt.toString()} renderItem={({ item }) => {
				return <HourlyElement x={item} theme={theme} t={t} />
			}} />
		//</TouchableWithoutFeedback>

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
