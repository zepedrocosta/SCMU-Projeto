import React from "react";
import { Appbar, Badge } from "react-native-paper";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function Header({ notifications = 0 }) {
	const router = useRouter();

	return (
		<Appbar.Header style={styles.header}>
			<Appbar.Action
				icon="home"
				onPress={() => router.push("/home")}
				accessibilityLabel="Home"
			/>
			<Appbar.Content title="Aquario" />
			<View style={{ marginRight: 16 }}>
				<Appbar.Action
					icon="bell"
					onPress={() => router.push("/notifications")}
					accessibilityLabel="Notifications"
				/>
				{notifications > 0 && <Badge style={styles.badge}>{notifications}</Badge>}
			</View>
		</Appbar.Header>
	);
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: "#fff",
		elevation: 4,
	},
	badge: {
		position: "absolute",
		top: 2,
		right: 2,
	},
});
