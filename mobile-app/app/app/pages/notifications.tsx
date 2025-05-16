import React from "react";
import { View, StyleSheet } from "react-native";
import { List, Divider, Text } from "react-native-paper";

const mockNotifications = [
	{
		id: "1",
		title: "Water Change Reminder",
		description: "It's time to change the water in Aquarium 1.",
		date: "2024-05-16",
		unread: true,
	},
	{
		id: "2",
		title: "Temperature Alert",
		description: "Aquarium 2 temperature is above normal.",
		date: "2024-05-15",
		unread: false,
	},
	{
		id: "3",
		title: "Filter Maintenance",
		description: "Don't forget to clean the filter in Aquarium 1.",
		date: "2024-05-14",
		unread: true,
	},
];

export default function NotificationsPage() {
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
