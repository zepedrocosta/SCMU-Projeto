import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserInfo, updateUserInfo } from "../api/UserApi";
import { UserUpdateRequest } from "../../types/User";
import { useStateContext } from "../../context/StateContext";

//region QUERIES
export function queryUserInfo(userId: string) {
	return useQuery({
		queryKey: ["user-info"],
		queryFn: () => getUserInfo(userId),
	});
}
//endregion

//region MUTATIONS
export function useUpdateUserInfoMutation() {
	const { user, dispatch } = useStateContext();

	return useMutation({
		mutationFn: (data: UserUpdateRequest) => updateUserInfo(user.id, data),
		onError: (error) => {
			console.error("Error updating user info:", error);
		},
		onSuccess: (response) => {
			// Update the user info in the state context
			dispatch({ type: "SET_USER", payload: { ...user, ...response } });

			console.log("User info updated successfully:", response);
		},
	});
}
