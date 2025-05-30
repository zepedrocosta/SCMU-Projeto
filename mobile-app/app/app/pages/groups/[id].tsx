import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text, Avatar, Badge } from "react-native-paper";
import { useStateContext } from "../../../context/StateContext";
import { useRoutes } from "../../../utils/routes";
import ListAquariums from "../../../components/ListAquariums";

export default function GroupDetail() {
	const router = useRoutes();

	const { name, description, numberOfAquariums, color, aquariumsIds } =
		useLocalSearchParams();
	const groupColor = Array.isArray(color) ? color[0] : color;
	const aquariumCount = Array.isArray(numberOfAquariums)
		? numberOfAquariums[0]
		: numberOfAquariums;
	const { aquariums } = useStateContext();

	const groupAquariums = aquariums.filter((aquarium) => aquariumsIds.includes(aquarium.id));

	return (
		<View style={styles.container}>
			<View style={[styles.header, { backgroundColor: groupColor }]}>
				<Avatar.Icon icon="fish" size={48} style={styles.avatar} color="#fff" />
				<Text variant="titleLarge" style={styles.groupNameHeader}>
					{name}
				</Text>
			</View>
			<View style={styles.infoSection}>
				<Text variant="bodyMedium" style={styles.groupDesc}>
					{description}
				</Text>
				<View style={styles.badgeRow}>
					<Badge style={[styles.badge, { backgroundColor: groupColor }]}>
						{aquariumCount}
					</Badge>
					<Text style={styles.aquariumLabel}>Aquariums</Text>
				</View>
			</View>

			{/* Aquariums Section */}
			<ListAquariums aquariums={groupAquariums} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f7fa",
		paddingTop: StatusBar.currentHeight || 32,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		height: 72,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
		marginBottom: 8,
		paddingHorizontal: 20,
		paddingTop: 12,
	},
	avatar: {
		backgroundColor: "transparent",
		marginRight: 14,
	},
	groupNameHeader: {
		fontWeight: "bold",
		fontSize: 22,
		color: "#fff",
	},
	infoSection: {
		paddingHorizontal: 32,
		paddingTop: 20,
		alignItems: "center",
	},
	groupDesc: {
		color: "#666",
		marginBottom: 18,
		fontSize: 16,
		textAlign: "center",
	},
	badgeRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	badge: {
		color: "#fff",
		marginRight: 8,
		fontSize: 16,
	},
	aquariumLabel: {
		color: "#888",
		fontSize: 15,
	},

	headerSection: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1976d2",
		padding: 20,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
		marginBottom: 16,
	},
	headerIcon: {
		backgroundColor: "#1565c0",
		marginRight: 16,
	},
	greeting: {
		color: "#fff",
		fontWeight: "bold",
	},
	subGreeting: {
		color: "#e3f2fd",
	},
	section: {
		paddingHorizontal: 20,
		marginBottom: 8,
	},
	sectionTitle: {
		fontWeight: "bold",
		marginBottom: 8,
	},
	searchBar: {
		marginBottom: 8,
	},
	listItem: {
		backgroundColor: "#fff",
		marginBottom: 8,
		borderRadius: 8,
		elevation: 1,
	},
	listAvatar: {
		backgroundColor: "#1976d2",
	},
	emptyText: {
		color: "#888",
		textAlign: "center",
		marginTop: 16,
	},
	addButtonContainer: {
		padding: 20,
	},
	addButton: {
		backgroundColor: "#1976D2",
		borderRadius: 25,
		paddingVertical: 12,
		alignSelf: "center",
		width: "100%",
	},
});
