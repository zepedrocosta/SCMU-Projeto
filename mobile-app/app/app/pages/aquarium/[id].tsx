import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Dimensions, View, StyleSheet, Modal, ScrollView } from "react-native";
import { Text, Avatar, ActivityIndicator, Button, Menu, IconButton } from "react-native-paper";
import { useStateContext } from "../../../context/StateContext";
import ThresholdBar from "../../../components/ThresholdBar";
import {
	useChangeWaterPumpStatus,
	useDeleteAquarium,
	useUpdateThresholds,
} from "../../../utils/services/AquariumService";
import { updateThresholdsRequest } from "../../../types/Aquarium";
import EditThresholdsForm from "../../../components/EditThresholdsForm";
import { useRoutes } from "../../../utils/routes";

// ####### WaterPump #######
const BombStatus = ({
	isWorking,
	onToggle,
	isPending = false,
}: {
	isWorking: boolean;
	onToggle?: (value: boolean) => void;
	isPending?: boolean;
}) => (
	<View style={styles.bombStatusContainer}>
		<View
			style={{ justifyContent: "center", alignItems: "center", height: 56, width: 56 }}
		>
			{isPending ? (
				<ActivityIndicator
					size={36}
					color="#1976d2"
					style={{
						alignSelf: "center",
					}}
				/>
			) : (
				<Avatar.Icon
					icon={"power"}
					size={56}
					style={{
						backgroundColor: isWorking ? "#43a047" : "#e5383546",
						marginRight: 0,
					}}
					color="#fff"
					onTouchEnd={() => onToggle && onToggle(!isWorking)}
				/>
			)}
		</View>
		<View>
			<Text>Bomb Status</Text>
			<Text style={[{ color: isWorking ? "#43a047" : "#e53935" }]}>
				{isWorking ? "Working" : "Not Working"}
			</Text>
		</View>
	</View>
);

// ####### AquariumHeader #######
const AquariumHeader = ({
	aquariumId,
	name,
	location,
	ownerUsername,
	createdDate,
}: {
	aquariumId: string;
	name: string;
	location: string;
	ownerUsername: string;
	createdDate: string;
}) => {
	const router = useRoutes();

	const [menuVisible, setMenuVisible] = useState(false);
	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);

	const [editModalVisible, setEditModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);

	const { mutate: deleteAquarium } = useDeleteAquarium();

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
					title="Edit Aquarium Name"
					leadingIcon="pencil"
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
		</View>
	);
};

const ThresholdBarWithLabels = ({
	icon,
	iconColor,
	label,
	min,
	max,
	unit,
	bgColor,
	...barProps
}: any) => (
	<View style={{ alignItems: "center", width: "100%" }}>
		{/* Icon with circle and label below the bar */}
		<View style={{ alignItems: "center", marginTop: 8 }}>
			<Text style={styles.verticalBarLabel}>{label}</Text>

			<Avatar.Icon
				icon={icon}
				size={36}
				style={[styles.verticalBarIcon, { backgroundColor: iconColor }]}
				color="#fff"
			/>
		</View>
		{/* Max value on top */}
		<Text style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>
			{max}
			{unit ? ` ${unit}` : ""}
		</Text>
		{/* The bar itself */}
		<ThresholdBar bgColor={bgColor} max={max} min={min} currentValue={10} />

		{/* Min value below */}
		<Text style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
			{min}
			{unit ? ` ${unit}` : ""}
		</Text>
	</View>
);

const ThresholdsSection = ({ threshold }: { threshold: any }) => {
	const screenWidth = Dimensions.get("window").width;
	const horizontalPadding = 32;
	const spacing = 12;
	const barCount = 5;
	const barWidth = (screenWidth - horizontalPadding - (barCount - 1) * spacing) / barCount;

	const data = [
		{
			key: "temp",
			icon: "thermometer",
			iconColor: "#d23519",
			bgColor: "#e3f2fd",
			label: "Temp",
			min: threshold?.minTemperature,
			max: threshold?.maxTemperature,
			unit: "°C",
		},
		{
			key: "ph",
			icon: "water",
			iconColor: "#8e24aa",
			bgColor: "#f3e5f5",
			label: "pH",
			min: threshold?.minPH,
			max: threshold?.maxPH,
		},
		{
			key: "tds",
			icon: "molecule",
			iconColor: "#00bcd4",
			bgColor: "#e0f7fa",
			label: "TDS",
			min: threshold?.minTds,
			max: threshold?.maxTds,
			unit: "ppm",
		},
		{
			key: "height",
			icon: "waves",
			iconColor: "#2f90ff",
			bgColor: "#e0ebfa",
			label: "Height",
			min: threshold?.minHeight,
			max: threshold?.maxHeight,
			unit: "cm",
		},
		{
			key: "light",
			icon: "lightbulb",
			iconColor: "#fbc02d",
			bgColor: "#fffde7",
			label: "Light",
			min: threshold?.minLight,
			max: threshold?.maxLight,
			unit: "lux",
		},
	];

	return (
		<View style={styles.thresholdsContainer}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "flex-end",
				}}
			>
				{data.map(({ key, ...props }, idx) => (
					<View
						key={key}
						style={{
							width: barWidth,
							marginRight: idx !== data.length - 1 ? spacing : 0,
						}}
					>
						<ThresholdBarWithLabels {...props} />
					</View>
				))}
			</View>
		</View>
	);
};

export default function AquariumPage() {
	const { id } = useLocalSearchParams();
	const { aquariums } = useStateContext();
	const aquarium = aquariums.find((aq) => aq.id === id);

	const { mutate: changeWaterPumpStatus, isPending } = useChangeWaterPumpStatus();
	const { mutate: updateThresholds } = useUpdateThresholds();

	const [bombOn, setBombOn] = useState(aquarium?.isBombWorking ?? false);

	const [modalVisible, setModalVisible] = useState(false);

	const handleToggleBomb = (value: boolean) => {
		changeWaterPumpStatus(id as string, {
			onSuccess: () => {
				console.log(`Water pump status for aquarium ${id} changed to ${value}`);
				setBombOn(value);
			},
		});
	};

	//get device height
	const deviceHeight = Dimensions.get("window").height;

	const handleEditThresholds = (data: updateThresholdsRequest) => {
		console.log("Updating thresholds:", data);
		updateThresholds(data);

		setModalVisible(false);
	};

	if (!aquarium) {
		return (
			<View style={styles.container}>
				<Text variant="titleLarge">Aquarium not found</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<AquariumHeader
				aquariumId={aquarium.id}
				name={aquarium.name}
				location={aquarium.location}
				ownerUsername={aquarium.ownerUsername}
				createdDate={aquarium.createdDate}
			/>
			<BombStatus isWorking={bombOn} onToggle={handleToggleBomb} isPending={isPending} />
			<ThresholdsSection threshold={aquarium.threshold} />

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

			{/* Edit Thresholds Modal */}
			<Modal
				visible={modalVisible}
				animationType="fade"
				transparent={true}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Edit Thresholds</Text>
						<ScrollView style={{ maxHeight: deviceHeight * 0.8 }}>
							<EditThresholdsForm
								aquariumId={aquarium.id}
								onSubmit={handleEditThresholds}
								initialValues={aquarium.threshold}
								onCancel={() => setModalVisible(false)}
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
