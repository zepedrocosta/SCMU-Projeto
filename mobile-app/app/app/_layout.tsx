import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Layout() {
	return (
		<QueryClientProvider client={queryClient}>
			<PaperProvider>
				<Slot />
			</PaperProvider>
		</QueryClientProvider>
	);
}
