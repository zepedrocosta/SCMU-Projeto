import React from "react";
import { View, StyleSheet, Text } from "react-native";

interface ThresholdBarProps {
	min: number;
	max: number;
	currentValue: number;
	bgColor: string;
}

export default function ThresholdBar({ min, max, currentValue, bgColor }: ThresholdBarProps) {
	const barHeight = 170;
	const markerSize = 28;

	// Clamp value and calculate position
	const safeValue = Math.max(min, Math.min(currentValue, max));
	const percent = (safeValue - min) / (max - min);
	const markerPosition = barHeight - percent * barHeight - markerSize / 2;

	return (
		<View style={[styles.verticalBar, { backgroundColor: bgColor, height: barHeight }]}>
			{/* Marker */}
			<View
				style={[
					styles.marker,
					{
						top: markerPosition,
					},
				]}
			>
				<Text style={styles.markerText}>{currentValue}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	verticalBar: {
		width: 50,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "flex-start",
		marginHorizontal: 4,
		paddingVertical: 12,
		elevation: 2,
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		position: "relative",
	},
	marker: {
		position: "absolute",
		left: 11,
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "#1976d2",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#fff",
	},
	markerText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 13,
	},
});
