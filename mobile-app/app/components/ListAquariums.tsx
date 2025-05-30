import { View, StyleSheet, FlatList } from "react-native";
import { Avatar, List, Text } from "react-native-paper";
import { useRoutes } from "../utils/routes";
import { Aquarium } from "../types/Aquarium";

interface ListAquariumsProps {
	aquariums: Aquarium[];
}

export default function ListAquariums({ aquariums }: ListAquariumsProps) {
	const router = useRoutes();

	const handlePress = (itemId: string) => {
		router.gotoAquarium(itemId);
	};

	return (
		<View style={[styles.section, { flex: 1 }]}>
			<Text variant="titleMedium" style={styles.sectionTitle}>
				Your Aquariums
			</Text>

			<FlatList
				data={aquariums}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<List.Item
						title={item.name}
						description={item.description}
						onPress={() => handlePress(item.id)}
						style={styles.listItem}
						left={(props) => (
							<Avatar.Icon
								{...props}
								icon="fishbowl"
								size={36}
								style={styles.listAvatar}
								color="#fff"
							/>
						)}
					/>
				)}
				style={{ width: "100%" }}
				contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 20 }}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		paddingHorizontal: 20,
		marginBottom: 8,
	},
	sectionTitle: {
		fontWeight: "bold",
		marginBottom: 8,
	},
	listItem: {
		backgroundColor: "#fff",
		marginBottom: 8,
		borderRadius: 8,
		elevation: 1,
	},
	listAvatar: {
		backgroundColor: "#1976d2",
	},
});
