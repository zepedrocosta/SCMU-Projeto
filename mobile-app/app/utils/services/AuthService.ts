import { useMutation } from "@tanstack/react-query";
import { LoginRequest, RegisterRequest } from "../../types/Auth";
import { authenticateUser, logoutUser } from "../api/AuthApi";
import { getLastAquariumSnapshot, getUserAquariums } from "../api/AquariumApi";
import { getUserInfo, registerUser } from "../api/UserApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStateContext } from "../../context/StateContext";
import { EVENTS } from "../../context/reducer";
import { useRoutes } from "../routes";
import { getGroupAquariums, getUserGroups, mapGroupResponseToGroup } from "../api/GroupApi";
import { Aquarium } from "../../types/Aquarium";
import { Group, GroupResponse } from "../../types/Group";

export function useLogin() {
	const { dispatch } = useStateContext();

	return useMutation({
		mutationFn: (data: LoginRequest) => authenticateUser(data),
		onError: (error) => {
			console.error("Login error:", error);
		},
		onSuccess: async (response) => {
			const data = response;

			console.log("Login successful:", data);

			await AsyncStorage.setItem("accessToken", data.accessToken);

			try {
				const [userInfo, userAquariums, userGroups] = await Promise.all([
					getUserInfo(data.nickname),
					getUserAquariums(),
					getUserGroups(),
				]);

				if (userInfo) {
					dispatch({ type: EVENTS.SET_USER, payload: userInfo });
					dispatch({ type: EVENTS.SET_DEFAULTS, payload: userInfo.defaults });
				} else {
					console.error("User not found");
				}

				if (userAquariums) {
					dispatch({ type: EVENTS.SET_AQUARIUMS, payload: userAquariums });
					console.log("User aquariums:", userAquariums);
				} else {
					dispatch({ type: EVENTS.SET_AQUARIUMS, payload: [] });
					console.log("No aquariums found for user");
				}

				userAquariums.forEach((aquarium) => {
					getLastAquariumSnapshot(aquarium.id)
						.then((snapshot) => {
							dispatch({
								type: EVENTS.UPDATE_AQUARIUM_SNAPSHOT,
								payload: { aquariumId: aquarium.id, snapshot },
							});
						})
						.catch((error) => {
							console.error(
								`Failed to fetch snapshot for aquarium ${aquarium.id}`,
								error
							);
						});
				});

				if (userGroups) {
					const groupsWithAquariums = await Promise.all(
						userGroups.map(async (group) => {
							try {
								const aquariumIds = await getGroupAquariums(group.id);
								return { ...group, aquariumsIds: aquariumIds };
							} catch (error) {
								console.error(
									`Failed to fetch aquariums for group ${group.id}`,
									error
								);
								return { ...group, aquariumsIds: [] };
							}
						})
					);
					const mappedGroups = mapAquariumsToGroups(
						userAquariums,
						groupsWithAquariums
					);
					dispatch({ type: EVENTS.SET_GROUPS, payload: mappedGroups });
					console.log("User groups:", userGroups);
				} else {
					dispatch({ type: EVENTS.SET_GROUPS, payload: [] });
					console.log("No groups found for user");
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		},
	});
}

function mapAquariumsToGroups(aquariums: Aquarium[], groups: GroupResponse[]): Group[] {
	return groups.map((group) => {
		const g = mapGroupResponseToGroup(group, aquariums);
		return {
			...g,
			color: g.color,
		};
	});
}

export function useRegister() {
	return useMutation({
		mutationFn: (data: RegisterRequest) => registerUser(data),
		onError: (error) => {
			console.error("Register error:", error);
		},
		onSuccess: async (response) => {
			const data = response;
			console.log("Register successful:", data);
		},
	});
}

export function useLogout() {
	const router = useRoutes();

	const { dispatch } = useStateContext();

	return useMutation({
		mutationFn: () => logoutUser(),
		onError: (error) => {
			console.error("Register error:", error);
		},
		onSuccess: async (response) => {
			dispatch({ type: EVENTS.CLEAR_USER });
			router.gotoIndex();
			console.log("Logout successful");
		},
	});
}
