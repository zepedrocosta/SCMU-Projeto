import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRoutes } from "../../utils/routes";
import { useStateContext } from "../../context/StateContext";
import useBLE from "../../hooks/useBle";

const schema = z.object({
	ssid: z.string().min(1, "SSID is required"),
	password: z.string().min(1, "Password is required"),
});

type WifiFormInput = z.infer<typeof schema>;

export default function SendWifiForm() {
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

	const { writeToDevice } = useBLE();

	const ssid = watch("ssid");
	const password = watch("password");

	const onSubmit = async (data: WifiFormInput) => {
		try {
			console.log("Sending WiFi data:", data);
			const serviceUUID = "service-uuid";
			const characteristicUUID = "characteristic-uuid";
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
