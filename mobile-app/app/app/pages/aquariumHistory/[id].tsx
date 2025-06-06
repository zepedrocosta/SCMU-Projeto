import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Avatar, IconButton } from "react-native-paper";
import { useRoutes } from "../../../utils/routes";
import { useLocalSearchParams } from "expo-router";
import { useStateContext } from "../../../context/StateContext";

const mockHistory = [
	{
		date: "2025-06-10",
		metrics: {
			temp: { value: 32, min: 20, max: 30 },
			ph: { value: 8.5, min: 6.5, max: 8.0 },
			tds: { value: 420, min: 400, max: 600 },
			height: { value: 22, min: 25, max: 35 },
			light: { value: 950, min: 500, max: 1000 },
		},
	},
	{
		date: "2025-06-09",
		metrics: {
			temp: { value: 32, min: 20, max: 30 },
			ph: { value: 8.5, min: 6.5, max: 8.0 },
			tds: { value: 420, min: 400, max: 600 },
			height: { value: 22, min: 25, max: 35 },
			light: { value: 950, min: 500, max: 1000 },
		},
	},
	{
		date: "2025-06-08",
		metrics: {
			temp: { value: 32, min: 20, max: 30 },
			ph: { value: 8.5, min: 6.5, max: 8.0 },
			tds: { value: 420, min: 400, max: 600 },
			height: { value: 22, min: 25, max: 35 },
			light: { value: 950, min: 500, max: 1000 },
		},
	},
	{
		date: "2025-06-07",
		metrics: {
			temp: { value: 32, min: 20, max: 30 },
			ph: { value: 8.5, min: 6.5, max: 8.0 },
			tds: { value: 420, min: 400, max: 600 },
			height: { value: 22, min: 25, max: 35 },
			light: { value: 950, min: 500, max: 1000 },
		},
	},
	{
		date: "2025-06-06",
		metrics: {
			temp: { value: 27, min: 20, max: 30 },
			ph: { value: 7.2, min: 6.5, max: 8.0 },
			tds: { value: 480, min: 400, max: 600 },
			height: { value: 30, min: 25, max: 35 },
			light: { value: 800, min: 500, max: 1000 },
		},
	},
	{
		date: "2025-06-05",
		metrics: {
			temp: { value: 32, min: 20, max: 30 },
			ph: { value: 8.5, min: 6.5, max: 8.0 },
			tds: { value: 420, min: 400, max: 600 },
			height: { value: 22, min: 25, max: 35 },
			light: { value: 950, min: 500, max: 1000 },
		},
	},
];

const metricMeta = [
	{ key: "temp", icon: "thermometer", color: "#d23519", unit: "°C", bgColor: "#ffebee" },
	{ key: "ph", icon: "water", color: "#8e24aa", unit: "", bgColor: "#f3e5f5" },
	{ key: "tds", icon: "molecule", color: "#00bcd4", unit: "ppm", bgColor: "#e0f7fa" },
	{ key: "height", icon: "waves", color: "#2f90ff", unit: "cm", bgColor: "#e0ebfa" },
	{ key: "light", icon: "lightbulb", color: "#fbc02d", unit: "lux", bgColor: "#fffde7" },
];

function isWithinThreshold(value: number, min: number, max: number) {
	return value >= min && value <= max;
}

const MetricColumn = ({ icon, iconColor, bgColor, value, unit, ok }: any) => (
	<View style={styles.metricColumn}>
		<Avatar.Icon
			icon={ok ? "check-circle" : "close-circle"}
			size={22}
			style={{
				backgroundColor: "transparent",
				marginBottom: 2,
			}}
			color={ok ? "#43a047" : "#e53935"}
		/>
		<Avatar.Icon
			icon={icon}
			size={32}
			style={[styles.metricIcon, { backgroundColor: iconColor }]}
			color="#fff"
		/>
		<Text style={[styles.metricValue, { color: iconColor }]}>
			{value}
			{unit ? ` ${unit}` : ""}
		</Text>
	</View>
);

export default function AquariumHistory() {
	const router = useRoutes();

	const { id } = useLocalSearchParams();
	const { aquariums } = useStateContext();
	const aquarium = aquariums.find((aq) => aq.id === id);

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<IconButton
					icon="arrow-left"
					size={28}
					onPress={() => router.expo.back()}
					style={{ marginLeft: -8 }}
					accessibilityLabel="Go back"
				/>
				<Text style={styles.title}>History for {aquarium?.name}</Text>
			</View>
			<FlatList
				data={mockHistory}
				keyExtractor={(item) => item.date}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<Text style={styles.date}>
							{new Date(item.date).toLocaleDateString()}
						</Text>
						<View style={styles.metricsRow}>
							{metricMeta.map((meta) => {
								const m = item.metrics[meta.key as keyof typeof item.metrics];
								const ok = isWithinThreshold(m.value, m.min, m.max);
								return (
									<MetricColumn
										key={meta.key}
										icon={meta.icon}
										iconColor={meta.color}
										bgColor={meta.bgColor}
										value={m.value}
										unit={meta.unit}
										ok={ok}
									/>
								);
							})}
						</View>
					</View>
				)}
				ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
				contentContainerStyle={{ paddingBottom: 24 }}
			/>
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
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 14,
		color: "#1976d2",
		letterSpacing: 0.2,
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 16,
		paddingVertical: 16,
		paddingHorizontal: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 6,
		elevation: 2,
		marginHorizontal: 2,
	},
	row: {
		marginBottom: 10,
	},
	date: {
		fontSize: 13,
		color: "#888",
		marginBottom: 6,
		marginLeft: 2,
	},
	metricsRow: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "center",
		gap: 12,
	},
	metricColumn: {
		alignItems: "center",
		justifyContent: "flex-end",
		width: 60,
	},
	metricIcon: {
		marginBottom: 6,
		backgroundColor: "#1976d2",
	},
	metricValue: {
		fontWeight: "bold",
		fontSize: 14,
		marginTop: 2,
	},
	separator: {
		height: 8,
	},
});
