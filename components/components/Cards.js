import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
	Text
} from "react-native-paper";
function FlexiCard(props) {
	const theme = props.theme;
	const bgColor = props.bgColor ? props.bgColor : theme.colors.primaryContainer;
	const onBg = props.onBg ? props.onBg : theme.colors.onBackground;
	const color = props.color ? props.color : theme.colors.primary;
	return (
		<View
			style={[
				{
					backgroundColor: bgColor,
					marginHorizontal: 4,
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					alignContent: "center",
					borderRadius: theme.roundness * 2,
					padding: theme.roundness * 2,
					
				},
			]}
		>
			<Text
				style={{
					color: onBg,
					marginBottom: theme.roundness,
					textAlignVertical: "center",
					textAlign: "center",
				}}
				
			>
				{props.label}
			</Text>
			<MaterialCommunityIcons
				name={props.icon}
				size={32}
				color={color}
				style={{
					transform: [
						{
							rotate: props.rotation + "deg",
						},
					],
					marginBottom: theme.roundness,
				}}
			/>
			{!React.isValidElement(props.value) &&
			(typeof props.value === "string" || typeof props.value === "number") ? (
				<Text
					style={{
						color: onBg,
					}}
				>
					{props.value}
					{props.unit}
				</Text>
			) : (
				React.isValidElement(props.value) && props.value
			)}
		</View>
	);
}
export { FlexiCard };
