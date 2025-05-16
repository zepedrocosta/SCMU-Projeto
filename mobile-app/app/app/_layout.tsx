import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BottomBar from "../components/BottomBar";
import { StateProvider } from "../context/StateContext";

const queryClient = new QueryClient();

export default function Layout() {
	return (
		<QueryClientProvider client={queryClient}>
			<StateProvider>
				<PaperProvider>
					<Slot />
					<BottomBar />
				</PaperProvider>
			</StateProvider>
		</QueryClientProvider>
	);
}
