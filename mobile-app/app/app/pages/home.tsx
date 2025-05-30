import { View, StyleSheet, FlatList } from "react-native";
import { Text, List, Button } from "react-native-paper";
import { Searchbar } from "react-native-paper";
import { useState } from "react";
import { useStateContext } from "../../context/StateContext";
import { useRoutes } from "../../utils/routes";

export default function HomePage() {
	const { aquariums } = useStateContext();
	const router = useRoutes();

	const [visibleItems, setVisibleItems] = useState(aquariums);

	const [searchQuery, setSearchQuery] = useState("");

	const handlePress = (itemId: string) => {
		router.gotoAquarium(itemId);
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		if (query) {
			const filteredItems = aquariums.filter((item) =>
				item.name.toLowerCase().includes(query.toLowerCase())
			);
			setVisibleItems(filteredItems);
		} else {
			setVisibleItems(aquariums);
		}
	};

	const handleAddAquarium = () => {
		router.gotoConnectToEsp();
	};

	return (
		<View style={styles.container}>
			{visibleItems.length === 0 ? (
				<View>
					<Button
						mode="contained"
						onPress={handleAddAquarium}
						style={styles.addButton}
						labelStyle={{ fontSize: 20, fontWeight: "bold" }}
					>
						Add Aquarium
					</Button>
				</View>
			) : (
				<>
					<Searchbar
						placeholder="Search aquarium"
						onChangeText={handleSearch}
						value={searchQuery}
						style={{ width: "95%", marginBottom: 25 }}
					/>

					<FlatList
						data={visibleItems}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<List.Item
								title={item.name}
								description={item.description}
								onPress={() => handlePress(item.id)}
								style={styles.listItem}
							/>
						)}
						style={{ width: "100%" }}
						contentContainerStyle={{ paddingHorizontal: 16 }}
						showsVerticalScrollIndicator={false}
					/>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 40,
	},
	listItem: {
		backgroundColor: "#fff",
		marginBottom: 8,
		borderRadius: 8,
		elevation: 1,
	},
	addButton: {
		marginTop: 16,
		backgroundColor: "#1976D2",
		borderRadius: 25,
		paddingVertical: 16,
		paddingHorizontal: 40,
		alignSelf: "center",
	},
});
