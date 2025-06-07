import { Slot } from "expo-router";
import BottomBar from "../../components/BottomBar";
import { useStateContext } from "../../context/StateContext";
import { useEffect } from "react";
import { useRoutes } from "../../utils/routes";
import { useGetLastAquariumSnapshot } from "../../utils/services/AquariumService";
import { sleep } from "../../utils/api/axiosConfig";

export default function PagesLayout() {
	const { isLoggedIn, loading } = useStateContext();

	const router = useRoutes();

	useEffect(() => {
		if (!loading && !isLoggedIn) {
			router.gotoIndex();
		}
	}, [loading, isLoggedIn]);

	if (loading) {
		return null;
	}

	const { aquariums } = useStateContext();

	aquariums.forEach((aquarium) => {
		sleep(200);
		useGetLastAquariumSnapshot(aquarium.id);
	});

	return (
		<>
			<Slot />
			<BottomBar />
		</>
	);
}
