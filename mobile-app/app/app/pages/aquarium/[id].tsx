import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { Text, Avatar, ActivityIndicator } from "react-native-paper";
import { useStateContext } from "../../../context/StateContext";
import ThresholdBar from "../../../components/ThresholdBar";
import { useChangeWaterPumpStatus } from "../../../utils/services/AquariumService";
import AquariumHeader from "../../../components/AquariumHeader";

// ####### WaterPump #######
const BombStatus = ({
	isWorking,
	onToggle,
	isPending = false,
}: {
	isWorking: boolean;
	onToggle?: (value: boolean) => void;
	isPending?: boolean;
}) => (
	<View style={styles.bombStatusContainer}>
		<View
			style={{ justifyContent: "center", alignItems: "center", height: 56, width: 56 }}
		>
			{isPending ? (
				<ActivityIndicator
					size={36}
					color="#1976d2"
					style={{
						alignSelf: "center",
					}}
				/>
			) : (
				<Avatar.Icon
					icon={"power"}
					size={56}
					style={{
						backgroundColor: isWorking ? "#43a047" : "#e5383546",
						marginRight: 0,
					}}
					color="#fff"
					onTouchEnd={() => onToggle && onToggle(!isWorking)}
				/>
			)}
		</View>
		<View>
			<Text>Bomb Status</Text>
			<Text style={[{ color: isWorking ? "#43a047" : "#e53935" }]}>
				{isWorking ? "Working" : "Not Working"}
			</Text>
		</View>
	</View>
);

const ThresholdBarWithLabels = ({
	icon,
	iconColor,
	label,
	min,
	max,
	value,
	unit,
	bgColor,
}: any) => {
	return (
		<View style={{ alignItems: "center", width: "100%" }}>
			{/* Icon with circle and label below the bar */}
			<View style={{ alignItems: "center", marginTop: 8 }}>
				<Text style={styles.verticalBarLabel}>{label}</Text>

				<Avatar.Icon
					icon={icon}
					size={36}
					style={[styles.verticalBarIcon, { backgroundColor: iconColor }]}
					color="#fff"
				/>
			</View>
			{/* Current value below the bar */}
			<Text
				style={{
					fontSize: 14,
					fontWeight: "bold",
					color: iconColor,
					marginBottom: 10,
				}}
			>
				{value}
				{unit ? ` ${unit}` : ""}
			</Text>

			{/* Max value on top */}
			<Text style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>{max}</Text>

			<ThresholdBar
				bgColor={bgColor}
				barColor={iconColor}
				max={max}
				min={min}
				currentValue={value}
				valueColor={iconColor}
			/>

			{/* Min value below */}
			<Text style={{ fontSize: 13, color: "#888", marginTop: 10 }}>{min}</Text>
		</View>
	);
};

const ThresholdsSection = ({ threshold }: { threshold: any }) => {
	const screenWidth = Dimensions.get("window").width;
	const horizontalPadding = 32;
	const spacing = 12;
	const barCount = 5;
	const barWidth = (screenWidth - horizontalPadding - (barCount - 1) * spacing) / barCount;

	const data = [
		{
			key: "temp",
			icon: "thermometer",
			iconColor: "#d23519",
			bgColor: "#ffebee",
			label: "Temp",
			min: threshold?.minTemperature,
			max: threshold?.maxTemperature,
			value: 38,
			unit: "°C",
		},
		{
			key: "ph",
			icon: "water",
			iconColor: "#8e24aa",
			bgColor: "#f3e5f5",
			label: "pH",
			min: threshold?.minPH,
			max: threshold?.maxPH,
			value: 7.5,
		},
		{
			key: "tds",
			icon: "molecule",
			iconColor: "#00bcd4",
			bgColor: "#e0f7fa",
			label: "TDS",
			min: threshold?.minTds,
			max: threshold?.maxTds,
			value: 460,
			unit: "ppm",
		},
		{
			key: "height",
			icon: "waves",
			iconColor: "#2f90ff",
			bgColor: "#e0ebfa",
			label: "Height",
			min: threshold?.minHeight,
			max: threshold?.maxHeight,
			value: 31,
			unit: "cm",
		},
		{
			key: "light",
			icon: "lightbulb",
			iconColor: "#fbc02d",
			bgColor: "#fffde7",
			label: "Light",
			min: threshold?.minLight || 0,
			max: threshold?.maxLight || 1000,
			value: 500,
			unit: "lux",
		},
	];

	return (
		<View style={styles.thresholdsContainer}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "flex-end",
				}}
			>
				{data.map(({ key, ...props }, idx) => (
					<View
						key={key}
						style={{
							width: barWidth,
							marginRight: idx !== data.length - 1 ? spacing : 0,
						}}
					>
						<ThresholdBarWithLabels {...props} />
					</View>
				))}
			</View>
		</View>
	);
};

export default function AquariumPage() {
	const { id } = useLocalSearchParams();
	const { aquariums } = useStateContext();
	const aquarium = aquariums.find((aq) => aq.id === id);

	const { mutate: changeWaterPumpStatus, isPending } = useChangeWaterPumpStatus();

	const [bombOn, setBombOn] = useState(aquarium?.isBombWorking ?? false);

	const handleToggleBomb = (value: boolean) => {
		changeWaterPumpStatus(id as string, {
			onSuccess: () => {
				console.log(`Water pump status for aquarium ${id} changed to ${value}`);
				setBombOn(value);
			},
		});
	};

	if (!aquarium) {
		return (
			<View style={styles.container}>
				<Text variant="titleLarge">Aquarium not found</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<AquariumHeader aquarium={aquarium} />
			<BombStatus isWorking={bombOn} onToggle={handleToggleBomb} isPending={isPending} />
			<ThresholdsSection threshold={aquarium.threshold} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f5f5f5",
		justifyContent: "flex-start",
	},
	headerContainer: {
		backgroundColor: "#1976d2",
		borderRadius: 18,
		padding: 18,
		marginBottom: 16,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	avatarMain: {
		backgroundColor: "#1565c0",
		marginRight: 14,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
	},
	headerSubtitle: {
		fontSize: 16,
		color: "#e3e3e3",
	},
	headerInfoRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 2,
	},
	headerInfoIcon: {
		backgroundColor: "#2196f3",
		marginRight: 6,
	},
	headerInfoText: {
		color: "#fff",
		fontSize: 15,
		marginRight: 18,
	},
	bombStatusContainer: {
		alignItems: "center",
		marginVertical: 16,
	},
	thresholdsContainer: {
		marginTop: 12,
		marginBottom: 8,
	},
	thresholdsTitle: {
		fontSize: 17,
		fontWeight: "bold",
		color: "#444",
		marginBottom: 8,
		marginLeft: 4,
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
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 24,
		width: "90%",
		maxWidth: 400,
		maxHeight: "80%",
		alignItems: "stretch",
		justifyContent: "flex-start",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 16,
	},
	addButtonHeader: {
		backgroundColor: "#1976D2",
		borderRadius: 20,
		paddingHorizontal: 14,
		minWidth: 0,
		elevation: 0,
	},
	addButtonHeaderLabel: {
		fontSize: 15,
		fontWeight: "bold",
		color: "#fff",
		textTransform: "none",
	},
	modalButtonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 24,
		width: "100%",
	},
	modalButton: {
		flex: 1,
		marginHorizontal: 8,
	},
});
