import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function HomePage() {
	return (
		<View style={styles.container}>
			<Text variant="titleLarge">Welcome to the Home Page!</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
