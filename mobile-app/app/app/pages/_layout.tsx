import { Slot } from "expo-router";
import BottomBar from "../../components/BottomBar";
import { useStateContext } from "../../context/StateContext";
import { useEffect } from "react";
import { useRoutes } from "../../utils/routes";
import {
	useGetAquariumNotifications,
	useGetLastAquariumSnapshot,
} from "../../utils/services/AquariumService";

function AquariumSnapshotFetcher({ aquariumId }: { aquariumId: string }) {
	useGetLastAquariumSnapshot(aquariumId);
	return null;
}

function AquariumNotificationsFetcher({ aquariumId }: { aquariumId: string }) {
	useGetAquariumNotifications(aquariumId, new Date().toISOString());
	return null;
}

export default function PagesLayout() {
	const { isLoggedIn, loading, aquariums, defaults } = useStateContext();
	const router = useRoutes();

	useEffect(() => {
		if (!loading && !isLoggedIn) {
			router.gotoIndex();
		}
	}, [loading, isLoggedIn]);

	if (loading) {
		return null;
	}

	return (
		<>
			{aquariums.map((aq) => (
				<AquariumSnapshotFetcher key={aq.id} aquariumId={aq.id} />
			))}

			{defaults.receiveNotifications &&
				aquariums.map((aq) => (
					<AquariumNotificationsFetcher key={aq.id} aquariumId={aq.id} />
				))}
			<Slot />
			<BottomBar />
		</>
	);
}
