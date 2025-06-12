import { Slot } from "expo-router";
import BottomBar from "../../components/BottomBar";
import { useStateContext } from "../../context/StateContext";
import { useEffect, useState } from "react";
import { useRoutes } from "../../utils/routes";
import {
	useGetAquariumNotifications,
	useGetLastAquariumSnapshot,
} from "../../utils/services/AquariumService";

function AquariumSnapshotFetcher({ aquariumId }: { aquariumId: string }) {
	useGetLastAquariumSnapshot(aquariumId);
	return null;
}

function AquariumNotificationsFetcher() {
	const [timestamp, setTimestamp] = useState(() => {
		const now = new Date();
		now.setMinutes(now.getMinutes() - 1);
		const datePart = now.toISOString().slice(0, 19);
		const ms = String(now.getMilliseconds()).padStart(3, "0");
		const micros =
			ms +
			Math.floor(Math.random() * 1000)
				.toString()
				.padStart(3, "0");
		return `${datePart}.${micros}`;
	});

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			now.setMinutes(now.getMinutes() - 1);
			const datePart = now.toISOString().slice(0, 19);
			const ms = String(now.getMilliseconds()).padStart(3, "0");
			const micros =
				ms +
				Math.floor(Math.random() * 1000)
					.toString()
					.padStart(3, "0");
			setTimestamp(`${datePart}.${micros}`);
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	useGetAquariumNotifications(timestamp);
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

			{defaults.receiveNotifications && <AquariumNotificationsFetcher />}
			<Slot />
			<BottomBar />
		</>
	);
}
