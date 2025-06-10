import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Card, Avatar } from "react-native-paper";
import { useEffect, useState } from "react";
import { useLogin } from "../utils/services/AuthService";
import { useRoutes } from "../utils/routes";
import { useStateContext } from "../context/StateContext";

const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email" }),
	password: z.string().min(6, { message: "Min 6 characters" }),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRoutes();

	const { isLoggedIn, loading } = useStateContext();

	const { mutate } = useLogin();

	const {
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	});

	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (!loading && isLoggedIn) {
			router.gotoHome(true);
		}
	}, [loading, isLoggedIn]);

	const onSubmit = (data: LoginInput) => {
		console.log("Login data:", data);
		mutate(data, {
			onError: (error) => {
				console.error("Login error:", error);
			},
			onSuccess: () => {
				router.gotoHome(true);
			},
		});
	};

	if (loading) return null;

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
					<Avatar.Icon
						icon="fishbowl"
						size={100}
						style={styles.avatar}
						color="#fff"
					/>

					<Card style={styles.card}>
						<Card.Title title="Login" />
						<Card.Content>
							<View style={styles.inputGroup}>
								<TextInput
									label="Email"
									mode="outlined"
									onChangeText={(text) => setValue("email", text)}
									error={!!errors.email}
									style={styles.input}
									autoCapitalize="none"
									keyboardType="email-address"
								/>
								<View style={styles.errorContainer}>
									{errors.email ? (
										<Text style={styles.error}>
											{errors.email.message}
										</Text>
									) : (
										<Text style={styles.errorPlaceholder}> </Text>
									)}
								</View>
							</View>

							<View style={styles.inputGroup}>
								<TextInput
									label="Password"
									mode="outlined"
									secureTextEntry={!showPassword}
									onChangeText={(text) => setValue("password", text)}
									error={!!errors.password}
									style={styles.input}
									right={
										<TextInput.Icon
											icon={showPassword ? "eye-off" : "eye"}
											onPress={() => setShowPassword(!showPassword)}
										/>
									}
								/>
								<View style={styles.errorContainer}>
									{errors.password ? (
										<Text style={styles.error}>
											{errors.password.message}
										</Text>
									) : (
										<Text style={styles.errorPlaceholder}> </Text>
									)}
								</View>
							</View>

							<Button
								mode="contained"
								onPress={handleSubmit(onSubmit)}
								style={styles.button}
							>
								Login
							</Button>

							<Button
								mode="text"
								onPress={() => router.gotoRegister()}
								style={styles.secondaryButton}
							>
								Don't have an account? Register here
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
	avatar: {
		alignSelf: "center",
		marginBottom: 24,
		backgroundColor: "#1976d2",
	},
	logo: {
		width: 120,
		height: 120,
		alignSelf: "center",
		marginBottom: 24,
	},
	inputGroup: {
		marginBottom: 18,
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
