import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Card, Text, Badge, Avatar } from "react-native-paper";
import { useRoutes } from "../../utils/routes";
import { useStateContext } from "../../context/StateContext";

export default function GroupsPage() {
	const router = useRoutes();

	const { groups } = useStateContext();

	return (
		<View style={styles.container}>
			<Text variant="titleLarge" style={styles.header}>
				Aquarium Groups
			</Text>
			<FlatList
				data={groups}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<Card
						style={styles.card}
						mode="elevated"
						onPress={() => {
							router.gotoGroup(item);
						}}
					>
						<View style={styles.cardContent}>
							<Avatar.Icon
								icon="fish"
								size={48}
								style={[
									styles.avatar,
									{ backgroundColor: item.color || "#1976d2" },
								]}
								color="#fff"
							/>
							<View style={styles.infoContainer}>
								<Text variant="titleMedium" style={styles.groupName}>
									{item.name}
								</Text>
								<Text variant="bodySmall" style={styles.groupDesc}>
									{item.description}
								</Text>
								<View style={styles.badgeRow}>
									<Badge style={styles.badge}>
										{item.numberOfAquariums}
									</Badge>
									<Text style={styles.aquariumLabel}>Aquariums</Text>
								</View>
							</View>
						</View>
					</Card>
				)}
				contentContainerStyle={{ paddingBottom: 24 }}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f5f7fa",
	},
	header: {
		marginBottom: 18,
		fontWeight: "bold",
	},
	card: {
		marginBottom: 18,
		borderRadius: 16,
		elevation: 4,
		backgroundColor: "#fff",
	},
	cardContent: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
	},
	avatar: {
		backgroundColor: "#1976d2",
		marginRight: 16,
	},
	infoContainer: {
		flex: 1,
	},
	groupName: {
		fontWeight: "bold",
		fontSize: 18,
		marginBottom: 2,
	},
	groupDesc: {
		color: "#666",
		marginBottom: 8,
	},
	badgeRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	badge: {
		backgroundColor: "#1976d2",
		color: "#fff",
		marginRight: 6,
		fontSize: 14,
	},
	aquariumLabel: {
		color: "#888",
		fontSize: 13,
	},
});
