import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { createMaterialBottomTabNavigator as createBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton, Provider, Searchbar, useTheme } from 'react-native-paper';
import CurrentScreen from './components/CurrentScreen';
import DailyScreen from './components/DailyScreen';
import HourlyScreen from './components/HourlyScreen';
import * as Location from 'expo-location';
import exampleResponse from './exampleresponse.js';
import axios from 'axios';

const Tab = createBottomTabNavigator();

export default function App() {
  const [location, setLocation] = useState(null);
  const [mode, setMode] = useState('location');
  const [errorMessage, setErrorMessage] = useState(null);
  const [weather, setWeather] = useState({});
  const [search, setSearch] = useState('');

  const API_KEY = '8bf38ea1cc24c809acd8484cf88ad776';
  const updateWeather = async () => {
    /*axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}`)
      .then(response => setWeather(response.data))
      .catch(error => console.log(error));*/
      setWeather(exampleResponse);
  }
  const getAndSetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMessage('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  }
  useEffect(() => {
    console.log(mode)
    if (mode === 'location') {
      getAndSetLocation();
    } else if (mode === 'city') {
      fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${API_KEY}`).then(response => response.json()).then(data => {
        setLocation({
          coords: {
            latitude: data[0].lat,
            longitude: data[0].lon
          }
        });
      })
    }
  }, [mode])

  useEffect(() => {
    if (location) {
      updateWeather();
    }
  }, [location]);
  const theme = useTheme();
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <View style={{ display: 'flex', margin: 8, marginTop: 24, flexDirection: 'row', overflow: 'hidden', borderRadius: 999, backgroundColor: theme.colors.primaryContainer }}>
          <Searchbar
            placeholder="Search city..."
            onChangeText={text => setSearch(text)}
            value={search}
            elevation={0}
            onSubmitEditing={() => console.log(search)}
            style={{ flex: 1, backgroundColor: theme.colors.primaryContainer }}
          />
          <View style={{ display: 'flex', flex: 0, alignContent: 'center', justifyContent: 'center', alignItems: 'center', aspectRatio: 1, borderRadius: 999, backgroundColor: mode === 'location' ? theme.colors.primary : theme.colors.primaryContainer }}>
            <MaterialCommunityIcons
              name={mode === 'location' ? 'crosshairs-gps' : 'map-marker-circle'}
              color={mode === 'location' ? theme.colors.onPrimary : theme.colors.primary}
              size={24}
              onPress={() => setMode(mode == 'location' && search.length > 0 ? 'city' : 'location')}
            />
          </View>

        </View>
        <Tab.Navigator >
          <Tab.Screen
            name="Current"
            children={() =>
              <CurrentScreen weather={weather} theme={theme} />}
            options={{
              tabBarLabel: 'Current',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="weather-sunny" color={color} size={24} />
              ),
            }}
          />
          <Tab.Screen
            name="Hourly"
            children={() =>
              <HourlyScreen weather={weather} theme={theme} />}
            options={{
              tabBarLabel: 'Hourly',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="clock-outline" color={color} size={24} />
              ),
            }}
          />
          <Tab.Screen
            name="Daily"
            children={() =>
              <DailyScreen weather={weather} theme={theme} />}
            options={{
              tabBarLabel: 'Daily',
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





