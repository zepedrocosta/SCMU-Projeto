import React from "react";
import { View, StyleSheet } from "react-native";
import { List, Divider, Text } from "react-native-paper";
import { useRoutes } from "../../utils/routes";
import { MetricType, NotificationType } from "../../types/Notification";

const mockNotifications = [
	{
		id: "1",
		type: NotificationType.error,
		metric_type: MetricType.water_level,
		title: "Low Water Level",
		description: "The water level is below the recommended threshold.",
		timestamp: "2023-10-01T12:00:00Z",
		unread: true,
		date: "2023-10-01",
	},
	{
		id: "2",
		type: NotificationType.info,
		metric_type: MetricType.temperature,
		title: "Temperature Alert",
		description: "The water temperature is too high.",
		timestamp: "2023-10-01T12:05:00Z",
		unread: false,
		date: "2023-10-01",
	},
	{
		id: "3",
		type: NotificationType.reminder,
		metric_type: MetricType.feeding,
		title: "Feeding Reminder",
		description: "Time to feed your fish.",
		timestamp: "2023-10-01T13:00:00Z",
		unread: false,
		date: "2023-10-01",
	},
	{
		id: "4",
		type: NotificationType.alert,
		metric_type: MetricType.ph,
		title: "pH Level Alert",
		description: "pH level is out of range.",
		timestamp: "2023-10-01T14:00:00Z",
		unread: false,
		date: "2023-10-01",
	},
];

export default function NotificationsPage() {
	const router = useRoutes();

	return (
		<View style={styles.container}>
			<Text variant="titleLarge" style={styles.header}>
				Notifications
			</Text>
			{mockNotifications.map((notif, idx) => (
				<React.Fragment key={notif.id}>
					<List.Item
						title={notif.title}
						description={notif.description}
						onPress={() => router.gotoNotification(notif.id)}
						left={(props) => (
							<List.Icon
								{...props}
								icon={notif.unread ? "email" : "email-open"}
								color={notif.unread ? "#1976d2" : "#888"}
							/>
						)}
						right={(props) => <Text style={styles.date}>{notif.date}</Text>}
						style={notif.unread ? styles.unread : undefined}
					/>
					{idx < mockNotifications.length - 1 && <Divider />}
				</React.Fragment>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
	header: {
		marginBottom: 16,
		fontWeight: "bold",
	},
	date: {
		alignSelf: "center",
		color: "#888",
		fontSize: 12,
		marginRight: 8,
	},
	unread: {
		backgroundColor: "#e3f2fd",
	},
});
