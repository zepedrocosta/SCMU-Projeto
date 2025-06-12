import { StyleSheet, View } from "react-native";
import { Appbar, Badge } from "react-native-paper";
import { useRoutes } from "../utils/routes";
import { useStateContext } from "../context/StateContext";

export default function BottomBar() {
	const router = useRoutes();

	const { unreadNotifications } = useStateContext();

	return (
		<Appbar style={styles.bottomBar}>
			<Appbar.Action
				style={styles.symbol}
				icon="apps"
				onPress={() => router.gotoGroups()}
			/>

			<Appbar.Action
				style={styles.symbol}
				icon="account"
				onPress={() => {
					router.gotoAccount();
				}}
			/>

			<Appbar.Action
				style={styles.symbol}
				icon="home"
				onPress={() => router.gotoHome()}
			/>

			<View>
				<Appbar.Action
					style={styles.symbol}
					icon="bell"
					onPress={() => router.gotoNotifications()}
				/>
				{unreadNotifications > 0 && (
					<Badge style={styles.badge}>{unreadNotifications}</Badge>
				)}
			</View>
		</Appbar>
	);
}

const styles = StyleSheet.create({
	bottomBar: {
		height: 56,
		backgroundColor: "#ffffff",
		elevation: 6,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	symbol: {
		marginLeft: 20,
	},
	badge: {
		position: "absolute",
		top: 2,
		right: 2,
	},
	menuContent: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		paddingVertical: 4,
		minWidth: 200,
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
	},
	menuItemText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1976D2",
		letterSpacing: 0.5,
	},
});
