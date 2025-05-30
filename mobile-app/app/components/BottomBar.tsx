import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Badge } from "react-native-paper";
import { useRoutes } from "../utils/routes";

export default function BottomBar() {
	const router = useRoutes();

	const notifications = -1;

	return (
		<Appbar style={styles.bottomBar}>
			<Appbar.Action icon="apps" onPress={() => router.gotoGroups()} />

			<Appbar.Action
				icon="account"
				onPress={() => {
					router.gotoAccount();
				}}
			/>

			<Appbar.Action icon="home" onPress={() => router.gotoHome()} />

			<Appbar.Action
				icon="plus"
				onPress={() => {
					router.gotoConnectToEsp();
				}}
			/>

			<View style={{ marginRight: 16 }}>
				<Appbar.Action icon="bell" onPress={() => router.gotoNotifications()} />
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
