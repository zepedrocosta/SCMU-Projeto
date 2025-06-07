import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { List, Text, Avatar } from "react-native-paper";
import { useRoutes } from "../../utils/routes";
import { useStateContext } from "../../context/StateContext";

const metricsAux = [
	{
		key: "temp",
		icon: "thermometer",
		iconColor: "#d23519",
		bgColor: "#ffebee",
		label: "Temp",
		unit: "°C",
	},
	{
		key: "ph",
		icon: "water",
		iconColor: "#8e24aa",
		bgColor: "#f3e5f5",
		label: "pH",
	},
	{
		key: "tds",
		icon: "molecule",
		iconColor: "#00bcd4",
		bgColor: "#e0f7fa",
		label: "TDS",
		unit: "ppm",
	},
	{
		key: "height",
		icon: "waves",
		iconColor: "#2f90ff",
		bgColor: "#e0ebfa",
		label: "Height",
		unit: "cm",
	},
	{
		key: "light",
		icon: "lightbulb",
		iconColor: "#fbc02d",
		bgColor: "#fffde7",
		label: "Light",
		unit: "lux",
	},
];

function parseMetrics(message: string): string[] {
	return message.split(",").map((metric) => metric.trim().toLowerCase());
}

export default function NotificationsPage() {
	const { aquariums } = useStateContext();
	const router = useRoutes();

	const notifications = aquariums.flatMap((aq) =>
		aq.notifications.map((notif) => ({
			id: aq.id + "-" + notif.createdDate,
			aquariumId: aq.id,
			metrics: parseMetrics(notif.message),
			unread: notif.unread,
			date: new Date(notif.createdDate).toLocaleString("en-US", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			}),
			snapshotId: notif.snapshotId,
		}))
	);

	const renderItem = ({ item: notif }: { item: (typeof notifications)[0] }) => (
		<View style={[styles.notificationCard, notif.unread ? styles.unread : undefined]}>
			<View style={styles.row}>
				<List.Icon
					icon={notif.unread ? "email" : "email-open"}
					color={notif.unread ? "#1976d2" : "#888"}
					style={{ margin: 0, marginRight: 8 }}
				/>
				<View style={styles.metricsRow}>
					{notif.metrics.map((metric) => {
						const metricInfo = metricsAux.find(
							(m) =>
								metric.includes(m.key) ||
								metric.includes(m.label.toLowerCase())
						);
						return metricInfo ? (
							<View
								key={metricInfo.key}
								style={[
									styles.metricIconWrapper,
									{ backgroundColor: metricInfo.bgColor },
								]}
							>
								<Avatar.Icon
									icon={metricInfo.icon}
									size={22}
									style={{
										backgroundColor: "transparent",
									}}
									color={metricInfo.iconColor}
								/>
								<Text style={styles.metricLabel}>{metricInfo.label}</Text>
							</View>
						) : null;
					})}
				</View>
				<View style={{ flex: 1, alignItems: "flex-end" }}>
					<Text style={styles.date}>{notif.date}</Text>
				</View>
			</View>
			<View style={styles.bottomRow}>
				<View style={{ flex: 1 }} />
				<Text
					style={styles.link}
					onPress={() => router.gotoSnapshot(notif.snapshotId)}
				>
					View snapshot
				</Text>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<Text variant="titleLarge" style={styles.header}>
				Notifications
			</Text>
			{notifications.length === 0 ? (
				<Text style={{ color: "#888", textAlign: "center", marginTop: 32 }}>
					No notifications yet.
				</Text>
			) : (
				<FlatList
					data={notifications}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					contentContainerStyle={{ paddingBottom: 24 }}
					ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
	topRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		marginBottom: 4,
	},
	header: {
		marginBottom: 16,
		fontWeight: "bold",
	},
	notificationCard: {
		backgroundColor: "#ffffff",
		borderRadius: 14,
		padding: 16,
		shadowColor: "#000",
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 2,
	},
	unread: {
		backgroundColor: "#e3f2fd",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	metricsRow: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
	},
	bottomRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		marginTop: 10,
	},
	description: {
		fontSize: 15,
		color: "#222",
		marginBottom: 4,
	},

	metricIconWrapper: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 16,
		paddingHorizontal: 8,
		paddingVertical: 2,
		marginRight: 8,
		marginBottom: 4,
	},
	metricLabel: {
		marginLeft: 4,
		fontSize: 13,
		color: "#444",
	},
	date: {
		color: "#888",
		fontSize: 12,
	},
	link: {
		color: "#1976d2",
		fontSize: 13,
		fontWeight: "bold",
	},
});
