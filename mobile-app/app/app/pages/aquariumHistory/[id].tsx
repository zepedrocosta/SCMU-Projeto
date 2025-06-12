import { View, FlatList, StyleSheet } from "react-native";
import { Text, Avatar, IconButton } from "react-native-paper";
import { useRoutes } from "../../../utils/routes";
import { useLocalSearchParams } from "expo-router";
import { useStateContext } from "../../../context/StateContext";
import React, { useState, useMemo } from "react";
import { Snapshot } from "../../../types/Aquarium";

const metricMeta = [
	{
		key: "temperature",
		icon: "thermometer",
		color: "#d23519",
		unit: "°C",
		bgColor: "#ffebee",
		minKey: "minTemperature",
		maxKey: "maxTemperature",
	},
	{
		key: "ph",
		icon: "water",
		color: "#8e24aa",
		unit: "",
		bgColor: "#f3e5f5",
		minKey: "minPh",
		maxKey: "maxPh",
	},
	{
		key: "tds",
		icon: "molecule",
		color: "#00bcd4",
		unit: "ppm",
		bgColor: "#e0f7fa",
		minKey: "minTds",
		maxKey: "maxTds",
	},
	{
		key: "height",
		icon: "waves",
		color: "#2f90ff",
		unit: "cm",
		bgColor: "#e0ebfa",
		minKey: "minHeight",
		maxKey: "maxHeight",
	},
	{
		key: "ldr",
		icon: "lightbulb",
		color: "#fbc02d",
		unit: "lux",
		bgColor: "#fffde7",
		minKey: null,
		maxKey: null,
	}, // ldr is boolean, so no min/max
];

function isWithinThreshold(value: number, min?: number, max?: number) {
	if (typeof min === "number" && typeof max === "number") {
		return value >= min && value <= max;
	}
	return true;
}

// ...other imports...

function aggregateHistory(
	history: Snapshot[] | undefined,
	unit: "minute" | "hour"
): Snapshot[] {
	if (!history) return [];
	const groups: { [key: string]: Snapshot[] } = {};

	history.forEach((item) => {
		const date = new Date(item.createdDate ?? "");
		let key: string;
		if (unit === "minute") {
			key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
		} else {
			key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}`;
		}
		if (!groups[key]) groups[key] = [];
		groups[key].push(item);
	});

	return Object.entries(groups).map(([groupKey, items]) => {
		const base: any = { ...items[items.length - 1] };
		metricMeta.forEach((meta) => {
			const values = items
				.map((i) => Number(i[meta.key as keyof Snapshot]))
				.filter((v) => !isNaN(v));
			if (values.length) {
				let avg = values.reduce((a, b) => a + b, 0) / values.length;
				if (meta.key === "temperature") {
					base[meta.key] = avg < 100 ? Math.round(avg * 10) / 10 : Math.round(avg);
				} else if (meta.key === "ph") {
					base[meta.key] = Math.round(avg * 10) / 10;
				} else if (meta.key === "tds" || meta.key === "height") {
					base[meta.key] = Math.round(avg);
				} else {
					base[meta.key] = avg;
				}
			}
		});
		base.createdDate = items[items.length - 1].createdDate;
		return base;
	});
}

const MetricColumn = ({ icon, iconColor, bgColor, value, unit, ok }: any) => (
	<View style={styles.metricColumn}>
		<Avatar.Icon
			icon={ok ? "check-circle" : "close-circle"}
			size={24}
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
		<Text
			style={[styles.metricValue, { color: iconColor }]}
			// numberOfLines={1}
			adjustsFontSizeToFit
		>
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

	const [aggregation, setAggregation] = useState<"minute" | "hour" | "raw">("minute");

	const aggregatedHistory = useMemo(
		() =>
			aggregation === "raw"
				? aquarium?.history || []
				: aggregateHistory(aquarium?.history, aggregation as "minute" | "hour"),
		[aquarium?.history, aggregation]
	);

	if (!aquarium || !aquarium.history) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Aquarium not found</Text>
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
				<Text style={styles.title}>History for {aquarium?.name}</Text>
			</View>
			<View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 8 }}>
				<Text
					style={{
						marginHorizontal: 8,
						fontWeight: aggregation === "minute" ? "bold" : "normal",
						color: aggregation === "minute" ? "#1976d2" : "#888",
						padding: 6,
					}}
					onPress={() => setAggregation("minute")}
				>
					By Minute
				</Text>
				<Text
					style={{
						marginHorizontal: 8,
						fontWeight: aggregation === "hour" ? "bold" : "normal",
						color: aggregation === "hour" ? "#1976d2" : "#888",
						padding: 6,
					}}
					onPress={() => setAggregation("hour")}
				>
					By Hour
				</Text>
				<Text
					style={{
						marginHorizontal: 8,
						fontWeight: aggregation === "raw" ? "bold" : "normal",
						color: aggregation === "raw" ? "#1976d2" : "#888",
						padding: 6,
					}}
					onPress={() => setAggregation("raw")}
				>
					Raw
				</Text>
			</View>
			<FlatList
				data={aggregatedHistory}
				keyExtractor={(item) => item.id + item.createdDate}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<Text style={styles.date}>
							{item.createdDate
								? `${new Date(
										item.createdDate
								  ).toLocaleDateString()} ${new Date(
										item.createdDate
								  ).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
								  })}`
								: ""}
						</Text>
						<View style={styles.metricsRow}>
							{metricMeta.map((meta) => {
								let value = item[meta.key as keyof Snapshot];
								let min = meta.minKey
									? Number(item[meta.minKey as keyof Snapshot] ?? "")
									: undefined;
								let max = meta.maxKey
									? Number(item[meta.maxKey as keyof Snapshot] ?? "")
									: undefined;
								let ok = true;

								// Format value for display
								if (meta.key === "ldr") {
									value = value ? "On" : "Off";
									ok = true;
								} else if (
									meta.key === "temperature" &&
									typeof value === "number"
								) {
									value =
										value < 100
											? value.toFixed(1)
											: Math.round(value).toString();
								} else if (meta.key === "ph" && typeof value === "number") {
									value = value.toFixed(1);
								} else if (
									(meta.key === "tds" || meta.key === "height") &&
									typeof value === "number"
								) {
									value = Math.round(value).toString();
								}

								if (
									typeof item[meta.key as keyof Snapshot] === "number" &&
									typeof min === "number" &&
									typeof max === "number"
								) {
									ok = isWithinThreshold(
										item[meta.key as keyof Snapshot] as number,
										min,
										max
									);
								}

								return (
									<MetricColumn
										key={meta.key}
										icon={meta.icon}
										iconColor={meta.color}
										bgColor={meta.bgColor}
										value={value}
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
		fontSize: 15,
		fontWeight: "bold",
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
		fontSize: 13,
		marginTop: 2,
	},
	separator: {
		height: 8,
	},
});
