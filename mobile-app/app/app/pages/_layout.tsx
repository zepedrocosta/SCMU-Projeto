import { Slot, useRouter } from "expo-router";
import BottomBar from "../../components/BottomBar";
import { useStateContext } from "../../context/StateContext";
import { useEffect } from "react";
import { useRoutes } from "../../utils/routes";

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

	return (
		<>
			<Slot />
			<BottomBar />
		</>
	);
}
