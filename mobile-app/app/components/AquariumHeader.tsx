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
import ShareAquariumForm from "./ShareAquariumForm";
import { User } from "../types/User";

interface AquariumHeaderProps {
	aquarium: Aquarium;
	user: User;
}

export default function AquariumHeader({ aquarium, user }: AquariumHeaderProps) {
	const router = useRoutes();

	const { id: aquariumId, name, location, ownerUsername, createdDate } = aquarium;

	const [menuVisible, setMenuVisible] = useState(false);
	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);

	const [editModalVisible, setEditModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [editThresholdsModalVisible, seteditThresholdsModalVisible] = useState(false);
	const [shareModalVisible, setShareModalVisible] = useState(false);

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
			{/* Top Row: Icon + Name/Location + Menu */}
			<View style={styles.headerTopRow}>
				<View style={styles.avatarWrapper}>
					<Avatar.Icon
						icon="fish"
						size={56}
						style={styles.avatarMain}
						color="#fff"
					/>
				</View>
				<View style={{ flex: 1, justifyContent: "center" }}>
					<Text style={styles.headerTitle}>{name}</Text>
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
					contentStyle={{
						borderRadius: 14,
						backgroundColor: "#fff",
						minWidth: 200,
						elevation: 6,
						paddingVertical: 4,
					}}
				>
					{user.nickname === ownerUsername && (
						<>
							<Menu.Item
								onPress={() => {
									closeMenu();
									setEditModalVisible(true);
								}}
								title="Customize"
								leadingIcon="pencil"
								titleStyle={{ fontWeight: "bold", color: "#1976d2" }}
							/>
							<Menu.Item
								onPress={() => {
									closeMenu();
									seteditThresholdsModalVisible(true);
								}}
								title="Thresholds"
								leadingIcon="cog"
								titleStyle={{ color: "#1976d2", fontWeight: "bold" }}
							/>
							<View
								style={{
									height: 1,
									backgroundColor: "#eee",
									marginVertical: 4,
								}}
							/>
						</>
					)}

					<Menu.Item
						onPress={() => {
							router.gotoAquariumHistory(aquarium.id);
						}}
						title="History"
						leadingIcon="history"
						titleStyle={{ color: "#444", fontWeight: "bold" }}
					/>

					{user.nickname === ownerUsername && (
						<>
							<View
								style={{
									height: 1,
									backgroundColor: "#eee",
									marginVertical: 4,
								}}
							/>
							<Menu.Item
								onPress={() => {
									closeMenu();
									setShareModalVisible(true);
								}}
								title="Share"
								leadingIcon="share"
								titleStyle={{ fontWeight: "bold", color: "#444" }}
							/>
						</>
					)}

					{user.nickname === ownerUsername && (
						<>
							<View
								style={{
									height: 1,
									backgroundColor: "#eee",
									marginVertical: 4,
								}}
							/>

							<Menu.Item
								onPress={() => {
									closeMenu();
									setDeleteModalVisible(true);
								}}
								title="Delete"
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
						</>
					)}
				</Menu>
			</View>

			{/* Info Row: Owner & Date */}
			<View style={styles.infoRow}>
				<View style={styles.infoItem}>
					<Avatar.Icon
						icon="map-marker"
						size={24}
						style={styles.infoIcon}
						color="#d2fafd"
					/>
					<Text style={styles.headerSubtitle}>{location}</Text>
				</View>
				<View style={styles.infoItem}>
					<Avatar.Icon
						icon="account"
						size={24}
						style={styles.infoIcon}
						color="#d2fafd"
					/>
					<Text style={styles.headerSubtitle}>{ownerUsername}</Text>
				</View>
				<View style={styles.infoItem}>
					<Avatar.Icon
						icon="calendar"
						size={24}
						style={styles.infoIcon}
						color="#d2fafd"
					/>
					<Text style={styles.headerSubtitle}>{formattedDate}</Text>
				</View>
			</View>

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
						<ScrollView style={{ maxHeight: deviceHeight * 0.8 }}>
							<EditAquariumForm
								name={name}
								location={location}
								onSubmit={(data: { name: string; location: string }) =>
									handleEditAquarium({ id: aquariumId, ...data })
								}
								onCancel={() => setEditModalVisible(false)}
							/>
						</ScrollView>
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

			{/* Share Aquarium Modal */}
			<Modal
				visible={shareModalVisible}
				animationType="fade"
				transparent={true}
				onRequestClose={() => setShareModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Share Aquarium with</Text>
						<ScrollView style={{ maxHeight: deviceHeight * 0.8 }}>
							<ShareAquariumForm
								onSubmit={() => {
									setShareModalVisible(false);
								}}
								aquariumId={aquariumId}
								onCancel={() => setShareModalVisible(false)}
							/>
						</ScrollView>
						<Button
							mode="outlined"
							onPress={() => setShareModalVisible(false)}
							style={styles.modalButton}
						>
							Close
						</Button>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	headerCard: {
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 22,
		marginBottom: 18,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 3,
	},
	headerTopRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	avatarWrapper: {
		marginRight: 18,
	},
	headerTitle: {
		fontSize: 22,
		fontWeight: "700",
		color: "#ffffff",
		letterSpacing: 0.2,
	},
	headerSubtitle: {
		fontSize: 15,
		color: "#d2fafd",
		marginTop: 2,
	},
	infoRow: {
		flexDirection: "row",
		flexWrap: "wrap", // Allow wrapping
		justifyContent: "flex-start",
		alignItems: "center",
		gap: 12, // Reduce gap for compactness
		marginTop: 6,
	},
	infoItem: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 0, // Remove fixed margin
		marginBottom: 4, // Add a little space for wrapped rows
		maxWidth: "100%",
		flexShrink: 1,
	},
	infoIcon: {
		backgroundColor: "transparent",
		marginRight: 4,
	},
	infoText: {
		fontSize: 14,
		color: "#444",
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
	avatarMain: {
		backgroundColor: "#1565c0",
		marginRight: 14,
	},
	headerContainer: {
		backgroundColor: "#1976d2",
		borderRadius: 18,
		padding: 18,
		marginBottom: 16,
	},
});
