import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useState } from "react";
import { useRoutes } from "../utils/routes";
import { useRegister } from "../utils/services/AuthService";

const registerSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	nickname: z.string().min(1, { message: "Nickname is required" }),
	email: z.string().email({ message: "Invalid email" }),
	password: z.string().min(6, { message: "Min 6 characters" }),
	confirmPassword: z.string().min(6, { message: "Min 6 characters" }),
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const router = useRoutes();
	const { mutate } = useRegister();

	const {
		handleSubmit,
		setValue,
		formState: { errors },
		trigger,
	} = useForm<RegisterInput>({
		resolver: zodResolver(
			registerSchema.refine((data) => data.password === data.confirmPassword, {
				message: "Passwords do not match",
				path: ["confirmPassword"],
			})
		),
		mode: "onTouched",
	});

	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = (data: RegisterInput) => {
		console.log("Register data:", data);
		mutate(data, {});
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.container}>
					<Card style={styles.card}>
						<Card.Title title="Register" />
						<Card.Content>
							{[
								{
									label: "Name",
									key: "name",
									secure: false,
								},
								{
									label: "Nickname",
									key: "nickname",
									secure: false,
								},
								{
									label: "Email",
									key: "email",
									secure: false,
								},
								{
									label: "Password",
									key: "password",
									secure: true,
								},
								{
									label: "Confirm Password",
									key: "confirmPassword",
									secure: true,
								},
							].map((field, idx) => (
								<View key={field.key} style={styles.inputGroup}>
									<TextInput
										label={field.label}
										mode="outlined"
										secureTextEntry={field.secure && !showPassword}
										onChangeText={(text) =>
											setValue(field.key as keyof RegisterInput, text)
										}
										onBlur={() =>
											trigger(field.key as keyof RegisterInput)
										}
										error={!!errors[field.key as keyof RegisterInput]}
										style={styles.input}
										right={
											field.secure ? (
												<TextInput.Icon
													icon={showPassword ? "eye-off" : "eye"}
													onPress={() => setShowPassword((v) => !v)}
												/>
											) : undefined
										}
									/>
									{/* Reserve space for error */}
									<View style={styles.errorContainer}>
										{errors[field.key as keyof RegisterInput] ? (
											<Text style={styles.error}>
												{errors[
													field.key as keyof RegisterInput
												]?.message?.toString()}
											</Text>
										) : (
											<Text style={styles.errorPlaceholder}> </Text>
										)}
									</View>
								</View>
							))}

							<Button
								mode="contained"
								onPress={handleSubmit(onSubmit)}
								style={styles.button}
							>
								Register
							</Button>
							<Button
								mode="text"
								onPress={() => router.gotoIndex()}
								style={styles.secondaryButton}
							>
								Already have an account? Login
							</Button>
						</Card.Content>
					</Card>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 16,
		backgroundColor: "#f7fafd",
	},
	card: {
		borderRadius: 18,
		paddingVertical: 8,
		paddingHorizontal: 4,
		elevation: 2,
	},
	inputGroup: {
		marginBottom: 13,
	},
	input: {
		backgroundColor: "#fff",
	},
	errorContainer: {
		minHeight: 20,
		justifyContent: "flex-start",
	},
	error: {
		color: "#e53935",
		fontSize: 13,
		marginTop: 2,
	},
	errorPlaceholder: {
		color: "transparent",
		fontSize: 13,
		marginTop: 2,
	},
	button: {
		marginTop: 8,
		borderRadius: 8,
		paddingVertical: 4,
	},
	secondaryButton: {
		marginTop: 4,
		marginBottom: 4,
	},
});
