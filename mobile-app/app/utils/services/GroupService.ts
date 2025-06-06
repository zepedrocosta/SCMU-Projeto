import { useMutation, useQuery } from "@tanstack/react-query";
import {
	addAquariumsToGroup,
	addGroup,
	deleteGroup,
	getUserGroups,
	mapGroupResponseToGroup,
} from "../api/GroupApi";
import { useStateContext } from "../../context/StateContext";
import { EVENTS } from "../../context/reducer";

//region QUERIES
export function queryUserGroups() {
	return useQuery({
		queryKey: ["user-groups"],
		queryFn: () => getUserGroups(),
	});
}
//endregion

//region MUTATIONS
export function useAddAquariumsToGroup() {
	const { dispatch } = useStateContext();

	return useMutation({
		mutationFn: (data: { groupId: string; aquariumIds: string[] }) =>
			addAquariumsToGroup(data.groupId, data.aquariumIds),
		onError: (error) => {
			console.error("Error adding aquariums to group:", error);
		},
		onSuccess: (variables) => {
			dispatch({
				type: EVENTS.ADD_AQUARIUMS_TO_GROUP,
				payload: {
					groupId: variables.groupId,
					aquariumIds: variables.aquariumIds,
				},
			});
			console.log("Aquariums added to group successfully:", variables);
		},
	});
}

export function useRemoveAquariumFromGroup() {
	const { dispatch } = useStateContext();

	return useMutation({
		mutationFn: (data: { groupId: string; aquariumIds: string[] }) =>
			addAquariumsToGroup(data.groupId, data.aquariumIds),
		onError: (error) => {
			console.error("Error removing aquariums from group:", error);
		},
		onSuccess: (variables) => {
			dispatch({
				type: EVENTS.REMOVE_AQUARIUMS_FROM_GROUP,
				payload: {
					groupId: variables.groupId,
					aquariumIds: variables.aquariumIds,
				},
			});
			console.log("Aquariums removed from group successfully:", variables);
		},
	});
}

export function useAddGroup() {
	const { dispatch } = useStateContext();

	return useMutation({
		mutationFn: (groupName: string) => addGroup(groupName),
		onError: (error) => {
			console.error("Error adding group:", error);
		},
		onSuccess: (group) => {
			const mappedGroup = mapGroupResponseToGroup(group, []);
			dispatch({
				type: EVENTS.ADD_GROUP,
				payload: mappedGroup,
			});
			console.log("Group added successfully:", group);
		},
	});
}

export function useDeleteGroup() {
	const { dispatch } = useStateContext();

	return useMutation({
		mutationFn: (groupId: string) => deleteGroup(groupId),
		onError: (error) => {
			console.error("Error deleting group:", error);
		},
		onSuccess: (groupId) => {
			dispatch({
				type: EVENTS.REMOVE_GROUP,
				payload: {
					groupId: groupId,
				},
			});
			console.log("Group deleted successfully:", groupId);
		},
	});
}

//endregion
