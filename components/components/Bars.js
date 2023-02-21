import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper"
function Bar(props) {
    return (
        <View
            style={[
                {
                    height: props.height,
                    backgroundColor: props.backgroundColor,
                    width: props.width,
                },
                props.styles,
            ]}
        >
            <View
                style={{
                    height: props.percent * 0.01 * props.height,
                    backgroundColor: props.color,
                    marginTop: (100 - props.percent) * 0.01 * props.height,
                }}
            ></View>
        </View>
    );
}
function RainBar({ theme, weather }) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                flex: 0,
            }}>
                
            {weather.minutely.map((item, index) => {
                return (
                    <Bar
                        styles={{
                            marginHorizontal: 1,
                            borderRadius: 2,
                        }}
                        height={72}
                        width={2}
                        percent={Math.round(item.precipitation*100)}
                        backgroundColor={theme.colors.primaryContainer}
                        color={theme.colors.primary}
                        key={index}
                    />
                );
            })}
        </View>
    )
}
function UmbrellaIconReactive({ theme, weather }) {
    return (
        <View
            style={[
                {
                    backgroundColor:
                        weather.minutely[0].precipitation > 0
                            ? theme.colors.primary
                            : theme.colors.primaryContainer,
                    marginLeft: 4,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: theme.roundness * 2,
                    padding: theme.roundness * 2,
                },
            ]}
        >
            <MaterialCommunityIcons
                name={
                    weather.minutely[0].precipitation > 0
                        ? weather.minutely[0].precipitation > 10
                            ? weather.minutely[0].precipitation > 0
                                ? "umbrella"
                                : "umbrella-outline"
                            : "umbrella-closed"
                        : "umbrella-closed-outline"
                }
                size={32}
                color={
                    weather.minutely[0].precipitation > 0
                        ? theme.colors.onPrimary
                        : theme.colors.onPrimaryContainer
                }
            />
            <Text
                style={{
                    color:
                        weather.minutely[0].precipitation > 0
                            ? theme.colors.onPrimary
                            : theme.colors.onPrimaryContainer,
                }}
            >
                {(weather.minutely[0].precipitation * 100).toFixed(0)}%
            </Text>
        </View>
    )
}
function RainComponent({ weather, theme }) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "column",
                flex: 0,
            }}>
            <RainBar theme={theme} weather={weather} />
            <View
                style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: 1,
                    maxWidth: 1000,
                }}
            >
                <Text variant="labelSmall">{`${new Date(weather.minutely[0].dt * 1000)
                    .toLocaleTimeString()
                    .split(":")
                    .splice(0, 2)
                    .join(":")}`}</Text>
                <Text variant="labelSmall">{`${new Date(weather.minutely[29].dt * 1000)
                    .toLocaleTimeString()
                    .split(":")
                    .splice(0, 2)
                    .join(":")}`}</Text>
                <Text variant="labelSmall">{`${new Date(weather.minutely[59].dt * 1000)
                    .toLocaleTimeString()
                    .split(":")
                    .splice(0, 2)
                    .join(":")}`}</Text>
            </View>
        </View>
    )
}
export { RainBar, Bar, RainComponent, UmbrellaIconReactive  };