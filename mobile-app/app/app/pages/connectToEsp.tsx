import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useRoutes } from "../../utils/routes";
import useBLE from "../../hooks/useBle";
import DeviceModal from "../../components/DeviceConnectionModal";
import { useIsFocused } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
	ssid: z.string().min(1, "SSID is required"),
	password: z.string().min(1, "Password is required"),
});

type WifiFormInput = z.infer<typeof schema>;

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
		isConnectingToDevice,
		readFromDevice,
	} = useBLE();
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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

	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<WifiFormInput>({
		resolver: zodResolver(schema),
		defaultValues: { ssid: "", password: "" },
	});

	const ssid = watch("ssid");
	const password = watch("password");

	const onSubmit = async (data: WifiFormInput) => {
		try {
			console.log("Sending WiFi data:", data);
			const serviceUUID = "bd8db997-757f-44b7-ad11-b81515927ca8";
			const writeCharacteristicUUID = "6e4fe646-a8f0-4892-8ef4-9ac94142da48";
			const readCharacteristicUUID = "6e4fe646-a8f0-4892-8ef4-9ac94142da48";
			const payload = {
				...data,
				resetWifi: false,
			};
			const jsonString = JSON.stringify(payload);

			await writeToDevice(serviceUUID, writeCharacteristicUUID, jsonString);

			console.log("WiFi data sent successfully");

			const macAddress = await readFromDevice(serviceUUID, readCharacteristicUUID).then(
				(response) => {
					return response;
				}
			);
			// const macAddress = "hello";

			if (!macAddress) {
				console.error("Failed to read MAC address from device");
				return;
			}

			router.gotoAddAquariumForm(macAddress);
		} catch (error) {
			console.error("Error sending WiFi data:", error);
		}
	};

	return (
		<>
			<View style={styles.titleWrapper}>
				{isBluetoothOn === undefined || !isBluetoothOn ? (
					<Text style={styles.text}>Please turn on Bluetooth </Text>
				) : !connectedDevice ? (
					// This is when the device is connected
					<View style={styles.container2}>
						<TextInput
							label="SSID"
							value={ssid}
							onChangeText={(text) => setValue("ssid", text)}
							mode="outlined"
							error={!!errors.ssid}
							style={styles.input}
							autoFocus
						/>
						{errors.ssid && (
							<Text style={styles.errorText}>{errors.ssid.message}</Text>
						)}
						<TextInput
							label="Wifi Password"
							value={password}
							onChangeText={(text) => setValue("password", text)}
							mode="outlined"
							error={!!errors.password}
							style={styles.input}
							secureTextEntry
						/>
						{errors.password && (
							<Text style={styles.errorText}>{errors.password.message}</Text>
						)}

						<Button
							mode="contained"
							onPress={handleSubmit(onSubmit)}
							loading={isSubmitting}
							style={styles.button}
							disabled={isSubmitting}
						>
							Send
						</Button>
					</View>
				) : (
					<Text style={styles.titleText}>
						Stay close to connect to your Aquarium!
					</Text>
				)}
			</View>

			{isConnectingToDevice && !connectedDevice ? (
				<ActivityIndicator size="large" color="#1976d2" style={{ marginTop: 32 }} />
			) : (
				!connectedDevice && (
					<>
						<TouchableOpacity
							onPress={openModal}
							style={[
								styles.ctaButton,
								!isBluetoothOn && { backgroundColor: "#ccc" },
							]}
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
				)
			)}
		</>
	);
}

const styles = StyleSheet.create({
	input: {
		marginBottom: 8,
	},
	button: {
		marginTop: 8,
		borderRadius: 8,
	},
	errorText: {
		color: "#e53935",
		marginBottom: 4,
		marginLeft: 2,
	},
	container: {
		flex: 1,
		padding: 24,

		backgroundColor: "#f2f2f2",
	},
	container2: {
		padding: 16,
		width: "100%",
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
