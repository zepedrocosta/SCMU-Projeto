import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Dimensions, View, StyleSheet, FlatList } from "react-native";
import { Text, Avatar, Divider } from "react-native-paper";
import { useStateContext } from "../../../context/StateContext";
import ThresholdBar from "../../../components/ThresholdBar";
import { useChangeWaterPumpStatus } from "../../../utils/services/AquariumService";

// ####### WaterPump #######
import { ActivityIndicator } from "react-native-paper";
// ...existing imports...

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
						backgroundColor: isWorking ? "#43a047" : "#e53935",
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

// ####### AquariumHeader #######
const AquariumHeader = ({
	name,
	location,
	ownerUsername,
	createdDate,
}: {
	name: string;
	location: string;
	ownerUsername: string;
	createdDate: string;
}) => {
	const dateObj = new Date(createdDate);
	const formattedDate = dateObj.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
	return (
		<View style={styles.headerContainer}>
			<View style={styles.headerRow}>
				<Avatar.Icon icon="fish" size={52} style={styles.avatarMain} color="#fff" />
				<View style={{ flex: 1 }}>
					<Text style={styles.headerTitle}>{name}</Text>
					<Text style={styles.headerSubtitle}>{location}</Text>
				</View>
			</View>
			<View style={styles.headerInfoRow}>
				<Avatar.Icon
					icon="account"
					size={28}
					style={styles.headerInfoIcon}
					color="#fff"
				/>
				<Text style={styles.headerInfoText}>{ownerUsername}</Text>
				<Avatar.Icon
					icon="calendar"
					size={28}
					style={styles.headerInfoIcon}
					color="#fff"
				/>
				<Text style={styles.headerInfoText}>{formattedDate}</Text>
			</View>
		</View>
	);
};

// ####### ThresholdsSection #######
const ThresholdsSection = ({ threshold }: { threshold: any }) => {
	const BAR_WIDTH = 50;
	const BAR_MARGIN = 8;

	const data = [
		{
			key: "temp",
			icon: "thermometer",
			iconColor: "#1976d2",
			bgColor: "#e3f2fd",
			label: "Temp",
			min: threshold?.minTemperature,
			max: threshold?.maxTemperature,
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
		},
		{
			key: "tds",
			icon: "molecule",
			iconColor: "#00bcd4",
			bgColor: "#e0f7fa",
			label: "TDS",
			min: threshold?.minTds,
			max: threshold?.maxTds,
			unit: "ppm",
		},
		{
			key: "height",
			icon: "waves",
			iconColor: "#00bcd4",
			bgColor: "#e0f7fa",
			label: "Height",
			min: threshold?.minHeight,
			max: threshold?.maxHeight,
			unit: "cm",
		},
		{
			key: "light",
			icon: "lightbulb",
			iconColor: "#fbc02d",
			bgColor: "#fffde7",
			label: "Light",
			min: threshold?.minLight,
			max: threshold?.maxLight,
			unit: "lux",
		},
	];

	const screenWidth = Dimensions.get("window").width;
	const totalBarWidth = data.length * BAR_WIDTH + (data.length - 1) * BAR_MARGIN;

	return (
		<View style={styles.thresholdsContainer}>
			<Text style={styles.thresholdsTitle}>Thresholds</Text>
			{totalBarWidth < screenWidth - 32 ? (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "flex-end",
					}}
				>
					{data.map(({ key, ...props }) => (
						<ThresholdBar key={key} {...props} />
					))}
				</View>
			) : (
				<FlatList
					data={data}
					horizontal
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item) => item.key}
					contentContainerStyle={{ paddingVertical: 8, alignItems: "flex-end" }}
					renderItem={({ item }) => {
						const { key, ...props } = item;
						return <ThresholdBar key={key} {...props} />;
					}}
				/>
			)}
		</View>
	);
};

export default function AquariumPage() {
	const { id } = useLocalSearchParams();
	const { aquariums } = useStateContext();
	const aquarium = aquariums.find((aq) => aq.id === id);

	const { mutate, isPending } = useChangeWaterPumpStatus();

	const [bombOn, setBombOn] = useState(aquarium?.isBombWorking ?? false);

	const handleToggleBomb = (value: boolean) => {
		mutate(id as string, {
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
			<AquariumHeader
				name={aquarium.name}
				location={aquarium.location}
				ownerUsername={aquarium.ownerUsername}
				createdDate={aquarium.createdDate}
			/>
			<Divider style={{ marginVertical: 12 }} />
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
});
