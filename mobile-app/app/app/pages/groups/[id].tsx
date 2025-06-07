import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Modal, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text, Avatar, Badge, Button, Checkbox, Menu, IconButton } from "react-native-paper";
import { useStateContext } from "../../../context/StateContext";
import ListAquariums from "../../../components/ListAquariums";
import {
	useAddAquariumsToGroup,
	useDeleteGroup,
	useRemoveAquariumFromGroup,
} from "../../../utils/services/GroupService";
import { Aquarium } from "../../../types/Aquarium";
import { useRoutes } from "../../../utils/routes";

export default function GroupDetail() {
	const { id } = useLocalSearchParams();
	const { groups, aquariums } = useStateContext();
	const router = useRoutes();
	const group = groups.find((aq) => aq.id === id);

	if (!group) {
		return (
			<View style={styles.container}>
				<Text variant="titleLarge">Group not found</Text>
			</View>
		);
	}

	const [menuVisible, setMenuVisible] = useState(false);
	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);

	const [groupAquariums, setGroupAquariums] = useState<Aquarium[]>(group.aquariums || []);

	const { mutate: addAquariumsToGroup } = useAddAquariumsToGroup();
	const { mutate: removeAquariumFromGroup } = useRemoveAquariumFromGroup();
	const { mutate: deleteGroup } = useDeleteGroup();

	// Modal state
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedAquariumsIds, setSelectedAquariumsIds] = useState<string[]>(
		groupAquariums.map((aq) => aq.id)
	);

	const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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
					},
					onError: checkDone,
				}
			);
		}
	};

	const handleDeleteGroup = () => {
		deleteGroup(group.id, {
			onSuccess: () => {
				setDeleteModalVisible(false);
				router.gotoGroups();
			},
			onError: () => {
				setDeleteModalVisible(false);
				// Optionally show an error message
			},
		});
	};

	return (
		<View style={styles.container}>
			<View style={[styles.header, { backgroundColor: group.color }]}>
				<Avatar.Icon icon="fish" size={48} style={styles.avatar} color="#fff" />
				<Text variant="titleLarge" style={styles.groupNameHeader}>
					{group.name}
				</Text>
				<Menu
					visible={menuVisible}
					onDismiss={closeMenu}
					anchor={
						<IconButton
							icon="dots-vertical"
							iconColor="#000000"
							size={28}
							onPress={openMenu}
						/>
					}
					contentStyle={{
						borderRadius: 14,
						backgroundColor: "#fff",
						minWidth: 200,
						elevation: 6,
						paddingVertical: 4,
					}}
				>
					<Menu.Item
						onPress={() => {
							closeMenu();
							setDeleteModalVisible(true);
						}}
						title="Delete Group"
						leadingIcon={() => (
							<Avatar.Icon
								icon="trash-can"
								size={28}
								color="#e53935"
								style={{ backgroundColor: "transparent" }}
							/>
						)}
						titleStyle={{ color: "#e53935", fontWeight: "bold" }}
					/>
				</Menu>

				{/* Delete Group Modal */}
				<Modal
					visible={deleteModalVisible}
					transparent
					animationType="fade"
					onRequestClose={() => setDeleteModalVisible(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>Delete Group</Text>
							<Text style={{ marginBottom: 20, textAlign: "center" }}>
								Are you sure you want to delete this group?
							</Text>
							<View style={styles.modalButtonRow}>
								<Button
									mode="outlined"
									onPress={() => setDeleteModalVisible(false)}
									style={styles.modalButton}
								>
									Cancel
								</Button>
								<Button
									mode="contained"
									onPress={handleDeleteGroup}
									style={[
										styles.modalButton,
										{ backgroundColor: "#e53935" },
									]}
								>
									Delete
								</Button>
							</View>
						</View>
					</View>
				</Modal>
			</View>
			<View style={styles.infoSection}>
				<View style={styles.badgeRow}>
					<Badge style={[styles.badge, { backgroundColor: group.color }]}>
						{groupAquariums.length}
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
				animationType="fade"
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
		width: "90%",
		maxWidth: 400,
		maxHeight: "80%",
		alignItems: "stretch",
		justifyContent: "flex-start",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 16,
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

	// modalOverlay: {
	// 	flex: 1,
	// 	backgroundColor: "rgba(0,0,0,0.3)",
	// 	justifyContent: "center",
	// 	alignItems: "center",
	// },
	// modalContent: {
	// 	backgroundColor: "#fff",
	// 	borderRadius: 16,
	// 	padding: 24,
	// 	width: "90%",
	// 	maxWidth: 400,
	// 	maxHeight: "80%",
	// 	alignItems: "stretch",
	// 	justifyContent: "flex-start",
	// },
	// modalTitle: {
	// 	fontSize: 20,
	// 	fontWeight: "bold",
	// 	marginBottom: 16,
	// },
	// modalButtonRow: {
	// 	flexDirection: "row",
	// 	justifyContent: "space-between",
	// 	marginTop: 24,
	// 	width: "100%",
	// },
	// modalButton: {
	// 	flex: 1,
	// 	marginHorizontal: 8,
	// },
	checkboxRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	checkboxLabel: {
		fontSize: 16,
	},
});
