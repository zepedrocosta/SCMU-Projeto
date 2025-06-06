import React from "react";
import { StyleSheet, Platform, KeyboardAvoidingView, View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShareAquarium } from "../utils/services/AquariumService";

const schema = z.object({
	username: z.string().min(1, "Username is required"),
});

type ShareAquariumInput = z.infer<typeof schema>;

export default function ShareAquariumForm({
	onSubmit,
	onCancel,
	aquariumId,
	initialValues = { username: "" },
}: {
	onSubmit: (data: ShareAquariumInput) => void;
	onCancel: () => void;
	aquariumId: string;
	initialValues?: ShareAquariumInput;
}) {
	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<ShareAquariumInput>({
		resolver: zodResolver(schema),
		defaultValues: initialValues,
	});

	const { mutate } = useShareAquarium();

	const handleFormSubmit = (data: ShareAquariumInput) => {
		mutate({ username: data.username, aquariumId });
		onSubmit(data);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={64}
		>
			<View style={styles.container}>
				<View style={styles.inputGroup}>
					<TextInput
						label="Username"
						value={watch("username")}
						onChangeText={(text) => setValue("username", text)}
						mode="outlined"
						error={!!errors.username}
						style={styles.input}
						autoCapitalize="none"
					/>
					{errors.username && (
						<Text style={styles.errorText}>{errors.username.message}</Text>
					)}
				</View>
				<Button
					mode="contained"
					onPress={handleSubmit(handleFormSubmit)}
					loading={isSubmitting}
					style={styles.button}
					disabled={isSubmitting}
				>
					Share Aquarium
				</Button>
				<Button mode="outlined" onPress={onCancel} style={styles.button}>
					Cancel
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 8,
		paddingBottom: 24,
		flexGrow: 1,
	},
	label: {
		fontSize: 16,
		marginBottom: 12,
	},
	aquariumName: {
		fontWeight: "bold",
		color: "#1976d2",
	},
	inputGroup: {
		marginBottom: 8,
	},
	input: {
		marginBottom: 2,
	},
	button: {
		marginTop: 8,
		borderRadius: 8,
	},
	errorText: {
		color: "#e53935",
		marginBottom: 2,
		marginLeft: 2,
		fontSize: 13,
	},
});
