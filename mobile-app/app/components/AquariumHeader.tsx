import React, { useState } from "react";
import { Dimensions, View, StyleSheet, Modal, ScrollView } from "react-native";
import { Text, Avatar, Button, Menu, IconButton } from "react-native-paper";
import { useRoutes } from "../utils/routes";
import {
	useDeleteAquarium,
	useEditAquarium,
	useUpdateThresholds,
} from "../utils/services/AquariumService";
import { Aquarium, EditAquarium, updateThresholdsRequest } from "../types/Aquarium";
import EditAquariumForm from "./EditAquariumForm";
import EditThresholdsForm from "./EditThresholdsForm";

interface AquariumHeaderProps {
	aquarium: Aquarium;
}

export default function AquariumHeader({ aquarium }: AquariumHeaderProps) {
	const router = useRoutes();

	const { id: aquariumId, name, location, ownerUsername, createdDate } = aquarium;

	const [menuVisible, setMenuVisible] = useState(false);
	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);

	const [editModalVisible, setEditModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [editThresholdsModalVisible, seteditThresholdsModalVisible] = useState(false);

	const { mutate: deleteAquarium } = useDeleteAquarium();
	const { mutate: updateAquarium } = useEditAquarium();
	const { mutate: updateThresholds } = useUpdateThresholds();

	const handleEditAquarium = (data: EditAquarium) => {
		console.log("Edit aquarium:", data);
		updateAquarium(data, {
			onSuccess: () => {
				setEditModalVisible(false);
			},
			onError: () => {
				setEditModalVisible(false);
			},
		});
		setEditModalVisible(false);
	};

	const handleDeleteAquarium = () => {
		deleteAquarium(aquariumId, {
			onSuccess: () => {
				setDeleteModalVisible(false);
				router.gotoHome();
			},
			onError: () => {
				setDeleteModalVisible(false);
			},
		});
	};

	//get device height
	const deviceHeight = Dimensions.get("window").height;

	const handleEditThresholds = (data: updateThresholdsRequest) => {
		console.log("Updating thresholds:", data);
		updateThresholds(data);

		seteditThresholdsModalVisible(false);
	};

	const dateObj = new Date(createdDate);
	const formattedDate = dateObj.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
	return (
		<View style={styles.headerContainer}>
			<View style={styles.headerRow}>
				<Avatar.Icon icon="fish" size={52} style={styles.avatarMain} color="#fff" />
				<View style={{ flex: 1 }}>
					<Text style={styles.headerTitle}>{name}</Text>
					<Text style={styles.headerSubtitle}>{location}</Text>
				</View>
			</View>
			<View style={styles.headerInfoRow}>
				<Avatar.Icon
					icon="account"
					size={28}
					style={styles.headerInfoIcon}
					color="#fff"
				/>
				<Text style={styles.headerInfoText}>{ownerUsername}</Text>
				<Avatar.Icon
					icon="calendar"
					size={28}
					style={styles.headerInfoIcon}
					color="#fff"
				/>
				<Text style={styles.headerInfoText}>{formattedDate}</Text>
			</View>
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
			>
				<Menu.Item
					onPress={() => {
						closeMenu();
						setEditModalVisible(true);
					}}
					title="Edit Aquarium"
					leadingIcon="pencil"
				/>
				<Menu.Item
					onPress={() => {
						closeMenu();
						seteditThresholdsModalVisible(true);
					}}
					title="Edit Thresholds"
					leadingIcon="cog"
				/>
				<Menu.Item
					onPress={() => {
						closeMenu();
						setDeleteModalVisible(true);
					}}
					title="Delete Aquarium"
					leadingIcon="trash-can"
					titleStyle={{ color: "#e53935" }}
				/>
			</Menu>

			{/* Delete Aquarium Modal */}
			<Modal
				visible={deleteModalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setDeleteModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Delete Aquarium</Text>
						<Text style={{ marginBottom: 20, textAlign: "center" }}>
							Are you sure you want to delete this aquarium?
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
								onPress={handleDeleteAquarium}
								style={[styles.modalButton, { backgroundColor: "#e53935" }]}
							>
								Delete
							</Button>
						</View>
					</View>
				</View>
			</Modal>

			{/* Edit Aquarium Modal */}
			<Modal
				visible={editModalVisible}
				animationType="fade"
				transparent={true}
				onRequestClose={() => setEditModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Edit Aquarium</Text>
						<EditAquariumForm
							name={name}
							location={location}
							onSubmit={(data: { name: string; location: string }) =>
								handleEditAquarium({ id: aquariumId, ...data })
							}
						/>
						<Button
							mode="outlined"
							onPress={() => setEditModalVisible(false)}
							style={styles.modalButton}
						>
							Cancel
						</Button>
					</View>
				</View>
			</Modal>

			{/* Edit Thresholds Modal */}
			<Modal
				visible={editThresholdsModalVisible}
				animationType="fade"
				transparent={true}
				onRequestClose={() => seteditThresholdsModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Edit Thresholds</Text>
						<ScrollView style={{ maxHeight: deviceHeight * 0.8 }}>
							<EditThresholdsForm
								aquariumId={aquariumId}
								onSubmit={handleEditThresholds}
								initialValues={aquarium.threshold}
								onCancel={() => seteditThresholdsModalVisible(false)}
							/>
						</ScrollView>
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
		backgroundColor: "#f5f5f5",
		justifyContent: "flex-start",
	},
	headerContainer: {
		backgroundColor: "#1976d2",
		borderRadius: 18,
		padding: 18,
		marginBottom: 16,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	avatarMain: {
		backgroundColor: "#1565c0",
		marginRight: 14,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
	},
	headerSubtitle: {
		fontSize: 16,
		color: "#e3e3e3",
	},
	headerInfoRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 2,
	},
	headerInfoIcon: {
		backgroundColor: "#2196f3",
		marginRight: 6,
	},
	headerInfoText: {
		color: "#fff",
		fontSize: 15,
		marginRight: 18,
	},
	bombStatusContainer: {
		alignItems: "center",
		marginVertical: 16,
	},
	thresholdsContainer: {
		marginTop: 12,
		marginBottom: 8,
	},
	thresholdsTitle: {
		fontSize: 17,
		fontWeight: "bold",
		color: "#444",
		marginBottom: 8,
		marginLeft: 4,
	},
	verticalBarIcon: {
		marginBottom: 6,
		backgroundColor: "#1976d2",
	},
	verticalBarLabel: {
		fontWeight: "bold",
		fontSize: 13,
		color: "#333",
		marginBottom: 6,
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
