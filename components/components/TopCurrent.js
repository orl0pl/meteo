import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import { Text } from "react-native-paper";
import { calculatePTI, calculatePTIOWM } from "../utils/PTI";
function TopCurrent({ weather, theme, weatherIcon, weatherIconColor, t }) {
    const [rainTimeString, setRainTimeString] = useState("");
    useEffect(() => {
        var seconds = weather.minutely.find((x) => x.precipitation > 0.1)
            ? weather.minutely.find((x) => x.precipitation > 0.1).dt
            : weather.hourly.find((x) => x.precipitation > 0.1)
                ? weather.hourly.find((x) => x.precipitation > 0.1).dt
                : 0;

        if (seconds > 0) {
            var string = moment(seconds).toNow(true);
            console.log(string);
            setRainTimeString(string);
        } else {
            setRainTimeString("");
        }
    });
    return (
        <View
            style={{
                display: "flex",
                flex: 1,
                flexDirection: "row",
                padding: 20,
            }}
        >
            <MaterialCommunityIcons
                name={weatherIcon}
                color={weatherIconColor}
                style={{ flex: 0 }}
                size={128}
            />
            <View style={{ flex: 1, alignItems: "center", marginLeft: 4}}>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text variant="headlineSmall" style={{textAlign: "center"}}>
                        {weather.current.weather[0].description !== undefined
                            ? weather.current.weather[0].description
                            : ""}
                    </Text>
                    <Text variant="bodyLarge" style={{textAlign: "center"}}>
                        {
                            //TODO: Add weather messages
                            // For example:
                            // Sunny \n Enjoy this weather all day.
                            // Partly cloudy \n rain in 20 min
                        }
                        {weather.minutely.find((x) => x.precipitation > 0.1)
                            ? weather.current.rain["1h"] > 0
                                ? t("secondmessage.raining")
                                : t("secondmessage.itwillrain", {time: rainTimeString})
                            : weather.hourly.find((x) => x.precipitation > 0.1)
                                ? t("secondmessage.itwillrain", {time: rainTimeString})
                                : (weather.current.weather[0].code == 800 ||
                                    weather.current.weather[0].code == 801) &&
                                    (weather.daily[1].weather[0].code == 800 || weather.daily[1].weather[0].code == 801)
                                    ? t("secondmessage.goodWeather")
                                    : t("secondmessage.badWeather")}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 16,
                        borderRadius: theme.roundness * 4,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: theme.colors.primaryContainer,
                    }}
                >
                    <Text variant="headlineMedium">
                        {
                            //weather.current.temp - 273.15 > 1 || weather.current.temp - 273.15 < -1 ? (weather.current.temp.toFixed(0) - 273.15).toFixed(0) : (weather.current.temp - 273.15).toFixed(2)
                            calculatePTIOWM(weather.current).toFixed(1)
                        }{" "}
                        {t("pti")}
                    </Text>
                </View>
            </View>
        </View>
    );
}
export default TopCurrent;
