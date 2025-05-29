import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useRegister } from "../../utils/services/AuthService";

const registerSchema = z.object({
	firstName: z.string().min(1, { message: "First name is required" }),
	lastName: z.string().min(1, { message: "Last name is required" }),
	email: z.string().email({ message: "Invalid email" }),
	password: z.string().min(6, { message: "Min 6 characters" }),
	confirmPassword: z.string().min(6, { message: "Min 6 characters" }),
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const router = useRouter();

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
					<Card>
						<Card.Title title="Register" />
						<Card.Content>
							<TextInput
								label="First name"
								mode="outlined"
								onChangeText={(text) => setValue("firstName", text)}
								onBlur={() => trigger("firstName")}
								error={!!errors.firstName}
							/>
							{errors.firstName && (
								<Text style={styles.error}>{errors.firstName.message}</Text>
							)}

							<TextInput
								label="Last name"
								mode="outlined"
								onChangeText={(text) => setValue("lastName", text)}
								onBlur={() => trigger("lastName")}
								error={!!errors.lastName}
							/>
							{errors.lastName && (
								<Text style={styles.error}>{errors.lastName.message}</Text>
							)}

							<TextInput
								label="Email"
								mode="outlined"
								onChangeText={(text) => setValue("email", text)}
								onBlur={() => trigger("email")}
								error={!!errors.email}
							/>
							{errors.email && (
								<Text style={styles.error}>{errors.email.message}</Text>
							)}

							<TextInput
								label="Password"
								mode="outlined"
								secureTextEntry={!showPassword}
								onChangeText={(text) => setValue("password", text)}
								onBlur={() => trigger("password")}
								error={!!errors.password}
								style={{ marginTop: 16 }}
								right={
									<TextInput.Icon
										icon={showPassword ? "eye-off" : "eye"}
										onPress={() => setShowPassword(!showPassword)}
									/>
								}
							/>
							{errors.password && (
								<Text style={styles.error}>{errors.password.message}</Text>
							)}

							<TextInput
								label="Confirm Password"
								mode="outlined"
								secureTextEntry={!showPassword}
								onChangeText={(text) => setValue("confirmPassword", text)}
								onBlur={() => trigger("confirmPassword")}
								error={!!errors.confirmPassword}
								style={{ marginTop: 16 }}
							/>
							{errors.confirmPassword && (
								<Text style={styles.error}>
									{errors.confirmPassword.message}
								</Text>
							)}

							<Button
								mode="contained"
								onPress={handleSubmit(onSubmit)}
								style={{ marginTop: 24 }}
							>
								Register
							</Button>
							<Button
								mode="text"
								onPress={() => router.replace("/")}
								style={{ marginTop: 8 }}
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
	},
	error: {
		color: "red",
		marginTop: 4,
	},
});
