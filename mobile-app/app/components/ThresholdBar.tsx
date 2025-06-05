import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";

type ThresholdBarProps = {
	min: number;
	max: number;
	currentValue: number;
	barColor?: string;
	bgColor?: string;
	width?: number;
	height?: number;
	unit?: string;
	valueColor?: string;
};

export default function ThresholdBar({
	min,
	max,
	currentValue,
	barColor = "#1976d2",
	bgColor = "#e3f2fd",
	width = Dimensions.get("window").width / 7,
	height = Dimensions.get("window").width / 2,
	unit,
	valueColor,
}: ThresholdBarProps) {
	const percent =
		max > min ? Math.max(0, Math.min(1, (currentValue - min) / (max - min))) : 0;

	return (
		<View style={[styles.barContainer, { width, height, backgroundColor: bgColor }]}>
			<View
				style={[
					styles.barFill,
					{
						backgroundColor: barColor,
						width: "100%",
						height: `${percent * 100}%`,
						position: "absolute",
						bottom: 0,
						borderRadius: 8,
					},
				]}
			/>

			{/* Value label at fill level */}
			<View
				style={{
					position: "absolute",
					left: 0,
					width: "100%",
					alignItems: "center",
					bottom: percent * height,
					minHeight: 0,
				}}
				pointerEvents="none"
			></View>
		</View>
	);
}

const styles = StyleSheet.create({
	barContainer: {
		borderRadius: 8,
		overflow: "hidden",
		justifyContent: "flex-end",
		position: "relative",
	},
	barFill: {
		left: 0,
	},
});
