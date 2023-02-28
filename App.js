import React, { useState, useEffect } from "react";
import { View, ToastAndroid, Linking } from "react-native";
import { Text, TextInput, Button, ActivityIndicator, Chip } from "react-native-paper"
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
import * as Localization from 'expo-localization';
import i18next, { t } from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
const storeData = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, value)
	} catch (e) {
		// saving error
		console.error(e);
	}
}

const getData = async (key) => {
	try {
		const value = await AsyncStorage.getItem(key)
		if (value !== null) {
			return value;
			// value previously stored
		}
	} catch (e) {
		// error reading value
		console.error(e);
	}
}
//import API_KEY from './API_KEY';
//const API_KEY = `d227dfc5a0b57b3cfb0d207ae15f207b`
const key = `8bf38ea1cc24c809acd8484cf88ad776`;
const pl = require('./components/utils/pl.json');
const en = require('./components/utils/en.json');
i18next.init({
	compatibilityJSON: 'v3',
	lng: Localization.locale,
	fallbackLng: 'en', // if you're using a language detector, do not define the lng option
	debug: false,
	resources: {
		en: en,
		pl: pl
	}
});

//i18next.locale = Localization.locale.slice(0, 2);
//console.log(Localization.locale);
//TODO: ERROR Screen
const Tab = createBottomTabNavigator();
function SetupScreen({ theme, setSetUp, t, setAPI_KEY, setUp, error, ...props }) {
	const [providedKey, setProvidedKey] = useState('');
	function setEverything(type) {
		if (type === 'normal') {
			fetch('https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=' + key + '&units=metric').then(response => response.json()).then(data => {
				if (data.cod === 401) {
					ToastAndroid.show(t('error.401'), ToastAndroid.SHORT);
				}
				else if (data.cod === 200) {
					storeData('key', providedKey);
					storeData('setup', 'true');
					setAPI_KEY(providedKey);
					setSetUp(true);
				}
			})

		}
		else if (type === 'alt') {
			ToastAndroid.show(':(', ToastAndroid.SHORT);
			setSetUp(true)
		}
	}
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 8, paddingTop: 24 }}>
			<MaterialCommunityIcons style={{
				marginTop: 32,
				flex: 0
			}} name="key" size={64} color={theme.colors.tertiary} />
			<Text style={{
				flex: 1,
				textAlign: "center",
				textAlignVertical: "center"
			}} variant="titleLarge">{t('setup.title')}</Text>
			<Text style={{
				flex: 1,
				textAlign: "center",
				textAlignVertical: "center"
			}} onPress={() => Linking.openURL('https://openweathermap.org/appid')}>
				{t('setup.message')}
			</Text>
			<View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
				<TextInput onChangeText={x => setProvidedKey(x)} mode="outlined" placeholder={t('setup.input')} />
				<Button mode="contained" onPress={() => setEverything('normal')} style={{
					marginTop: 16,
					marginBottom: 8,
					width: "100%",
				}}>{t('setup.button')}</Button>
				<Button mode="outlined" onPress={() => setEverything('alt')} style={{
					width: "100%",
				}}>{t('setup.alt_button')}</Button>
			</View>
		</View>)
}
export default function App() {

	const [location, setLocation] = useState(null);
	const [mode, setMode] = useState("location");
	const [errorMessage, setErrorMessage] = useState(null);
	const [weather, setWeather] = useState({});
	const [search, setSearch] = useState("");
	const [language, setLanguage] = useState("en");
	const [API_KEY, setAPI_KEY] = useState(key);
	const [setUp, setSetUp] = useState(true);


	const [home, setHome] = useState(null);
	const [error, setError] = useState(null);
	const [errorCode, setErrorCode] = useState('loading');
	useEffect(() => {
		// Load the API key from local storage or database
		//storeData('key', API_KEY);
		setSetUp(getData('setup').then(x => {
			setSetUp(x === 'true');
		}))
		//console.log('=-=--==-', getData('setup'));
		if (setUp == false) {
			setErrorCode(401)
		}
		getData('key').then(x => { key !== undefined && setAPI_KEY(x) });
		//useHomeLocation();
	}, []);
	const setAndSaveHomeLocation = async () => {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			ToastAndroid.show(t('error.permission'), ToastAndroid.SHORT);
			return;
		}
		const location = await Location.getCurrentPositionAsync({});
		setLocation(location);
		setHome(location);
		storeData('home', JSON.stringify(location));
	}
	const useHomeLocation = (use = true) => {
		use ? getData('home').then(savedHome => {
			//console.log("🏠",savedHome);
			var parsedSaved = JSON.parse(savedHome);
			if (parsedSaved !== null) {
				setHome(parsedSaved);
				setLocation(parsedSaved);
				setSearch(t('title.home'))
			}
			else if (home == null) {
				ToastAndroid(t('error.home_not_found'), ToastAndroid.SHORT);
			}
		})
		: getAndSetLocation();

		setTimeout(()=>{updateWeather()}, 1000)
	}
	const updateWeather = async () => {
		//console.log(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}`)
		fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&lang=${Localization.locale.slice(0, 2)}&appid=${API_KEY}`)
			.then((response) => {
				if (response.status === 401) {
					setSetUp(false);
					setErrorCode(401)
					setError(t('error.401'));
				}
				else if (response.status === 404) {
					setSetUp(true);

					ToastAndroid.show(t('error.404'), ToastAndroid.SHORT);
				}
				else if (response.status === 429) {
					ToastAndroid.show(t('error.429'), ToastAndroid.SHORT);
				}
				else if (response.status === 200) {
					setSetUp(true);
					response.json().then(x => setWeather(x))

				}

			})
		await Storage.setItem({
			key: `weather`,
			time: Date.now(),
			value: JSON.stringify(weather)
		})
	};
	const getAndSetLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			setError(t('error.permission'));
			return;
		}

		let location = await Location.getLastKnownPositionAsync();
		if (location.coords !== undefined) {
			await Storage.setItem({
				key: `location`,
				time: Date.now(),
				value: JSON.stringify(location)
			})
			setLocation(location);
		}


	};
	const getLocationFromCity = () => {
		fetch(
			`http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${API_KEY}`
		)
			.then((response) => response.json())
			.then((data) => {
				if (data.cod === 401) {
					setSetUp(false);
					setError(t('error.401'));
					ToastAndroid.show(t('error.401'), ToastAndroid.SHORT);
				}
				else if (data[0] !== undefined) {
					setLocation({
						coords: {
							latitude: data[0].lat,
							longitude: data[0].lon,
						},
					});
				}

			});
	}
	function submintEdit() {
		const text = search.trim();
		if (text.length > 0) {
			getLocationFromCity()
			updateWeather()
		}
		else {
			ToastAndroid.show(t('error.search_to_short'), ToastAndroid.SHORT);
		}
	}
	useEffect(() => {
		if (mode === "location") {
			getAndSetLocation();

		} else if (mode === "city") {
			ToastAndroid.show(t('title.searching_city')+search, ToastAndroid.SHORT);
			getLocationFromCity();
			Storage.setItem({
				key: `location`,
				time: Date.now(),
				value: JSON.stringify(location)
			})
		}
	}, [mode]);

	useEffect(() => {
		if (location !== null && location.coords !== undefined) {
			updateWeather();
		}
		else if (location == null) {
			Storage.getItem({ key: `location` }).then(item => {
				if (item !== null) {
					setLocation(item)
					ToastAndroid.show(t('location.old'), ToastAndroid.SHORT);
				}
				else {
					getAndSetLocation();
					ToastAndroid.show(t("location.not_found"), ToastAndroid.SHORT);
				}

			})

		}

	}, [location]);
	//const theme = useTheme();

	const theme = {
		...MD3LightTheme,
	};
	return (
		<Provider theme={theme}>
			{(setUp == null || setUp == true) ? <NavigationContainer theme={theme} >
				<View style={{ backgroundColor: 'transparent', zIndex: 0 }}>
					<View
						style={{
							display: "flex",
							margin: 8,
							marginBottom: 0,
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
							//onSubmitEditing={submintEdit()}
							onEndEditing={()=>{submintEdit()}}

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
								name={mode === "location" ? "crosshairs-gps" : (mode === "home" ? "home" : "map-marker-circle")}
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
						children={() => <CurrentScreen setAndSaveHomeLocation={setAndSaveHomeLocation} useHomeLocation={useHomeLocation} setHome={setHome} t={i18next.t} location={location} weather={weather} theme={theme} />}
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
						children={() => <HourlyScreen t={t} weather={weather} theme={theme} />}
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
						name={i18next.t('navigation.daily')}
						children={() => <DailyScreen t={t} weather={weather} theme={theme} />}
						options={{
							tabBarLabel: i18next.t('navigation.daily'),
							tabBarIcon: ({ color, size }) => (
								<MaterialCommunityIcons name="calendar" color={color} size={24} />
							),
						}}
					/>
				</Tab.Navigator>
			</NavigationContainer> :
				(errorCode !== 'loading' ? <SetupScreen error={error} theme={theme} t={t} setSetUp={setSetUp} setUp={setUp} setAPI_KEY={setAPI_KEY} /> : <View
					style={{
						display: "flex",
						flex: 1,
						alignContent: "center",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<ActivityIndicator size="large" color={theme.colors.primary} />
				</View>)
			}

			{//<Button onPress={()=>{useHomeLocation()}}>Reset</Button>
}
		</Provider>
	);
}
