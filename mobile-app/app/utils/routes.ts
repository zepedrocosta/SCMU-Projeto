import { useRouter } from "expo-router";

export const ROUTES = {
	INDEX: "/",
	HOME: "/pages/home",
	ACCOUNT: "/pages/account",
	AQUARIUM: "/pages/aquarium",
	SNAPSHOT: "/pages/snapshot",
	NOTIFICATIONS: "/pages/notifications",
	REGISTER: "/register",
	CONNECT_TO_ESP: "/pages/connectToEsp",
	CONNECTIING: "/pages/connectingScreen",
	GROUPS: "/pages/groups",
	SEND_WIFI_FORM: "/pages/SendWifiForm",
	HISTORIY: "/pages/aquariumHistory",
	ADD_AQUARIUM_FORM: "/pages/addAquariumForm",
	DEFINE_AQUARIUM_THRESHOLDS: "/pages/defineAquariumThresholds",
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

	const gotoSnapshot = (snapshotId: string) => {
		router.push(`${ROUTES.SNAPSHOT}/${snapshotId}`);
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

	const gotoGroup = (groupId: string) => {
		router.push(`${ROUTES.GROUPS}/${groupId}`);
	};

	const gotoSendWifiForm = () => {
		router.push(ROUTES.SEND_WIFI_FORM);
	};

	const gotoAquariumHistory = (aquariumId: string) => {
		router.push(`${ROUTES.HISTORIY}/${aquariumId}`);
	};

	const gotoAddAquariumForm = (macAddress: string) => {
		router.push(`${ROUTES.ADD_AQUARIUM_FORM}?macAddress=${macAddress}`);
	};

	const gotoDefineAquariumThresholds = (aquariumId: string) => {
		router.push(`${ROUTES.DEFINE_AQUARIUM_THRESHOLDS}/${aquariumId}`);
	};

	return {
		expo: router,
		gotoIndex,
		gotoHome,
		gotoAccount,
		gotoAquarium,
		gotoNotifications,
		gotoRegister,
		gotoConnectToEsp,
		gotoConnectingScreen,
		gotoGroups,
		gotoGroup,
		gotoSendWifiForm,
		gotoAquariumHistory,
		gotoAddAquariumForm,
		gotoDefineAquariumThresholds,
		gotoSnapshot,
	};
};
