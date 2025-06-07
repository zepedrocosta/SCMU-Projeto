import React from "react";
import { StyleSheet, Platform, KeyboardAvoidingView, ScrollView, View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThresholdResponse, updateThresholdsRequest } from "../types/Aquarium";

const schema = z.object({
	minTemperature: z.coerce.number().min(-50).max(100),
	maxTemperature: z.coerce.number().min(-50).max(100),
	minPH: z.coerce.number().min(0).max(14),
	maxPH: z.coerce.number().min(0).max(14),
	minTds: z.coerce.number().min(0),
	maxTds: z.coerce.number().min(0),
	minHeight: z.coerce.number().min(0),
	maxHeight: z.coerce.number().min(0),
});

type EditThresholdsInput = z.infer<typeof schema>;

export default function EditThresholdsForm({
	aquariumId,
	initialValues,
	onSubmit,
	onCancel,
}: {
	aquariumId: string;
	initialValues: ThresholdResponse;
	onSubmit: (data: updateThresholdsRequest) => void;
	onCancel: () => void;
}) {
	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<EditThresholdsInput>({
		resolver: zodResolver(schema),
		defaultValues: initialValues,
	});

	const fields = [
		{ name: "minTemperature", label: "Min Temperature (°C)" },
		{ name: "maxTemperature", label: "Max Temperature (°C)" },
		{ name: "minPH", label: "Min pH" },
		{ name: "maxPH", label: "Max pH" },
		{ name: "minTds", label: "Min TDS (ppm)" },
		{ name: "maxTds", label: "Max TDS (ppm)" },
		{ name: "minHeight", label: "Min Height (cm)" },
		{ name: "maxHeight", label: "Max Height (cm)" },
	];

	const handleFormSubmit = (data: EditThresholdsInput) => {
		onSubmit({
			...data,
			aquariumId: aquariumId,
		});
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={64}
		>
			<ScrollView
				contentContainerStyle={styles.container}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				{fields.map((f) => (
					<View key={f.name} style={styles.inputGroup}>
						<TextInput
							label={f.label}
							value={
								watch(f.name as keyof EditThresholdsInput) !== undefined
									? String(watch(f.name as keyof EditThresholdsInput))
									: ""
							}
							onChangeText={(text) =>
								setValue(
									f.name as keyof EditThresholdsInput,
									text === "" ? 0 : parseFloat(text)
								)
							}
							mode="outlined"
							keyboardType="numeric"
							error={!!errors[f.name as keyof EditThresholdsInput]}
							style={styles.input}
						/>
						{errors[f.name as keyof EditThresholdsInput] && (
							<Text style={styles.errorText}>
								{
									errors[f.name as keyof EditThresholdsInput]
										?.message as string
								}
							</Text>
						)}
					</View>
				))}
				<Button
					mode="contained"
					onPress={handleSubmit(handleFormSubmit)}
					loading={isSubmitting}
					style={styles.button}
					disabled={isSubmitting}
				>
					Save Thresholds
				</Button>

				<Button mode="outlined" onPress={() => onCancel()} style={styles.button}>
					Cancel
				</Button>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 8,
		paddingBottom: 24,
		flexGrow: 1,
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
