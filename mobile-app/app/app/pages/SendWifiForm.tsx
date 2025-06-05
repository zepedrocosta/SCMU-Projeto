import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRoutes } from "../../utils/routes";
import { useStateContext } from "../../context/StateContext";

const schema = z.object({
	ssid: z.string().min(1, "SSID is required"),
	password: z.string().min(1, "Password is required"),
});

type WifiFormInput = z.infer<typeof schema>;

interface SendWifiFormProps {
	writeToDevice: (
		serviceUUID: string,
		characteristicUUID: string,
		value: string
	) => Promise<void>;
}

export default function SendWifiForm(props: SendWifiFormProps) {
	const { writeToDevice } = props;

	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<WifiFormInput>({
		resolver: zodResolver(schema),
		defaultValues: { ssid: "", password: "" },
	});

	const router = useRoutes();

	const { user } = useStateContext();

	const ssid = watch("ssid");
	const password = watch("password");

	const onSubmit = async (data: WifiFormInput) => {
		try {
			console.log("Sending WiFi data:", data);
			const serviceUUID = "bd8db997-757f-44b7-ad11-b81515927ca8";
			const characteristicUUID = "6e4fe646-a8f0-4892-8ef4-9ac94142da48";
			const payload = {
				...data,
				//nickname: user.email,
			};
			const jsonString = JSON.stringify(payload);

			await writeToDevice(serviceUUID, characteristicUUID, jsonString);

			console.log("WiFi data sent successfully");

			router.gotoHome();
		} catch (error) {
			console.error("Error sending WiFi data:", error);
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				label="SSID"
				value={ssid}
				onChangeText={(text) => setValue("ssid", text)}
				mode="outlined"
				error={!!errors.ssid}
				style={styles.input}
				autoFocus
			/>
			{errors.ssid && <Text style={styles.errorText}>{errors.ssid.message}</Text>}
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
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		width: "100%",
	},
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
});
