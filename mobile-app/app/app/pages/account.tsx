import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text, List, Divider, Button } from "react-native-paper";
import { useStateContext } from "../../context/StateContext";
import { useRoutes } from "../../utils/routes";
import { useLogout } from "../../utils/services/AuthService";
import EditProfileModal from "../../components/EditProfileModal";
export default function AccountPage() {
	const { user } = useStateContext();
	const router = useRoutes();
	const { mutate } = useLogout();

	const [editVisible, setEditVisible] = useState(false);
	const [name, setName] = useState(user.name || "");

	const handleLogout = () => {
		mutate();
	};

	const openEdit = () => {
		setName(user.name || "");
		setEditVisible(true);
	};

	const closeEdit = () => setEditVisible(false);

	const handleSave = () => {
		closeEdit();
	};

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
					title="Edit Profile"
					left={(props) => <List.Icon {...props} icon="account-edit" />}
					onPress={openEdit}
				/>
				<List.Item
					title="Notifications"
					left={(props) => <List.Icon {...props} icon="bell" />}
					onPress={() => {
						router.gotoNotifications();
					}}
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
			<EditProfileModal
				visible={editVisible}
				onClose={closeEdit}
				name={name}
				setName={setName}
				onSave={handleSave}
			/>
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
