import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import iconMap from "../iconMap";
import { Text, ActivityIndicator, Divider, MD3LightTheme, Chip } from "react-native-paper";
import { calculatePTI, calculatePTIOWM } from "../utils/PTI";
import moment from "moment";
import "moment/min/locales";
import * as Localization from "expo-localization";
//TODO: Add weather alerts
moment.locale(Localization.locale.slice(0, 2));
const theme = {
    ...MD3LightTheme,
};
function Gap({ size, direction = "horizontal" }) {
    return <View style={{ [direction === "horizontal" ? "width" : "height"]: size }} />;
}

function CustomChip({
    rotaition = 0,
    icon,
    color = theme.colors.primary,
    backgroundColor = theme.colors.primaryContainer,
    textColor = theme.colors.onPrimaryContainer,
    text = "",
    ...props
}) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                borderColor: "#CAC4D0",
                borderWidth: 1,
                borderRadius: theme.roundness * 2,
                backgroundColor: backgroundColor,
                padding: theme.roundness,

            }}
        >
            <MaterialCommunityIcons
                size={20}
                name={icon}
                color={color}
                style={{
                    transform: [{ rotate: `${rotaition}deg` }],
                }}
            />
            <Gap size={2} />
            <Text variant="bodyMedium" style={{ color: textColor }}>{text}</Text>
        </View>
    );
}
export default function DailyElement({ x, t }) {
    const m = moment(x.dt * 1000);
    return (
        <View
            style={{
                display: "flex",
                borderWidth: 1,
                borderColor: "#CAC4D0",
                borderRadius: 16,
                backgroundColor: theme.colors.background,
                padding: 16,
                marginVertical: 8,
            }}
        >
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text variant="titleSmall">
                    {m.format("dddd")}
                </Text>
            </View>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                
                
                <MaterialCommunityIcons
                    name={iconMap[x.weather[0].icon].icon}
                    size={64}
                    color={iconMap[x.weather[0].icon].color}
                />
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            flex: 0,
                            marginRight: 8,
                        }}
                    >
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
                            {(x.pop * 100).toFixed(0) + "%"}
                        </Text>
                    </View>
                    <View>
                        <View
                            style={{
                                borderRadius: theme.roundness * 2,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: theme.colors.primaryContainer,
                                display: "flex",
                                flex: 0,
                                paddingVertical: theme.roundness,
                                paddingHorizontal: theme.roundness * 2,
                            }}
                        >
                            <Text variant="titleLarge">
                                {
                                    //weather.current.temp - 273.15 > 1 || weather.current.temp - 273.15 < -1 ? (weather.current.temp.toFixed(0) - 273.15).toFixed(0) : (weather.current.temp - 273.15).toFixed(2)
                                    calculatePTIOWM(x.temp.day) !== NaN ? calculatePTIOWM(x.temp.day).toFixed(1) : x.temp.day.toFixed(1)
                                }{" "}
                                {t("pti")}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <Text variant="bodyMedium" style={{ marginVertical: 4 }}>
                {x.weather[0].description}
            </Text>
            <ScrollView
                horizontal={true}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    rowGap: 16,
                    columnGap: 16,
                    gap: 16,
                    flex: 1,
                }}
            >
                
                {x.uvi > 6 && (
                    <>
                        <CustomChip
                            color={theme.colors.error}
                            textColor={theme.colors.onErrorContainer}
                            backgroundColor={theme.colors.errorContainer}
                            icon="weather-sunny-alert"
                            text={x.uvi}
                        />
                        <Gap size={4} />
                    </>
                )}
                <CustomChip icon="thermometer" text={(x.temp.day - 273.15).toFixed(1) + "°"} />
                <Gap size={4} />
                <CustomChip
                    rotaition={x.wind_deg}
                    icon="navigation"
                    text={x.wind_speed.toFixed(1) + " m/s"}
                />
                <Gap size={4} />
                <CustomChip icon="weather-windy" text={x.wind_gust.toFixed(1) + " m/s"} />
                <Gap size={4} />
                <CustomChip icon="thermometer-plus" text={(x.feels_like.day - 273.15).toFixed(1) + "°"} />
                <Gap size={4} />
                <CustomChip icon="gauge" text={x.pressure.toFixed(1) + " hPa"} />
                <Gap size={4} />
                <CustomChip icon="water-percent" text={x.humidity.toFixed(1) + "%"} />
                <Gap size={4} />
                <CustomChip icon="water-outline" text={(x.dew_point.day - 273.15).toFixed(1) + "°"} />
                <Gap size={4} />
                {!(x.uvi > 6) && (
                    <>
                        <CustomChip icon="sun-wireless" text={x.uvi.toFixed(1) + ""} />
                        <Gap size={4} />
                    </>
                )}
                <CustomChip
                    icon="cloud-outline"
                    text={
                        x.visibility < 10000
                            ? (x.visibility / 1000).toFixed(1) + " km"
                            : t("parameters.goodView")
                    }
                />
            </ScrollView>

            {
                //tutaj chipsy
            }
        </View>
    );
}
