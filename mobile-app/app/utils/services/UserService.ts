import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserInfo, updateUserInfo } from "../api/UserApi";
import { UserUpdateRequest } from "../../types/User";
import { useStateContext } from "../../context/StateContext";
import { EVENTS } from "../../context/reducer";

//region QUERIES
export function queryUserInfo(userId: string) {
	return useQuery({
		queryKey: ["user-info"],
		queryFn: () => getUserInfo(userId),
	});
}
//endregion

//region MUTATIONS
export function useUpdateUserInfo() {
	const { user, dispatch } = useStateContext();

	return useMutation({
		mutationFn: (data: UserUpdateRequest) => updateUserInfo(user.id, data),
		onError: (error) => {
			console.error("Error updating user info:", error);
		},
		onSuccess: (response) => {
			dispatch({ type: EVENTS.SET_USER, payload: { ...user, ...response } });

			console.log("User info updated successfully:", response);
		},
	});
}
