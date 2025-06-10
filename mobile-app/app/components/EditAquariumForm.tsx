import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	location: z.string().min(1, "Location is required"),
});

type EditAquariumInput = z.infer<typeof schema>;

export default function EditAquariumForm({
	name,
	location,
	onSubmit,
	onCancel,
}: {
	name: string;
	location: string;
	onSubmit: (data: EditAquariumInput) => void;
	onCancel: () => void;
}) {
	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<EditAquariumInput>({
		resolver: zodResolver(schema),
		defaultValues: { name, location },
	});

	const watchedName = watch("name");
	const watchedLocation = watch("location");

	return (
		<View style={styles.modalContent}>
			<TextInput
				label="Aquarium Name"
				value={watchedName}
				onChangeText={(text) => setValue("name", text)}
				mode="outlined"
				error={!!errors.name}
				style={styles.input}
				autoFocus
			/>
			<View style={styles.errorContainer}>
				{errors.name ? (
					<Text style={styles.errorText}>{errors.name.message}</Text>
				) : (
					<Text style={styles.errorPlaceholder}> </Text>
				)}
			</View>

			<TextInput
				label="Aquarium Location"
				value={watchedLocation}
				onChangeText={(text) => setValue("location", text)}
				mode="outlined"
				error={!!errors.location}
				style={styles.input}
			/>
			<View style={styles.errorContainer}>
				{errors.location ? (
					<Text style={styles.errorText}>{errors.location.message}</Text>
				) : (
					<Text style={styles.errorPlaceholder}> </Text>
				)}
			</View>

			<View style={styles.buttonRow}>
				<Button
					mode="outlined"
					onPress={onCancel}
					style={styles.modalButton}
					disabled={isSubmitting}
				>
					Cancel
				</Button>
				<Button
					mode="contained"
					onPress={handleSubmit(onSubmit)}
					loading={isSubmitting}
					style={[styles.modalButton, { marginLeft: 8 }]}
					disabled={isSubmitting}
				>
					Save
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	modalContent: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 24,
		width: "100%",
		alignItems: "stretch",
		justifyContent: "flex-start",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 16,
		textAlign: "center",
	},
	input: {
		marginBottom: 2,
		backgroundColor: "#fff",
	},
	errorContainer: {
		minHeight: 18,
		marginBottom: 8,
	},
	errorText: {
		color: "#e53935",
		fontSize: 13,
		marginLeft: 2,
	},
	errorPlaceholder: {
		color: "transparent",
		fontSize: 13,
		marginLeft: 2,
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 24,
		width: "100%",
	},
	modalButton: {
		flex: 1,
		marginHorizontal: 0,
	},
});
