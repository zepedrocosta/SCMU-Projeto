import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
	name: z.string().min(1, "Name is required"),
});

type AddGroupInput = z.infer<typeof schema>;

export default function AddGroupForm({
	onSubmit,
}: {
	onSubmit: (data: AddGroupInput) => void;
}) {
	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<AddGroupInput>({
		resolver: zodResolver(schema),
		defaultValues: { name: "" },
	});

	const name = watch("name");

	return (
		<View style={styles.container}>
			<TextInput
				label="Group Name"
				value={name}
				onChangeText={(text) => setValue("name", text)}
				mode="outlined"
				error={!!errors.name}
				style={styles.input}
				autoFocus
			/>
			{errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
			<Button
				mode="contained"
				onPress={handleSubmit(onSubmit)}
				loading={isSubmitting}
				style={styles.button}
				disabled={isSubmitting}
			>
				Add Group
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
