import { View, StyleSheet, FlatList } from "react-native";
import { Text, List } from "react-native-paper";
import { useRouter } from "expo-router";
import { Searchbar } from "react-native-paper";
import { useState } from "react";

const items = [
	{ id: "1", title: "Item 1", description: "Go to Item 1 page" },
	{ id: "2", title: "Item 2", description: "Go to Item 2 page" },
	{ id: "3", title: "Item 3", description: "Go to Item 3 page" },
	{ id: "4", title: "Item 4", description: "Go to Item 4 page" },
	{ id: "5", title: "Item 5", description: "Go to Item 5 page" },
	{ id: "6", title: "Item 6", description: "Go to Item 6 page" },
	{ id: "7", title: "Item 7", description: "Go to Item 7 page" },
	{ id: "8", title: "Item 8", description: "Go to Item 8 page" },
	{ id: "9", title: "Item 9", description: "Go to Item 9 page" },
	{ id: "10", title: "Item 10", description: "Go to Item 10 page" },
	{ id: "11", title: "Item 11", description: "Go to Item 11 page" },
	{ id: "12", title: "Item 12", description: "Go to Item 12 page" },
	{ id: "13", title: "Item 13", description: "Go to Item 13 page" },
	{ id: "14", title: "Item 14", description: "Go to Item 14 page" },
	{ id: "15", title: "Item 15", description: "Go to Item 15 page" },
	{ id: "16", title: "Item 16", description: "Go to Item 16 page" },
	{ id: "17", title: "Item 17", description: "Go to Item 17 page" },
	{ id: "18", title: "Item 18", description: "Go to Item 18 page" },
	{ id: "19", title: "Item 19", description: "Go to Item 19 page" },
	{ id: "20", title: "Item 20", description: "Go to Item 20 page" },
];

export default function HomePage() {
	const router = useRouter();

	const [visibleItems, setVisibleItems] = useState(items);

	const [searchQuery, setSearchQuery] = useState("");

	const handlePress = (itemId: string) => {
		router.push(`/aquarium/${itemId}`);
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		if (query) {
			const filteredItems = items.filter((item) =>
				item.title.toLowerCase().includes(query.toLowerCase())
			);
			setVisibleItems(filteredItems);
		} else {
			setVisibleItems(items);
		}
	};

	return (
		<View style={styles.container}>
			<Text variant="titleLarge" style={{ marginBottom: 16 }}>
				Welcome to the Home Page!
			</Text>

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
						title={item.title}
						description={item.description}
						onPress={() => handlePress(item.id)}
						style={styles.listItem}
					/>
				)}
				style={{ width: "100%" }}
				contentContainerStyle={{ paddingHorizontal: 16 }}
				showsVerticalScrollIndicator={false}
			/>
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
});
