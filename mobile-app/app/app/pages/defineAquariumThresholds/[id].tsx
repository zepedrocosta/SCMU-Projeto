import { StyleSheet, Platform, KeyboardAvoidingView, ScrollView, View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useUpdateThresholds } from "../../../utils/services/AquariumService";
import { useStateContext } from "../../../context/StateContext";
import { useRoutes } from "../../../utils/routes";
import { updateThresholdsRequest } from "../../../types/Aquarium";

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

export default function DefineAquariumThresholds() {
	const { id } = useLocalSearchParams();

	const { mutate: updateThresholds } = useUpdateThresholds();

	const { aquariums } = useStateContext();
	const aquarium = aquariums.find((aq) => aq.id === id);

	if (!aquarium) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>Aquarium not found</Text>
			</View>
		);
	}

	const router = useRoutes();

	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<EditThresholdsInput>({
		resolver: zodResolver(schema),
		defaultValues: aquarium.threshold,
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

	const onSubmit = (data: EditThresholdsInput) => {
		updateThresholds({
			aquariumId: aquarium.id,
			...data,
		} as updateThresholdsRequest);
		router.gotoHome();
	};

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={64}
			>
				<ScrollView
					style={{ flex: 1, backgroundColor: "#fff" }}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					<Text
						variant="headlineLarge"
						style={{ marginBottom: 20, marginTop: 20, textAlign: "center" }}
					>
						Define Aquarium Thresholds
					</Text>
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
					<View style={styles.buttonRow}>
						<Button
							mode="outlined"
							onPress={() => router.gotoHome()}
							style={[styles.button, { marginRight: 8 }]}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							mode="contained"
							onPress={handleSubmit(onSubmit)}
							loading={isSubmitting}
							style={styles.button}
							disabled={isSubmitting}
						>
							Save Thresholds
						</Button>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		padding: 8,
		flexGrow: 1,
	},
	scrollContent: {
		padding: 16,
		flexGrow: 1,
		justifyContent: "flex-start",
	},
	inputGroup: {
		marginBottom: 8,
	},
	input: {
		marginBottom: 2,
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
	},
	button: {
		flex: 1,
		borderRadius: 8,
	},
	errorText: {
		color: "#e53935",
		marginBottom: 2,
		marginLeft: 2,
		fontSize: 13,
	},
});
