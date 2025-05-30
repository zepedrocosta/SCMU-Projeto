import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ViewBase } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRoutes } from "../../utils/routes";
import useBLE from "../../hooks/useBle";
import DeviceModal from "../../components/DeviceConnectionModal";
import ConnectingScreen from "./connectingScreen";
import { useIsFocused } from "@react-navigation/native";

const SERVICE_UUID = "0x180D";
const CHARACTERISTIC_UUID = "0x2A39";
export default function ConnectToDevicePage() {
	const router = useRoutes();

	const {
		requestPermissions,
		scanForDevices,
		allDevices,
		connectToDevice,
		connectedDevice,
		isBluetoothOn,
		writeToDevice,
		resetDevices,
		refreshBluetoothState,
	} = useBLE();
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

	// ...existing code...
	const isFocused = useIsFocused();

	useEffect(() => {
		if (isFocused) {
			resetDevices();
			refreshBluetoothState();
		}
	}, [isFocused]);

	const scanForDevices_intern = async () => {
		const isPermissionsEnabled = await requestPermissions();
		if (isPermissionsEnabled) {
			scanForDevices();
		}
	};

	const hideModal = () => {
		setIsModalVisible(false);
		resetDevices();
	};

	const openModal = async () => {
		await scanForDevices_intern();
		setIsModalVisible(true);
	};

	const handleSendData = () => {
		//writeToDevice(SERVICE_UUID, CHARACTERISTIC_UUID, "Hello from app!");
	};

	return (
		<>
			<View style={styles.titleWrapper}>
				{isBluetoothOn === undefined || !isBluetoothOn ? (
					<Text style={styles.text}>Please turn on Bluetooth </Text>
				) : connectedDevice ? (
					// This is when the device is connected
					<View style={styles.titleWrapper}>
						<Button
							mode="contained"
							onPress={handleSendData}
							style={{ margin: 20 }}
						>
							Send Test Data
						</Button>
					</View>
				) : (
					<Text style={styles.titleText}>
						Stay close to connect to your Aquarium!
					</Text>
				)}
			</View>
			<TouchableOpacity
				onPress={openModal}
				style={[styles.ctaButton, !isBluetoothOn && { backgroundColor: "#ccc" }]}
				disabled={!isBluetoothOn}
			>
				<Text style={styles.ctaButtonText}>{"Connect"}</Text>
			</TouchableOpacity>
			<DeviceModal
				closeModal={hideModal}
				visible={isModalVisible}
				connectToPeripheral={connectToDevice}
				devices={allDevices}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f2f2f2",
	},
	titleWrapper: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	titleText: {
		fontSize: 30,
		fontWeight: "bold",
		textAlign: "center",
		marginHorizontal: 20,
		color: "black",
	},
	text: {
		fontSize: 25,
		marginTop: 15,
	},
	ctaButton: {
		backgroundColor: "#FF6060",
		justifyContent: "center",
		alignItems: "center",
		height: 50,
		marginHorizontal: 20,
		marginBottom: 120,
		borderRadius: 8,
	},
	ctaButtonText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
	},
});
