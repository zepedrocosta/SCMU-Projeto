import { View, StyleSheet } from "react-native";
import { Avatar, Text, List, Divider, Button, Switch } from "react-native-paper";
import { useCallback } from "react";
import { useStateContext } from "../../context/StateContext";
import { useLogout } from "../../utils/services/AuthService";
import { EVENTS } from "../../context/reducer";

export default function AccountPage() {
	const { user, defaults, dispatch } = useStateContext();
	const { mutate } = useLogout();

	const handleLogout = () => {
		mutate();
	};

	const toggleNotifications = useCallback(() => {
		dispatch({
			type: EVENTS.CHANGE_NOTIFICATIONS_STATUS,
			payload: !defaults.receiveNotifications,
		});
	}, [dispatch, defaults.receiveNotifications]);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Avatar.Icon size={72} icon="account" style={styles.avatar} />
				<Text variant="titleLarge" style={styles.name}>
					{user.name || "Test User"}
				</Text>
				<Text variant="bodyMedium" style={styles.email}>
					{user.email || "test@gmail.com"}
				</Text>
			</View>
			<Divider style={{ marginVertical: 16 }} />
			<List.Section>
				<List.Item
					title="Receive notifications"
					left={(props) => <List.Icon {...props} icon="bell-ring" />}
					right={() => (
						<Switch
							value={defaults.receiveNotifications}
							onValueChange={toggleNotifications}
						/>
					)}
				/>
			</List.Section>
			<Divider style={{ marginVertical: 16 }} />
			<Button
				mode="contained-tonal"
				icon="logout"
				onPress={handleLogout}
				style={styles.logout}
			>
				Logout
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: "#fff",
	},
	header: {
		alignItems: "center",
		marginBottom: 8,
	},
	avatar: {
		backgroundColor: "#2196f3",
		marginBottom: 8,
	},
	name: {
		marginTop: 4,
		fontWeight: "bold",
	},
	email: {
		color: "#888",
	},
	logout: {
		marginTop: 24,
	},
});
