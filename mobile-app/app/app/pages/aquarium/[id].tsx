import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Avatar } from "react-native-paper";
import { useStateContext } from "../../../context/StateContext";

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
			<Card style={styles.card}>
				<Card.Title title={aquarium.name} subtitle={aquarium.location} />
				<Card.Content>
					<View style={styles.row}>
						<Avatar.Icon
							icon={aquarium.isBombWorking ? "check-circle" : "alert-circle"}
							size={36}
							style={{
								backgroundColor: aquarium.isBombWorking
									? "#43a047"
									: "#e53935",
								marginRight: 8,
							}}
						/>
						<View>
							<Text>
								Bomb:{" "}
								<Text style={{ fontWeight: "bold" }}>
									{aquarium.isBombWorking ? "Working" : "Not Working"}
								</Text>
							</Text>
						</View>
					</View>
					<View style={styles.row}>
						<Avatar.Icon
							icon="calendar"
							size={36}
							style={{ backgroundColor: "#1976d2", marginRight: 8 }}
						/>
						<View>
							<Text>Created</Text>
							<Text>{new Date(aquarium.createdDate).toLocaleString()}</Text>
						</View>
					</View>
					<View style={styles.row}>
						<Avatar.Icon
							icon="account"
							size={36}
							style={{ backgroundColor: "#8e24aa", marginRight: 8 }}
						/>
						<View>
							<Text>Owner</Text>
							<Text>{aquarium.ownerUsername}</Text>
						</View>
					</View>
					<View style={styles.row}>
						<Avatar.Icon
							icon="tune"
							size={36}
							style={{ backgroundColor: "#00bcd4", marginRight: 8 }}
						/>
						<View>
							<Text>Thresholds</Text>
							<Text>
								Temp: {aquarium.threshold.minTemperature}°C -{" "}
								{aquarium.threshold.maxTemperature}°C
							</Text>
							<Text>
								pH: {aquarium.threshold.minPH} - {aquarium.threshold.maxPH}
							</Text>
							<Text>
								TDS: {aquarium.threshold.minTds} - {aquarium.threshold.maxTds}{" "}
								ppm
							</Text>
							<Text>
								Height: {aquarium.threshold.minHeight} -{" "}
								{aquarium.threshold.maxHeight} cm
							</Text>
						</View>
					</View>
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
		borderRadius: 16,
		elevation: 4,
		paddingBottom: 8,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 8,
	},
});
