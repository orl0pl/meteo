import React, { useState, useEffect } from "react";
import { View, ToastAndroid } from "react-native";
import { createMaterialBottomTabNavigator as createBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Storage } from 'expo-storage';
import {
	Provider,
	Searchbar, MD3LightTheme
} from "react-native-paper";
import CurrentScreen from "./components/CurrentScreen";
import DailyScreen from "./components/DailyScreen";
import HourlyScreen from "./components/HourlyScreen";
import * as Location from "expo-location";
import axios from "axios";
import * as Localization from 'expo-localization';
import i18next from 'i18next';
const pl = require('./components/utils/pl.json');
const en = require('./components/utils/en.json');
i18next.init({
	compatibilityJSON: 'v3',
	lng: Localization.locale,
	fallbackLng: 'en', // if you're using a language detector, do not define the lng option
	debug: true,
	resources: {
	  en: en,
	  pl: pl
	}
  });

//i18next.locale = Localization.locale.slice(0, 2);
console.log(Localization.locale);
//TODO: Hourly and Daily screens
const Tab = createBottomTabNavigator();

export default function App() {
	
	const [location, setLocation] = useState(null);
	const [mode, setMode] = useState("location");
	const [errorMessage, setErrorMessage] = useState(null);
	const [weather, setWeather] = useState({});
	const [search, setSearch] = useState("");
	const [language, setLanguage] = useState("en");
	const API_KEY = "8bf38ea1cc24c809acd8484cf88ad776";
	function useI18n() {
		const language = useSelector(store => store.language);
	  
		return (text) => I18n.t(text, language);
	  }
	
	const updateWeather = async () => {
		//console.log(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}`)
		axios
			.get(
				`https://api.openweathermap.org/data/2.5/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&lang=${Localization.locale.slice(0,2)}&appid=${API_KEY}`
			)
			.then((response) => setWeather(response.data))
			.catch((error) => console.log(error));
		//setWeather(exampleResponse);
		await Storage.setItem({
			key: `weather`,
			time: Date.now(),
			value: JSON.stringify(weather)
		})
	};
	const getAndSetLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			setErrorMessage("Permission to access location was denied");
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		console.log(location);
		if(location.coords !== undefined) {
			await Storage.setItem({
				key: `location`,
				time: Date.now(),
				value: JSON.stringify(location)
			})
			setLocation(location);
		}
		
		
	};
	useEffect(() => {
		console.log(mode);
		if (mode === "location") {
			getAndSetLocation();

		} else if (mode === "city") {
			ToastAndroid.show("Searching city: "+search, ToastAndroid.SHORT);
			fetch(
				`http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${API_KEY}`
			)
				.then((response) => response.json())
				.then((data) => {
					setLocation({
						coords: {
							latitude: data[0].lat,
							longitude: data[0].lon,
						},
					});
				});
			Storage.setItem({
				key: `weather`,
				time: Date.now(),
				value: JSON.stringify(location)
			})
		}
	}, [mode]);

	useEffect(() => {
		if (location !== null && typeof location == 'object') {
			updateWeather();
		}
		else if(location == null){
			const item = Storage.getItem({ key: `location` })
			if (item.coords !== undefined) {
				setLocation(item)
				ToastAndroid.show("Using old location", ToastAndroid.SHORT);
			}
			else {
				getAndSetLocation();
				ToastAndroid.show("Location not found", ToastAndroid.SHORT);
			}
			console.log("storage",item)
		}
		console.log(location)
	}, [location]);
	//const theme = useTheme();
	
	const theme = {
		...MD3LightTheme,
	};
	return (
		<Provider theme={theme}>
			<NavigationContainer theme={theme} >
				<View style={{ backgroundColor: theme.colors.background }}>
					<View
						style={{
							display: "flex",
							margin: 8,
							marginTop: 24,
							flexDirection: "row",
							overflow: "hidden",
							borderRadius: 999,
							backgroundColor: theme.colors.primaryContainer,
						}}
					>
						<Searchbar
							placeholder={i18next.t("search")}
							onChangeText={(text) => setSearch(text)}
							value={search}
							elevation={0}
							onSubmitEditing={(text) => text.length > 0 && setMode("city")}
							style={{ flex: 1, backgroundColor: theme.colors.primaryContainer }}
						/>
						<View
							style={{
								display: "flex",
								flex: 0,
								alignContent: "center",
								justifyContent: "center",
								alignItems: "center",
								aspectRatio: 1,
								borderRadius: 999,
								backgroundColor:
									mode === "location"
										? theme.colors.primary
										: theme.colors.primaryContainer,
							}}
						>
							<MaterialCommunityIcons
								name={mode === "location" ? "crosshairs-gps" : "map-marker-circle"}
								color={
									mode === "location"
										? theme.colors.onPrimary
										: theme.colors.primary
								}
								size={24}
								onPress={() =>
									setMode(
										mode == "location" && search.length > 0
											? "city"
											: "location"
									)
								}
							/>
						</View>
					</View>
				</View>

				<Tab.Navigator>
					<Tab.Screen
						name={i18next.t('navigation.current')}
						children={() => <CurrentScreen t={i18next.t} location={location} weather={weather} theme={theme} />}
						options={{
							tabBarLabel: i18next.t('navigation.current'),
							tabBarIcon: ({ color, size }) => (
								<MaterialCommunityIcons
									name="weather-sunny"
									color={color}
									size={24}
								/>
							),
						}}
					/>
					<Tab.Screen
						name={i18next.t('navigation.hourly')}
						children={() => <HourlyScreen weather={weather} theme={theme} />}
						options={{
							tabBarLabel: i18next.t('navigation.hourly'),
							tabBarIcon: ({ color, size }) => (
								<MaterialCommunityIcons
									name="clock-outline"
									color={color}
									size={24}
								/>
							),
						}}
					/>
					<Tab.Screen
						name={i18next.t('pti')}
						children={() => <DailyScreen weather={weather} theme={theme} />}
						options={{
							tabBarLabel: i18next.t('navigation.daily'),
							tabBarIcon: ({ color, size }) => (
								<MaterialCommunityIcons name="calendar" color={color} size={24} />
							),
						}}
					/>
				</Tab.Navigator>
			</NavigationContainer>
		</Provider>
	);
}
