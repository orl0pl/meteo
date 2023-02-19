import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator as createBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import iconMap from './iconMap';
import { Text, ActivityIndicator, IconButton, Searchbar, useTheme, Divider } from 'react-native-paper';
export default function CurrentScreen({ weather }) {
    const theme = useTheme();
    const [weatherIcon, setWeatherIcon] = useState('help');
    const [weatherIconColor, setWeatherIconColor] = useState('#2F2E41');
    useEffect(() => {
        if (weather !== {} && weather.current !== undefined) {
            console.log(weatherIcon)
            setWeatherIcon(iconMap[weather.current.weather[0].icon].icon !== undefined ? iconMap[weather.current.weather[0].icon].icon : 'help')
            setWeatherIconColor(iconMap[weather.current.weather[0].icon].color !== undefined ? iconMap[weather.current.weather[0].icon].color : '#FF0000')
        }
    })

    return (
        weather.current !== undefined ?
            <ScrollView style={{ padding: 8, backgroundColor: theme.colors.background, display: 'flex' }}>
                <View style={[styles.border, { display: 'flex', flex: 1, flexDirection: 'column' }]}>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                        <MaterialCommunityIcons name={weatherIcon} color={weatherIconColor} style={{ flex: 0 }} size={128} />

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text variant='headlineSmall'>{weather.current.weather[0].description !== undefined ? weather.current.weather[0].description : ''}</Text>
                                <Text variant='bodyLarge'>Second message</Text>
                            </View>
                            <View style={{ flex: 1, paddingHorizontal: 16, borderRadius: theme.roundness * 4, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primaryContainer }}>
                                <Text variant='headlineMedium' >{(weather.current.temp - 273.15 > 1 || weather.current.temp - 273.15 < -1) ? (weather.current.temp.toFixed(0) - 272.15).toFixed(0) : (weather.current.temp - 272.15).toFixed(2)} PTI</Text>
                            </View>
                        </View>
                    </View>
                    <Divider />
                    <View>
                        <Text>Rain</Text>
                        {/*TODO:Rain etc */}
                    </View>
                </View>
                <Text>{JSON.stringify(weather, null, 2)}</Text>
            </ScrollView>
            : <View style={{ display: 'flex', flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
    );
}
const styles = StyleSheet.create({
    border: {
        borderWidth: 1,
        borderColor: '#CAC4D0',
        borderRadius: 16,
        padding: 20,
    }
})