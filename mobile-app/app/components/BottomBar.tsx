import { useRouter } from "expo-router";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Badge } from "react-native-paper";

export default function BottomBar() {
	const router = useRouter();

	const notifications = -1;

	return (
		<Appbar style={styles.bottomBar}>
			<Appbar.Action icon="magnify" onPress={() => {}} />

			<Appbar.Action
				icon="account"
				onPress={() => {
					router.push("/account");
				}}
			/>

			<Appbar.Action icon="home" onPress={() => router.push("/home")} />

			<Appbar.Action
				icon="plus"
				onPress={() => {
					router.push("/connect-to-aquarium");
				}}
			/>

			<View style={{ marginRight: 16 }}>
				<Appbar.Action icon="bell" onPress={() => router.push("/notifications")} />
				{notifications > 0 && <Badge style={styles.badge}>{notifications}</Badge>}
			</View>
		</Appbar>
	);
}

const styles = StyleSheet.create({
	bottomBar: {
		height: 56,
		backgroundColor: "white",
		elevation: 6,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	badge: {
		position: "absolute",
		top: 2,
		right: 2,
	},
});
