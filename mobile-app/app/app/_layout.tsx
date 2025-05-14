import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "../components/Header";

const queryClient = new QueryClient();

export default function Layout() {
	return (
		<QueryClientProvider client={queryClient}>
			<PaperProvider>
				<Header notifications={3} />
				<Slot />
			</PaperProvider>
		</QueryClientProvider>
	);
}
