// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { View, StyleSheet, Image } from "react-native";
// import { TextInput, Button, Text, Card } from "react-native-paper";
// import { useRouter } from "expo-router";
// import { useState } from "react";

// const loginSchema = z.object({
// 	email: z.string().email({ message: "Invalid email" }),
// 	password: z.string().min(6, { message: "Min 6 characters" }),
// });

// type LoginInput = z.infer<typeof loginSchema>;

// export default function LoginPage() {
// 	const {
// 		register,
// 		handleSubmit,
// 		setValue,
// 		formState: { errors },
// 	} = useForm<LoginInput>({
// 		resolver: zodResolver(loginSchema),
// 	});

// 	const [showPassword, setShowPassword] = useState(false);

// 	const router = useRouter();

// 	const onSubmit = (data: LoginInput) => {
// 		console.log("Login data:", data);
// 		router.push("/home");
// 	};

// 	return (
// 		<View style={styles.container}>
// 			<Image source={require("../assets/favicon.png")} style={styles.logo} />

// 			<Card>
// 				<Card.Title title="Login" />
// 				<Card.Content>
// 					<TextInput
// 						label="Email"
// 						mode="outlined"
// 						onChangeText={(text) => setValue("email", text)}
// 						error={!!errors.email}
// 					/>
// 					{errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

// 					<TextInput
// 						label="Password"
// 						mode="outlined"
// 						secureTextEntry={!showPassword}
// 						onChangeText={(text) => setValue("password", text)}
// 						error={!!errors.password}
// 						style={{ marginTop: 16 }}
// 						right={
// 							<TextInput.Icon
// 								icon={showPassword ? "eye-off" : "eye"}
// 								onPress={() => setShowPassword(!showPassword)}
// 							/>
// 						}
// 					/>
// 					{errors.password && (
// 						<Text style={styles.error}>{errors.password.message}</Text>
// 					)}

// 					<Button
// 						mode="contained"
// 						onPress={handleSubmit(onSubmit)}
// 						style={{ marginTop: 24 }}
// 					>
// 						Login
// 					</Button>
// 				</Card.Content>
// 			</Card>
// 		</View>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: "center",
// 		padding: 16,
// 	},
// 	error: {
// 		color: "red",
// 		marginTop: 4,
// 	},
// 	logo: {
// 		width: 150,
// 		height: 150,
// 		marginBottom: 40,
// 	},
// });

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function LoginPage() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<Card>
				<Card.Title title="Temporary Login Bypass" />
				<Card.Content>
					<Button
						mode="contained"
						onPress={() => {
							console.log("Bypassed login");
							router.push("/home");
						}}
						style={{ marginTop: 24 }}
					>
						Login
					</Button>
				</Card.Content>
			</Card>
		</View>
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
	logo: {
		width: 150,
		height: 150,
		marginBottom: 40,
	},
});
