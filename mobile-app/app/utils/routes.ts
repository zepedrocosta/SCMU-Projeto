import { useRouter } from "expo-router";
import { Group } from "../types/Group";

export const ROUTES = {
	INDEX: "/",
	HOME: "/pages/home",
	ACCOUNT: "/pages/account",
	AQUARIUM: "/pages/aquarium",
	NOTIFICATIONS: "/pages/notifications",
	REGISTER: "/pages/register",
	CONNECT_TO_ESP: "/pages/connectToEsp",
	CONNECTIING: "/pages/connectingScreen",
	GROUPS: "/pages/groups",
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

	const gotoConnectToEsp = () => {
		router.push(ROUTES.CONNECT_TO_ESP);
	};

	const gotoConnectingScreen = () => {
		router.push(ROUTES.CONNECTIING);
	};

	const gotoGroups = () => {
		router.push(ROUTES.GROUPS);
	};

	const gotoGroup = (group: Group) => {
		router.push({
			pathname: `${ROUTES.GROUPS}/${group.id}`,
			params: {
				name: group.name,
				description: group.description,
				numberOfAquariums: group.numberOfAquariums,
				color: group.color,
				aquariumsIds: group.aquariums.map((a) => a.id),
			},
		});
	};

	return {
		gotoIndex,
		gotoHome,
		gotoAccount,
		gotoAquarium,
		gotoNotifications,
		gotoNotification,
		gotoRegister,
		gotoConnectToEsp,
		gotoConnectingScreen,
		gotoGroups,
		gotoGroup,
	};
};
