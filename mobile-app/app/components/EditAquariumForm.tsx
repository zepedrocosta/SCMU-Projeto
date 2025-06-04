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
}: {
	name: string;
	location: string;
	onSubmit: (data: EditAquariumInput) => void;
}) {
	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<EditAquariumInput>({
		resolver: zodResolver(schema),
		defaultValues: { name, location }, // Use props as initial values
	});

	const watchedName = watch("name");
	const watchedLocation = watch("location");

	return (
		<View style={styles.container}>
			<TextInput
				label="Aquarium Name"
				value={watchedName}
				onChangeText={(text) => setValue("name", text)}
				mode="outlined"
				error={!!errors.name}
				style={styles.input}
				autoFocus
			/>
			{errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

			<TextInput
				label="Aquarium Location"
				value={watchedLocation}
				onChangeText={(text) => setValue("location", text)}
				mode="outlined"
				error={!!errors.location}
				style={styles.input}
			/>
			{errors.location && (
				<Text style={styles.errorText}>{errors.location.message}</Text>
			)}

			<Button
				mode="contained"
				onPress={handleSubmit(onSubmit)}
				loading={isSubmitting}
				style={styles.button}
				disabled={isSubmitting}
			>
				Save
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
