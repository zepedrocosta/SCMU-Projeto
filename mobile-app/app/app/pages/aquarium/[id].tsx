import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, View, StyleSheet, FlatList } from "react-native";
import { Text, Card, Avatar, Divider } from "react-native-paper";
import { useStateContext } from "../../../context/StateContext";
import ThresholdBar from "../../../components/ThresholdBar";

const BombStatus = ({ isWorking }: { isWorking: boolean }) => (
	<View style={styles.infoRow}>
		<Avatar.Icon
			icon={isWorking ? "check-circle" : "alert-circle"}
			size={40}
			style={{
				backgroundColor: isWorking ? "#43a047" : "#e53935",
				marginRight: 16,
			}}
		/>
		<View>
			<Text style={styles.sectionLabel}>Bomb Status</Text>
			<Text style={[styles.bold, { color: isWorking ? "#43a047" : "#e53935" }]}>
				{isWorking ? "Working" : "Not Working"}
			</Text>
		</View>
	</View>
);

const CreatedInfo = ({ createdDate }: { createdDate: string }) => (
	<View style={styles.infoRow}>
		<Avatar.Icon
			icon="calendar"
			size={40}
			style={{ backgroundColor: "#1976d2", marginRight: 16 }}
		/>
		<View>
			<Text style={styles.sectionLabel}>Created</Text>
			<Text>{new Date(createdDate).toLocaleString()}</Text>
		</View>
	</View>
);

const OwnerInfo = ({ ownerUsername }: { ownerUsername: string }) => (
	<View style={styles.infoRow}>
		<Avatar.Icon
			icon="account"
			size={40}
			style={{ backgroundColor: "#8e24aa", marginRight: 16 }}
		/>
		<View>
			<Text style={styles.sectionLabel}>Owner</Text>
			<Text style={styles.bold}>{ownerUsername}</Text>
		</View>
	</View>
);

const BAR_WIDTH = 50; // Should match ThresholdBar style
const BAR_MARGIN = 8; // marginHorizontal * 2

const ThresholdsSection = ({ threshold }: { threshold: any }) => {
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
				// Centered row if fits
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
				// FlatList if not
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

	if (!aquarium) {
		return (
			<View style={styles.container}>
				<Text variant="titleLarge">Aquarium not found</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Card style={styles.card} mode="elevated">
				<Card.Title
					title={aquarium.name}
					subtitle={aquarium.location}
					titleStyle={styles.title}
					subtitleStyle={styles.subtitle}
					left={(props) => (
						<Avatar.Icon
							{...props}
							icon="fish"
							style={styles.avatarMain}
							color="#fff"
						/>
					)}
				/>
				<Divider style={{ marginVertical: 8 }} />
				<Card.Content>
					<BombStatus isWorking={aquarium.isBombWorking} />
					<CreatedInfo createdDate={aquarium.createdDate} />
					<OwnerInfo ownerUsername={aquarium.ownerUsername} />
					<Divider style={{ marginVertical: 12 }} />
					<ThresholdsSection threshold={aquarium.threshold} />
				</Card.Content>
			</Card>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
	},
	card: {
		borderRadius: 20,
		elevation: 6,
		backgroundColor: "#faf6ff",
		paddingBottom: 8,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#222",
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
	},
	avatarMain: {
		backgroundColor: "#1976d2",
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 10,
	},
	sectionLabel: {
		fontSize: 15,
		color: "#888",
		marginBottom: 2,
	},
	bold: {
		fontWeight: "bold",
		fontSize: 16,
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
	thresholdsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	thresholdBox: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 12,
		padding: 10,
		marginHorizontal: 4,
		elevation: 2,
		shadowColor: "#000",
		shadowOpacity: 0.07,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
	},
	thresholdIcon: {
		marginRight: 10,
		backgroundColor: "#1976d2",
	},
	thresholdLabel: {
		fontWeight: "bold",
		fontSize: 15,
		color: "#333",
	},
	thresholdValue: {
		fontSize: 14,
		color: "#222",
	},
});
