import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStateContext } from "../../context/StateContext";
import { useCreateAquarium } from "../../utils/services/AquariumService";
import { useRoutes } from "../../utils/routes";
import { CreateAquariumRequest } from "../../types/Aquarium";
import { useLocalSearchParams } from "expo-router";

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	location: z.string().min(1, "Location is required"),
});

type AddAquariumInput = z.infer<typeof schema>;

export default function AddAquariumForm() {
	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<AddAquariumInput>({
		resolver: zodResolver(schema),
		defaultValues: { name: "" },
	});

	const name = watch("name");
	const location = watch("location");

	const { mutate } = useCreateAquarium();

	const router = useRoutes();

	const { macAddress } = useLocalSearchParams();

	const onSubmit = async (data: AddAquariumInput) => {
		const payload: CreateAquariumRequest = {
			name: data.name,
			location: data.location,
			esp: macAddress as string,
		};

		try {
			mutate(payload, {
				onSuccess: (response) => {
					console.log("Aquarium created successfully:", response);
					router.gotoDefineAquariumThresholds(response.id);
				},
				onError: (error) => {
					console.error("Error creating aquarium:", error);
				},
			});
		} catch (error) {
			console.error("Error adding aquarium:", error);
		}
	};

	return (
		<View style={styles.container}>
			<Text
				variant="headlineLarge"
				style={{ marginBottom: 30, marginTop: 40, textAlign: "center" }}
			>
				Create Aquarium
			</Text>
			<TextInput
				label="Name"
				value={name}
				onChangeText={(text) => setValue("name", text)}
				mode="outlined"
				error={!!errors.name}
				style={styles.input}
				autoFocus
			/>
			{errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

			<TextInput
				label="Location"
				value={location}
				onChangeText={(text) => setValue("location", text)}
				mode="outlined"
				error={!!errors.location}
				style={styles.input}
			/>
			{errors.location && (
				<Text style={styles.errorText}>{errors.location.message}</Text>
			)}

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
					Create Aquarium
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		width: "100%",
	},
	input: {
		marginBottom: 8,
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 8,
	},
	button: {
		flex: 1,
		borderRadius: 8,
	},
	errorText: {
		color: "#e53935",
		marginBottom: 4,
		marginLeft: 2,
	},
});
