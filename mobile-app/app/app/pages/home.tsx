import { View, StyleSheet, FlatList } from "react-native";
import { Text, List, Button, Avatar, Divider } from "react-native-paper";
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
			{/* Header Section */}
			<View style={styles.headerSection}>
				<Avatar.Icon icon="fish" size={48} style={styles.headerIcon} color="#fff" />
				<View>
					<Text variant="headlineSmall" style={styles.greeting}>
						Aquarium Manager
					</Text>
					<Text style={styles.subGreeting}>Manage your aquariums</Text>
				</View>
			</View>

			{/* Search Section */}
			<View style={styles.section}>
				<Searchbar
					placeholder="Search aquarium"
					onChangeText={handleSearch}
					value={searchQuery}
					style={styles.searchBar}
				/>
			</View>

			<Divider style={{ marginVertical: 12 }} />

			{/* Aquariums Section */}
			<View style={styles.section}>
				<Text variant="titleMedium" style={styles.sectionTitle}>
					Your Aquariums
				</Text>
				{visibleItems.length === 0 ? (
					<Text style={styles.emptyText}>No aquariums found.</Text>
				) : (
					<FlatList
						data={visibleItems}
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
						contentContainerStyle={{ paddingHorizontal: 0 }}
						showsVerticalScrollIndicator={false}
					/>
				)}
			</View>

			{/* Add Aquarium Button */}
			<View style={styles.addButtonContainer}>
				<Button
					mode="contained"
					onPress={handleAddAquarium}
					style={styles.addButton}
					labelStyle={{ fontSize: 18, fontWeight: "bold" }}
					icon="plus"
				>
					Add Aquarium
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f7fa",
		paddingTop: 32,
		paddingHorizontal: 0,
	},
	headerSection: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1976d2",
		padding: 20,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
		marginBottom: 16,
	},
	headerIcon: {
		backgroundColor: "#1565c0",
		marginRight: 16,
	},
	greeting: {
		color: "#fff",
		fontWeight: "bold",
	},
	subGreeting: {
		color: "#e3f2fd",
	},
	section: {
		paddingHorizontal: 20,
		marginBottom: 8,
	},
	sectionTitle: {
		fontWeight: "bold",
		marginBottom: 8,
	},
	searchBar: {
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
	emptyText: {
		color: "#888",
		textAlign: "center",
		marginTop: 16,
	},
	addButtonContainer: {
		padding: 20,
	},
	addButton: {
		backgroundColor: "#1976D2",
		borderRadius: 25,
		paddingVertical: 12,
		alignSelf: "center",
		width: "100%",
	},
});
