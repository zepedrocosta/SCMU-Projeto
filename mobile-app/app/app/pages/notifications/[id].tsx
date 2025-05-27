import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Avatar } from "react-native-paper";
import { Notification, NotificationType, MetricType } from "../../../types/Notification";

const notificationInfo: Notification[] = [
	{
		type: NotificationType.error,
		metric_type: MetricType.water_level,
		title: "Low Water Level",
		description: "The water level is below the recommended threshold.",
		timestamp: "2023-10-01T12:00:00Z",
		unread: true,
	},
	{
		type: NotificationType.info,
		metric_type: MetricType.temperature,
		title: "Temperature Alert",
		description: "The water temperature is too high.",
		timestamp: "2023-10-01T12:05:00Z",
		unread: false,
	},
	{
		type: NotificationType.reminder,
		metric_type: MetricType.feeding,
		title: "Feeding Reminder",
		description: "Time to feed your fish.",
		timestamp: "2023-10-01T13:00:00Z",
		unread: false,
	},
	{
		type: NotificationType.alert,
		metric_type: MetricType.ph,
		title: "pH Level Alert",
		description: "pH level is out of range.",
		timestamp: "2023-10-01T14:00:00Z",
		unread: false,
	},
];

function getTypeIcon(type: NotificationType) {
	switch (type) {
		case "error":
			return { icon: "alert-circle", color: "#e53935" };
		case "alert":
			return { icon: "alert", color: "#fb8c00" };
		case "info":
			return { icon: "information", color: "#1976d2" };
		case "reminder":
			return { icon: "bell", color: "#43a047" };
		default:
			return { icon: "bell", color: "#888" };
	}
}

function getMetricIcon(metric?: MetricType) {
	switch (metric) {
		case "water_level":
			return { icon: "water", label: "Water Level" };
		case "temperature":
			return { icon: "thermometer", label: "Temperature" };
		case "composition":
			return { icon: "flask", label: "Composition" };
		case "ph":
			return { icon: "beaker", label: "pH Level" };
		case "light":
			return { icon: "white-balance-sunny", label: "Light" };
		case "feeding":
			return { icon: "fish", label: "Feeding" };
		default:
			return { icon: "bell", label: "General" };
	}
}

export default function NotificationDetailPage() {
	const { id } = useLocalSearchParams();
	const notification = notificationInfo[Number(id)];

	const { icon: typeIcon, color: typeColor } = getTypeIcon(notification.type);
	const { icon: metricIcon, label: metricLabel } = getMetricIcon(notification.metric_type);

	return (
		<View style={styles.container}>
			<Card style={styles.card}>
				<Card.Title
					title={notification.title}
					subtitle={metricLabel}
					left={(props) => (
						<Avatar.Icon
							{...props}
							icon={typeIcon}
							style={{ backgroundColor: typeColor }}
						/>
					)}
				/>
				<Card.Content>
					<Text style={styles.description}>{notification.description}</Text>
					<View style={styles.row}>
						<Avatar.Icon
							icon={metricIcon}
							size={32}
							style={{ backgroundColor: "#e3f2fd", marginRight: 8 }}
							color="#1976d2"
						/>
						<Text style={styles.metricText}>{metricLabel}</Text>
					</View>
					<Text style={styles.timestamp}>
						{new Date(notification.timestamp).toLocaleString()}
					</Text>
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
		marginVertical: 12,
	},
	metricText: {
		fontSize: 16,
		color: "#1976d2",
	},
	description: {
		fontSize: 16,
		marginBottom: 8,
	},
	timestamp: {
		color: "#888",
		fontSize: 12,
		marginTop: 8,
	},
});
