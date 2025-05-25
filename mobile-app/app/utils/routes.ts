import { useRouter } from "expo-router";

export const ROUTES = {
	INDEX: "/",
	HOME: "/pages/home",
	ACCOUNT: "/pages/account",
	AQUARIUM: "/pages/aquarium",
	NOTIFICATIONS: "/pages/notifications",
	REGISTER: "/pages/register",
};

export const useRoutes = () => {
	const router = useRouter();

	const gotoIndex = () => {
		router.push(ROUTES.INDEX);
	};

	const gotoHome = (replaceRoute = false) => {
		if (replaceRoute) {
			router.replace(ROUTES.HOME);
		} else {
			router.push(ROUTES.HOME);
		}
	};

	const gotoAccount = () => {
		router.push(ROUTES.ACCOUNT);
	};

	const gotoAquarium = (aquariumId: string) => {
		router.push(`${ROUTES.AQUARIUM}/${aquariumId}`);
	};

	const gotoNotifications = () => {
		router.push(ROUTES.NOTIFICATIONS);
	};

	const gotoNotification = (notificationId: string) => {
		router.push(`${ROUTES.NOTIFICATIONS}/${notificationId}`);
	};

	const gotoRegister = () => {
		router.push(ROUTES.REGISTER);
	};

	return {
		gotoIndex,
		gotoHome,
		gotoAccount,
		gotoAquarium,
		gotoNotifications,
		gotoNotification,
		gotoRegister,
	};
};
