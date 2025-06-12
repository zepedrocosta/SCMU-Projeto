import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { List, Text, Avatar } from "react-native-paper";
import { useRoutes } from "../../utils/routes";
import { useStateContext } from "../../context/StateContext";
import { EVENTS } from "../../context/reducer";

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
	const { aquariums, dispatch } = useStateContext();
	const router = useRoutes();

	const notifications = aquariums
		.flatMap((aq) =>
			aq.notifications.map((notif) => ({
				id: notif.notificationId,
				aquarium: aq,
				metrics: parseMetrics(notif.message),
				unread: notif.unread,
				date: new Date(notif.createdDate).toLocaleString("en-GB", {
					year: "2-digit",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
				}),
				snapshotId: notif.snapshotId,
			}))
		)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const renderItem = ({ item: notif }: { item: (typeof notifications)[0] }) => (
		<View style={[styles.notificationCard, notif.unread && styles.unread]}>
			<View style={styles.topRow}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Avatar.Icon
						icon="fishbowl"
						size={24}
						style={{ backgroundColor: "#e3f2fd", marginRight: 6 }}
						color="#1976d2"
					/>
					<Text style={styles.aquariumName}>{notif.aquarium.name}</Text>
				</View>
				<Text style={styles.date}>{notif.date}</Text>
			</View>
			<View style={styles.mainContent}>
				<View style={styles.leftSection}>
					<List.Icon
						icon={notif.unread ? "email" : "email-open"}
						color={notif.unread ? "#1976d2" : "#888"}
						style={{ margin: 0 }}
					/>
				</View>
				<View style={styles.metricsGrid}>
					{notif.metrics.map((metric) => {
						const metricInfo = metricsAux.find(
							(m) =>
								metric.includes(m.key) ||
								metric.includes(m.label.toLowerCase())
						);
						return metricInfo ? (
							<View key={metricInfo.key} style={styles.metricWrapper}>
								<Avatar.Icon
									icon={metricInfo.icon}
									size={22}
									style={{ backgroundColor: metricInfo.bgColor }}
									color={metricInfo.iconColor}
								/>
								<Text style={styles.metricLabel}>{metricInfo.label}</Text>
							</View>
						) : null;
					})}
				</View>
			</View>
			<View style={styles.bottomRow}>
				<Text
					style={styles.link}
					onPress={() => {
						router.gotoSnapshot(notif.snapshotId);
						dispatch({
							type: EVENTS.MARK_AS_READ,
							payload: notif.id,
						});
					}}
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
		backgroundColor: "#f5f5f5",
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
		shadowOpacity: 0.08,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
	},
	unread: {
		backgroundColor: "#e3f2fd",
		borderWidth: 1,
		borderColor: "#1976d2",
	},
	topRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	aquariumName: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	date: {
		color: "#888",
		fontSize: 12,
	},
	mainContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	leftSection: {
		marginRight: 16,
	},
	metricsGrid: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
	},
	metricWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1a1818",
		borderRadius: 999,
		paddingHorizontal: 12,
		paddingVertical: 6,
		marginRight: 8,
		marginBottom: 8,
		alignSelf: "flex-start",
	},
	metricLabel: {
		marginLeft: 6,
		fontSize: 13,
		fontWeight: "bold",
		color: "#ffffff",
	},
	bottomRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		marginTop: 12,
	},
	link: {
		color: "#1976d2",
		fontSize: 14,
		fontWeight: "bold",
	},
});
