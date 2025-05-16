import { useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text, List, Divider, Button } from "react-native-paper";

export default function AccountPage() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Avatar.Icon size={72} icon="account" style={styles.avatar} />
				<Text variant="titleLarge" style={styles.name}>
					John Doe
				</Text>
				<Text variant="bodyMedium" style={styles.email}>
					john.doe@email.com
				</Text>
			</View>
			<Divider style={{ marginVertical: 16 }} />
			<List.Section>
				<List.Item
					title="Edit Profile"
					left={(props) => <List.Icon {...props} icon="account-edit" />}
					onPress={() => {}}
				/>

				<List.Item
					title="Notifications"
					left={(props) => <List.Icon {...props} icon="bell" />}
					onPress={() => {
						router.push("/notifications");
					}}
				/>
			</List.Section>
			<Divider style={{ marginVertical: 16 }} />
			<Button
				mode="contained-tonal"
				icon="logout"
				onPress={() => {
					// TODO: Implement logout functionality
				}}
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
