import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useRegister } from "../../utils/services/AuthService";

const registerSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	nickname: z.string().min(1, { message: "Nickname is required" }),
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
								label="Name"
								mode="outlined"
								onChangeText={(text) => setValue("name", text)}
								onBlur={() => trigger("name")}
								error={!!errors.name}
							/>
							{errors.name && (
								<Text style={styles.error}>{errors.name.message}</Text>
							)}

							<TextInput
								label="Nickname"
								mode="outlined"
								onChangeText={(text) => setValue("nickname", text)}
								onBlur={() => trigger("nickname")}
								error={!!errors.nickname}
							/>
							{errors.nickname && (
								<Text style={styles.error}>{errors.nickname.message}</Text>
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
