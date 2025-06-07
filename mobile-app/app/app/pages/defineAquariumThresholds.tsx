import { StyleSheet, Platform, KeyboardAvoidingView, ScrollView, View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateThresholdsRequest } from "../../types/Aquarium";
import { useLocalSearchParams } from "expo-router";
import { useUpdateThresholds } from "../../utils/services/AquariumService";
import { useStateContext } from "../../context/StateContext";
import { useRoutes } from "../../utils/routes";

const schema = z.object({
	minTemperature: z.coerce.number().min(-50).max(100),
	maxTemperature: z.coerce.number().min(-50).max(100),
	minPH: z.coerce.number().min(0).max(14),
	maxPH: z.coerce.number().min(0).max(14),
	minTds: z.coerce.number().min(0),
	maxTds: z.coerce.number().min(0),
	minHeight: z.coerce.number().min(0),
	maxHeight: z.coerce.number().min(0),
	minLight: z.coerce.number().min(0),
	maxLight: z.coerce.number().min(0),
});

type EditThresholdsInput = z.infer<typeof schema>;

export default function DefineAquariumThresholds() {
	const { aquariumId } = useLocalSearchParams();

	const { mutate: updateThresholds } = useUpdateThresholds();

	const { aquariums } = useStateContext();
	const aquarium = aquariums.find((a) => a.id === aquariumId);
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
		{ name: "minLight", label: "Min Light (lux)" },
		{ name: "maxLight", label: "Max Light (lux)" },
	];

	const onSubmit = (data: EditThresholdsInput) => {
		updateThresholds({
			aquariumId: aquarium.id,
			...data,
		} as updateThresholdsRequest);
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
					onPress={handleSubmit(onSubmit)}
					loading={isSubmitting}
					style={styles.button}
					disabled={isSubmitting}
				>
					Save Thresholds
				</Button>

				<Button
					mode="outlined"
					onPress={() => router.gotoHome()}
					style={styles.button}
				>
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
