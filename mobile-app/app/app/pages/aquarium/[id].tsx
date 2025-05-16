import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, Card, Avatar, ProgressBar } from "react-native-paper";

const aquariumInfo = [
	{
		name: "Aquarium 1",
		description: "This aquarium is very nice",
		image: "https://example.com/aquarium1.jpg",
		waterLevel: 0.5, // 50%
		waterTemperature: 25, // °C
		waterComposition: 100, // ppm
		waterPh: 7.0,
		lightIntensity: 0.5, // 50%
		feedingSchedule: "Every day at 10h00",
		fishCount: 10,
	},
];

function getTempColor(temp: number) {
	if (temp < 20) return "#2196f3"; // blue (cold)
	if (temp > 28) return "#e53935"; // red (hot)
	return "#43a047"; // green (normal)
}

function getTempIcon(temp: number) {
	if (temp < 20) return "snowflake";
	if (temp > 28) return "fire";
	return "thermometer";
}

export default function AquariumPage() {
	const { id } = useLocalSearchParams();
	// For demo, just use the first aquarium
	const aquarium = aquariumInfo[0];

	return (
		<View style={styles.container}>
			<Card style={styles.card}>
				<Card.Cover source={{ uri: aquarium.image }} />
				<Card.Title title={aquarium.name} subtitle={aquarium.description} />
				<Card.Content>
					<View style={styles.row}>
						<Avatar.Icon
							icon="water"
							size={36}
							style={{ backgroundColor: "#2196f3", marginRight: 8 }}
						/>
						<View style={{ flex: 1 }}>
							<Text>Water Level</Text>
							<ProgressBar
								progress={aquarium.waterLevel}
								color="#2196f3"
								style={styles.progress}
							/>
							<Text>{Math.round(aquarium.waterLevel * 100)}%</Text>
						</View>
					</View>
					<View style={styles.row}>
						<Avatar.Icon
							icon={getTempIcon(aquarium.waterTemperature)}
							size={36}
							style={{
								backgroundColor: getTempColor(aquarium.waterTemperature),
								marginRight: 8,
							}}
						/>
						<View>
							<Text>Temperature</Text>
							<Text
								style={{
									color: getTempColor(aquarium.waterTemperature),
									fontWeight: "bold",
								}}
							>
								{aquarium.waterTemperature}°C
							</Text>
						</View>
					</View>
					<View style={styles.row}>
						<Avatar.Icon
							icon="chemical-weapon"
							size={36}
							style={{ backgroundColor: "#8e24aa", marginRight: 8 }}
						/>
						<View>
							<Text>Composition</Text>
							<Text>{aquarium.waterComposition} ppm</Text>
						</View>
					</View>
					<View style={styles.row}>
						<Avatar.Icon
							icon="beaker"
							size={36}
							style={{ backgroundColor: "#00bcd4", marginRight: 8 }}
						/>
						<View>
							<Text>pH</Text>
							<Text>{aquarium.waterPh}</Text>
						</View>
					</View>
					<View style={styles.row}>
						<Avatar.Icon
							icon="white-balance-sunny"
							size={36}
							style={{ backgroundColor: "#ffd600", marginRight: 8 }}
						/>
						<View style={{ flex: 1 }}>
							<Text>Light Intensity</Text>
							<ProgressBar
								progress={aquarium.lightIntensity}
								color="#ffd600"
								style={styles.progress}
							/>
							<Text>{Math.round(aquarium.lightIntensity * 100)}%</Text>
						</View>
					</View>
					<View style={styles.row}>
						<Avatar.Icon
							icon="fish"
							size={36}
							style={{ backgroundColor: "#039be5", marginRight: 8 }}
						/>
						<View>
							<Text>Fish Count</Text>
							<Text>{aquarium.fishCount}</Text>
						</View>
					</View>
					<View style={styles.row}>
						<Avatar.Icon
							icon="food"
							size={36}
							style={{ backgroundColor: "#ff7043", marginRight: 8 }}
						/>
						<View>
							<Text>Feeding Schedule</Text>
							<Text>{aquarium.feedingSchedule}</Text>
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
	progress: {
		height: 8,
		borderRadius: 4,
		marginVertical: 4,
	},
});
