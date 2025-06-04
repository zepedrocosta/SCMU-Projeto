import React, { useState } from "react";
import { View, StyleSheet, FlatList, Modal } from "react-native";
import { Card, Text, Badge, Avatar, Button } from "react-native-paper";
import { useRoutes } from "../../utils/routes";
import { useStateContext } from "../../context/StateContext";
import AddGroupForm from "../../components/AddGroupForm"; // <-- import your form
import { useAddGroup } from "../../utils/services/GroupService";

export default function GroupsPage() {
	const router = useRoutes();
	const { groups } = useStateContext();

	const [modalVisible, setModalVisible] = useState(false);

	const { mutate } = useAddGroup();

	const handleAddGroup = (data: { name: string }) => {
		console.log("Add group:", data.name);
		mutate(data.name, {});
		setModalVisible(false);
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<Text variant="titleLarge" style={styles.header}>
					Aquarium Groups
				</Text>
				<Button
					mode="contained"
					onPress={() => setModalVisible(true)}
					style={styles.addButtonHeader}
					labelStyle={styles.addButtonHeaderLabel}
					icon="plus"
					compact
				>
					Add
				</Button>
			</View>
			<FlatList
				data={groups}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<Card
						style={styles.card}
						mode="elevated"
						onPress={() => {
							router.gotoGroup(item.id);
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

			{/* Add Group Modal */}
			<Modal
				visible={modalVisible}
				animationType="fade"
				transparent={true}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Add Group</Text>
						<AddGroupForm onSubmit={handleAddGroup} />
						<Button
							mode="outlined"
							onPress={() => setModalVisible(false)}
							style={styles.modalButton}
						>
							Cancel
						</Button>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f5f7fa",
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
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 18,
	},
	header: {
		fontWeight: "bold",
		fontSize: 22,
	},
	addButtonHeader: {
		backgroundColor: "#1976D2",
		borderRadius: 20,
		paddingHorizontal: 14,
		minWidth: 0,
		elevation: 0,
	},
	addButtonHeaderLabel: {
		fontSize: 15,
		fontWeight: "bold",
		color: "#fff",
		textTransform: "none",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 24,
		width: "85%",
		maxWidth: 400,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 16,
	},
	modalButton: {
		marginTop: 8,
		alignSelf: "stretch",
	},
});
