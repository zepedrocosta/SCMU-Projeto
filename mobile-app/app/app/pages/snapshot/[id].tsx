import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Avatar, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoutes } from "../../../utils/routes";
import { useLocalSearchParams } from "expo-router";
import { useStateContext } from "../../../context/StateContext";
import { Snapshot } from "../../../types/Aquarium";

const metricMeta = [
	{
		key: "temperature",
		icon: "thermometer",
		color: "#d23519",
		unit: "°C",
		bgColor: "#ffebee",
		label: "Temperature",
		minKey: "minTemperature",
		maxKey: "maxTemperature",
	},
	{
		key: "ph",
		icon: "water",
		color: "#8e24aa",
		unit: "",
		bgColor: "#f3e5f5",
		label: "pH",
		minKey: "minPh",
		maxKey: "maxPh",
	},
	{
		key: "tds",
		icon: "molecule",
		color: "#00bcd4",
		unit: "ppm",
		bgColor: "#e0f7fa",
		label: "TDS",
		minKey: "minTds",
		maxKey: "maxTds",
	},
	{
		key: "height",
		icon: "waves",
		color: "#2f90ff",
		unit: "cm",
		bgColor: "#e0ebfa",
		label: "Height",
		minKey: "minHeight",
		maxKey: "maxHeight",
	},
	{
		key: "ldr",
		icon: "lightbulb",
		color: "#fbc02d",
		unit: "lux",
		bgColor: "#fffde7",
		label: "Light",
		minKey: null,
		maxKey: null,
	},
];

function isWithinThreshold(value: number, min?: number, max?: number) {
	if (typeof min === "number" && typeof max === "number") {
		return value >= min && value <= max;
	}
	return true;
}

export default function SnapshotPage() {
	const router = useRoutes();
	const { id } = useLocalSearchParams();
	const { aquariums } = useStateContext();

	// Find the snapshot by id in all aquariums' histories
	let snapshot: Snapshot | undefined;
	let aquariumName: string | undefined;
	for (const aq of aquariums) {
		if (aq.history) {
			const found = aq.history.find((s) => s.id === id);
			if (found) {
				snapshot = found;
				aquariumName = aq.name;
				break;
			}
		}
	}

	if (!snapshot) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Snapshot not found</Text>
			</View>
		);
	}

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
				<Text style={styles.title}>Snapshot for {aquariumName || "Aquarium"}</Text>
			</View>
			<Text style={styles.date}>
				{snapshot.createdDate
					? `${new Date(snapshot.createdDate).toLocaleDateString()} ${new Date(
							snapshot.createdDate
					  ).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
					  })}`
					: ""}
			</Text>
			<View style={styles.metricsList}>
				{metricMeta.map((meta) => {
					let value = snapshot[meta.key as keyof Snapshot];
					let displayValue = value;
					let min: number | undefined = undefined;
					let max: number | undefined = undefined;
					let minLabel = "";
					let maxLabel = "";
					let failedBy: string | null = null;
					let ok = true;

					// Get min/max if available (thresholds are strings in your type)
					if (meta.minKey && meta.maxKey) {
						const minRaw = snapshot[meta.minKey as keyof Snapshot];
						const maxRaw = snapshot[meta.maxKey as keyof Snapshot];
						min = minRaw !== undefined ? Number(minRaw) : undefined;
						max = maxRaw !== undefined ? Number(maxRaw) : undefined;
						if (typeof min === "number" && !isNaN(min)) minLabel = min.toString();
						if (typeof max === "number" && !isNaN(max)) maxLabel = max.toString();
					}

					// Format value for display
					if (meta.key === "ldr") {
						displayValue = value ? "On" : "Off";
						ok = true;
					} else if (meta.key === "temperature" && typeof value === "number") {
						displayValue =
							value < 100 ? value.toFixed(1) : Math.round(value).toString();
					} else if (meta.key === "ph" && typeof value === "number") {
						displayValue = value.toFixed(1);
					} else if (
						(meta.key === "tds" || meta.key === "height") &&
						typeof value === "number"
					) {
						displayValue = Math.round(value).toString();
					}

					// Check threshold and calculate failedBy if needed
					if (
						typeof value === "number" &&
						typeof min === "number" &&
						typeof max === "number"
					) {
						ok = isWithinThreshold(value, min, max);
						if (!ok) {
							if (value < min) {
								failedBy = `-${(min - value).toFixed(2)}`;
							} else if (value > max) {
								failedBy = `+${(value - max).toFixed(2)}`;
							}
						}
					}

					return (
						<View
							key={meta.key}
							style={[styles.metricCard, { backgroundColor: meta.bgColor }]}
						>
							<View style={styles.metricTopRow}>
								<View style={styles.metricLeft}>
									<Avatar.Icon
										icon={meta.icon}
										size={36}
										style={[
											styles.metricIcon,
											{ backgroundColor: meta.color },
										]}
									/>
									<Text style={[styles.metricLabel, { color: meta.color }]}>
										{meta.label}
									</Text>
								</View>
								<View style={styles.metricRight}>
									<View
										style={{ flexDirection: "row", alignItems: "center" }}
									>
										<Text
											style={[styles.metricValue, { color: meta.color }]}
										>
											{displayValue}
											{meta.unit ? ` ${meta.unit}` : ""}
										</Text>
										{meta.key !== "ldr" && (
											<MaterialCommunityIcons
												name={ok ? "check-circle" : "close-circle"}
												size={20}
												color={ok ? "#43a047" : "#e53935"}
												style={{ marginLeft: 6 }}
											/>
										)}
									</View>
								</View>
							</View>
							<View style={styles.metricBottomRow}>
								{(minLabel || maxLabel) && (
									<Text style={styles.thresholdText}>
										Range: {minLabel} - {maxLabel} {meta.unit}
									</Text>
								)}
								{failedBy && (
									<Text style={styles.failedByText}>
										Out by {failedBy} {meta.unit}
									</Text>
								)}
							</View>
						</View>
					);
				})}
			</View>
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
	metricCard: {
		borderRadius: 14,
		padding: 14,
		marginBottom: 14,
		elevation: 1,
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowOffset: { width: 0, height: 1 },
		shadowRadius: 4,
	},

	metricTopRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},

	metricLeft: {
		flexDirection: "row",
		alignItems: "center",
	},

	metricIcon: {
		backgroundColor: "#ccc",
	},

	metricLabel: {
		fontSize: 17,
		fontWeight: "600",
		marginLeft: 10,
	},

	metricRight: {
		alignItems: "flex-end",
	},

	metricValue: {
		fontSize: 18,
		fontWeight: "bold",
	},

	metricBottomRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 4,
	},

	failedByText: {
		fontSize: 14,
		color: "#e53935",
		fontWeight: "500",
	},

	thresholdText: {
		fontSize: 14,
		color: "#666",
	},

	metricRow: {
		backgroundColor: "#fff",
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 10,
		marginBottom: 14,
		shadowColor: "#000",
		shadowOpacity: 0.04,
		shadowRadius: 4,
		elevation: 1,
	},
	metricContentRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	metricLeftCol: {
		width: "50%",
		flexDirection: "row",
		alignItems: "center",
	},
	metricRightCol: {
		width: "50%",
		alignItems: "flex-end",
		justifyContent: "center",
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
	date: {
		fontSize: 15,
		fontWeight: "bold",
		color: "#888",
		marginBottom: 12,
		marginLeft: 2,
	},
	metricsList: {
		marginTop: 8,
	},

	metricCenter: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
});
