// filepath: c:\Users\Rafael\Documents\Universidade\2024_2025\2 Semestre\SCMU\projeto\repo\SCMU-Projeto\mobile-app\app\app\_layout.tsx
import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StateProvider } from "../context/StateContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export default function Layout() {
	return (
		<QueryClientProvider client={queryClient}>
			<StateProvider>
				<PaperProvider>
					<SafeAreaProvider>
						<SafeAreaView
							style={{ flex: 1 }}
							edges={["top", "bottom", "left", "right"]}
						>
							<Slot />
						</SafeAreaView>
					</SafeAreaProvider>
				</PaperProvider>
			</StateProvider>
		</QueryClientProvider>
	);
}
