import { useEffect, useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device, State } from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

interface BluetoothLowEnergyApi {
	requestPermissions: () => Promise<boolean>;
	scanForDevices: () => void;
	allDevices: Device[];
	connectToDevice: (deviceId: Device) => Promise<void>;
	connectedDevice: Device | null;
	isBluetoothOn: boolean;
}

export default function useBLE(): BluetoothLowEnergyApi {
	const bleManager = useMemo(() => {
		return new BleManager();
	}, []);

	const [allDevices, setAllDevices] = useState<Device[]>([]);
	const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
	const [isBluetoothOn, setBluetoothOn] = useState(true);

	useEffect(() => {
		const subscription = bleManager.onStateChange((state) => {
			setBluetoothOn(state === State.PoweredOn);
		}, true);
		return () => {
			subscription.remove();
			bleManager.destroy();
		};
	}, [bleManager]);

	const requestAndroid31Permissions = async () => {
		const bluetoothScanPermissions = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
		);
		const bluetoothConnectPermissions = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
		);
		const bluetoothFineLocationPermissions = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
		);
		return (
			bluetoothScanPermissions === PermissionsAndroid.RESULTS.GRANTED &&
			bluetoothConnectPermissions === PermissionsAndroid.RESULTS.GRANTED &&
			bluetoothFineLocationPermissions === PermissionsAndroid.RESULTS.GRANTED
		);
	};

	const requestPermissions = async (): Promise<boolean> => {
		if (Platform.OS === "android") {
			if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
				);

				return granted === PermissionsAndroid.RESULTS.GRANTED;
			} else {
				const isAndroid31PermissionsGranted = await requestAndroid31Permissions();
				return isAndroid31PermissionsGranted;
			}
		}
		return true;
	};

	const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
		devices.findIndex((device) => nextDevice.id === device.id) > -1;

	const isEsp32Device = (device: Device) => {
		// return (
		// 	device.name?.toLowerCase().includes("smart") ||
		// 	device.localName?.toLowerCase().includes("smartaquarium")
		// );
		return device.serviceUUIDs?.includes("bd8db997-757f-44b7-ad11-b81515927ca8");
	};

	const scanForDevices = () => {
		bleManager.startDeviceScan(null, null, (error, device) => {
			if (error) {
				console.log(error);
			}
			if (device && isEsp32Device(device)) {
				setAllDevices((prevState: Device[]) => {
					if (!isDuplicteDevice(prevState, device)) {
						return [...prevState, device];
					}
					return prevState;
				});
			}
		});
	};

	const connectToDevice = async (device: Device) => {
		try {
			const deviceConnection = await bleManager.connectToDevice(device.id);
			setConnectedDevice(deviceConnection);
			await deviceConnection.discoverAllServicesAndCharacteristics();
			bleManager.stopDeviceScan();
		} catch (e) {
			console.log("FAILED TO CONNECT", e);
		}
	};

	return {
		requestPermissions,
		scanForDevices,
		allDevices,
		connectToDevice,
		connectedDevice,
		isBluetoothOn,
	};
}
