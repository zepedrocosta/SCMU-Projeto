import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Modal, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text, Avatar, Badge, Button, Checkbox } from "react-native-paper";
import { useStateContext } from "../../../context/StateContext";
import { useRoutes } from "../../../utils/routes";
import ListAquariums from "../../../components/ListAquariums";
import {
	useAddAquariumsToGroup,
	useRemoveAquariumFromGroup,
} from "../../../utils/services/GroupService";
import { Aquarium } from "../../../types/Aquarium";

export default function GroupDetail() {
	const router = useRoutes();

	const { id, name, description, numberOfAquariums, color, aquariumsIds } =
		useLocalSearchParams();
	const groupColor = Array.isArray(color) ? color[0] : color;

	const [aquariumCount, setAquariumCount] = useState<number>(
		Number(Array.isArray(numberOfAquariums) ? numberOfAquariums[0] : numberOfAquariums)
	);

	const { aquariums } = useStateContext();

	const [groupAquariums, setGroupAquariums] = useState<Aquarium[]>(
		aquariums.filter((aquarium) => aquariumsIds.includes(aquarium.id))
	);

	const { mutate: addAquariumsToGroup } = useAddAquariumsToGroup();
	const { mutate: removeAquariumFromGroup } = useRemoveAquariumFromGroup();

	// Modal state
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedAquariumsIds, setSelectedAquariumsIds] = useState<string[]>(
		groupAquariums.map((aq) => aq.id)
	);

	const handleToggleAquarium = (id: string) => {
		setSelectedAquariumsIds((prev) =>
			prev.includes(id) ? prev.filter((aqId) => aqId !== id) : [...prev, id]
		);
	};

	const handleCancel = () => {
		setSelectedAquariumsIds(groupAquariums.map((aq) => aq.id));
		setModalVisible(false);
	};

	const handleSave = () => {
		const originalIds = groupAquariums.map((aq) => aq.id);
		const addedIds = selectedAquariumsIds.filter((id) => !originalIds.includes(id));
		const removedIds = originalIds.filter((id) => !selectedAquariumsIds.includes(id));
		onSubmit(addedIds, removedIds);
		setModalVisible(false);
	};

	const onSubmit = (addedIds: string[], removedIds: string[]) => {
		// If nothing changed, do nothing
		if (addedIds.length === 0 && removedIds.length === 0) {
			console.log("No changes to save.");
			return;
		}

		let completed = 0;
		const total = (addedIds.length > 0 ? 1 : 0) + (removedIds.length > 0 ? 1 : 0);

		const checkDone = () => {
			completed++;
			if (completed === total) {
				// Optionally refetch or update local state here
			}
		};

		if (addedIds.length > 0) {
			addAquariumsToGroup(
				{
					groupId: id as string,
					aquariumIds: addedIds,
				},
				{
					onSuccess: () => {
						console.log("Added aquariums:", addedIds);
						checkDone();
						setGroupAquariums((prev) => [
							...prev,
							...aquariums.filter((aq) => addedIds.includes(aq.id)),
						]);
						setAquariumCount(groupAquariums.length);
					},
					onError: checkDone,
				}
			);
		}

		if (removedIds.length > 0) {
			removeAquariumFromGroup(
				{
					groupId: id as string,
					aquariumIds: removedIds,
				},
				{
					onSuccess: () => {
						console.log("Removed aquariums:", removedIds);
						checkDone();
						setGroupAquariums((prev) =>
							prev.filter((aq) => !removedIds.includes(aq.id))
						);
						setAquariumCount(groupAquariums.length);
					},
					onError: checkDone,
				}
			);
		}
	};

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

			<Button
				mode="contained"
				style={{
					marginTop: 16,
					marginBottom: 20,
					borderRadius: 8,
					alignSelf: "center",
				}}
				onPress={() => {
					setSelectedAquariumsIds(groupAquariums.map((aq) => aq.id));
					setModalVisible(true);
				}}
			>
				Add/Remove Aquariums
			</Button>

			{/* Aquariums Section */}
			<ListAquariums aquariums={groupAquariums} />

			{/* Modal for selecting aquariums */}
			<Modal
				visible={modalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={handleCancel}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Select Aquariums</Text>
						<ScrollView style={{ maxHeight: 300 }}>
							{aquariums.map((aq) => (
								<View key={aq.id} style={styles.checkboxRow}>
									<Checkbox
										status={
											selectedAquariumsIds.includes(aq.id)
												? "checked"
												: "unchecked"
										}
										onPress={() => handleToggleAquarium(aq.id)}
									/>
									<Text style={styles.checkboxLabel}>{aq.name}</Text>
								</View>
							))}
						</ScrollView>
						<View style={styles.modalButtonRow}>
							<Button
								mode="outlined"
								onPress={handleCancel}
								style={styles.modalButton}
							>
								Cancel
							</Button>
							<Button
								mode="contained"
								onPress={handleSave}
								style={styles.modalButton}
							>
								Save
							</Button>
						</View>
					</View>
				</View>
			</Modal>
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
	checkboxRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	checkboxLabel: {
		fontSize: 16,
	},
	modalButtonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 24,
		width: "100%",
	},
	modalButton: {
		flex: 1,
		marginHorizontal: 8,
	},
});
