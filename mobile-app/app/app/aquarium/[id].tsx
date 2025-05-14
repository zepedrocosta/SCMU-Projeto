import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";

export default function AquariumPage() {
	const { id } = useLocalSearchParams();

	return (
		<View>
			<Text variant="titleLarge">Aquarium Page for ID: {id}</Text>
		</View>
	);
}
