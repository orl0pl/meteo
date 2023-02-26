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
                margin: theme.roundness / 2,
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

            <Text variant="bodyMedium" style={{ color: textColor }}>{text}</Text>
        </View>
    );
}
export default function HourlyElement({ x, t }) {
    const m = moment(x.dt * 1000);
    const [details, showDetails] = useState(false);
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
                <Text variant="titleSmall">{m.format("hh:mm")}</Text>
                <Text variant="titleSmall">
                    {m.isSame(moment(Date.now()), "day") ? t("hourly.today") : t("hourly.tomorrow")}
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
                                    calculatePTIOWM(x).toFixed(1)
                                }{" "}
                                {t("pti")}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                paddingVertical: 4,
            }}>
                <Text variant="bodyMedium" style={{  }}>
                    {x.weather[0].description}
                </Text>
                <MaterialCommunityIcons onPress={() => { showDetails(!details) }} color={theme.colors.tertiary} name={details ? "chevron-up" : "chevron-down"} size={24}/>
            </View>

            {details && <View
                horizontal={true}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    rowGap: 16,
                    columnGap: 16,
                    gap: 16,
                    flex: 1,
                    flexWrap: "wrap",
                }}
            >
                {x.rain !== undefined ? (
                    <>
                        <CustomChip
                            color={theme.colors.onPrimary}
                            textColor={theme.colors.onPrimary}
                            backgroundColor={theme.colors.primary}
                            icon="water"
                            text={x.rain["1h"].toFixed(1) + "mm"}
                        />

                    </>
                ) : null}
                {x.snow !== undefined ? (
                    <>
                        <CustomChip
                            color={theme.colors.onPrimary}
                            textColor={theme.colors.onPrimary}
                            backgroundColor={theme.colors.primary}
                            icon="snowflake"
                            text={x.snow["1h"].toFixed(1) + "mm"}
                        />

                    </>
                ) : null}
                {x.uvi > 6 && (
                    <>
                        <CustomChip
                            color={theme.colors.error}
                            textColor={theme.colors.onErrorContainer}
                            backgroundColor={theme.colors.errorContainer}
                            icon="weather-sunny-alert"
                            text={x.uvi}
                        />

                    </>
                )}
                <CustomChip icon="thermometer" text={(x.temp - 273.15).toFixed(1) + "°"} />

                <CustomChip
                    rotaition={x.wind_deg}
                    icon="navigation"
                    text={x.wind_speed.toFixed(1) + " m/s"}
                />

                <CustomChip icon="weather-windy" text={x.wind_gust.toFixed(1) + " m/s"} />

                <CustomChip icon="thermometer-plus" text={(x.feels_like - 273.15).toFixed(1) + "°"} />

                <CustomChip icon="gauge" text={x.pressure.toFixed(1) + " hPa"} />

                <CustomChip icon="water-percent" text={x.humidity.toFixed(1) + "%"} />

                <CustomChip icon="water-outline" text={(x.dew_point - 273.15).toFixed(1) + "°"} />

                {!(x.uvi > 6) && (
                    <>
                        <CustomChip icon="sun-wireless" text={x.uvi.toFixed(1) + ""} />

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
            </View>
            }
            {
                //tutaj chipsy
            }
        </View>
    );
}
