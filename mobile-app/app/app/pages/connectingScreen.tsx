import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function ConnectingScreen() {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" />
			<Text style={styles.text}>Connecting to your aquarium...</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	text: {
		marginTop: 24,
		fontSize: 18,
		color: "#1976d2",
	},
});
