import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StateProvider } from "../context/StateContext";

const queryClient = new QueryClient();

export default function Layout() {
	return (
		<QueryClientProvider client={queryClient}>
			<StateProvider>
				<PaperProvider>
					<Slot />
				</PaperProvider>
			</StateProvider>
		</QueryClientProvider>
	);
}
