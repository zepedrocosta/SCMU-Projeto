import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Avatar } from "react-native-paper";

interface ThresholdBarProps {
	icon: string;
	iconColor: string;
	bgColor: string;
	label: string;
	min: string | number;
	max: string | number;
	unit?: string;
}

export default function ThresholdBar({
	icon,
	iconColor,
	bgColor,
	label,
	min,
	max,
	unit,
}: ThresholdBarProps) {
	return (
		<View style={[styles.verticalBar, { backgroundColor: bgColor }]}>
			<Avatar.Icon
				icon={icon}
				size={36}
				style={[styles.verticalBarIcon, { backgroundColor: iconColor }]}
				color="#fff"
			/>
			<Text style={styles.verticalBarLabel}>{label}</Text>
			<View style={styles.verticalBarValues}>
				<Text style={styles.verticalBarValueMin}>
					{min}
					{unit}
				</Text>
				<View style={styles.verticalBarDivider} />
				<Text style={styles.verticalBarValueMax}>
					{max}
					{unit}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	verticalBar: {
		width: 50,
		height: 170,
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
	},
	verticalBarIcon: {
		marginBottom: 6,
		backgroundColor: "#1976d2",
	},
	verticalBarLabel: {
		fontWeight: "bold",
		fontSize: 13,
		color: "#333",
		marginBottom: 6,
	},
	verticalBarValues: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	verticalBarValueMin: {
		fontSize: 12,
		color: "#222",
		fontWeight: "600",
	},
	verticalBarDivider: {
		width: 18,
		height: 2,
		backgroundColor: "#bbb",
		marginVertical: 3,
		borderRadius: 1,
	},
	verticalBarValueMax: {
		fontSize: 12,
		color: "#222",
		fontWeight: "600",
	},
});
