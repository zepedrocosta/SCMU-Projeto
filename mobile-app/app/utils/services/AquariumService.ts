import { useMutation, useQuery } from "@tanstack/react-query";
import { useStateContext } from "../../context/StateContext";
import { EVENTS } from "../../context/reducer";
import {
	changeWaterPumpStatus,
	createAquarium,
	deleteAquarium,
	editAquarium,
	fetchNotifications,
	getAquariumSnapshots,
	getLastAquariumSnapshot,
	shareAquarium,
	updateThresholds,
} from "../api/AquariumApi";
import {
	CreateAquariumRequest,
	EditAquarium,
	ShareAquariumRequest,
	updateThresholdsRequest,
} from "../../types/Aquarium";
import { useEffect } from "react";

//region QUERIES
export function useGetLastAquariumSnapshot(aquariumId: string) {
	const { dispatch } = useStateContext();

	const query = useQuery({
		queryKey: ["lastAquariumSnapshot", aquariumId],
		queryFn: () => getLastAquariumSnapshot(aquariumId),
		refetchInterval: 10000,
	});

	useEffect(() => {
		if (query.data) {
			dispatch({
				type: EVENTS.UPDATE_AQUARIUM_SNAPSHOT,
				payload: {
					aquariumId,
					snapshot: {
						id: query.data.id,
						temperature: query.data.temperature,
						light: query.data.ldr ? true : false,
						ph: query.data.ph,
						tds: query.data.tds,
						height: query.data.height,
						isBombWorking: query.data.isBombWorking,
					},
				},
			});
		}
	}, [query.data, aquariumId, dispatch]);

	return query;
}

export function useGetAquariumSnapshots(aquariumId: string) {
	const { dispatch } = useStateContext();

	const query = useQuery({
		queryKey: ["snapshots", aquariumId],
		queryFn: () => getAquariumSnapshots(aquariumId),
		refetchInterval: 5000,
	});

	useEffect(() => {
		const snapshots = query.data || [];
		if (snapshots) {
			dispatch({
				type: EVENTS.UPDATE_HISTORY,
				payload: {
					aquariumId: aquariumId,
					snapshots: snapshots,
				},
			});
		}
	}, [query.data, aquariumId, dispatch]);

	return query;
}

export function useGetAquariumNotifications(timestamp: string) {
	const { dispatch, unreadNotifications } = useStateContext();

	const query = useQuery({
		queryKey: ["notifications", timestamp],
		queryFn: () => fetchNotifications(timestamp),
	});

	useEffect(() => {
		if (query.data) {
			dispatch({
				type: EVENTS.UPDATE_NOTIFICATIONS,
				payload: {
					notification: query.data.map((notification) => ({
						notificationId: notification.id,
						message: notification.message,
						createdDate: notification.createdDate,
						snapshotId: notification.snapshotId,
						unread: true,
						aquariumId: notification.aquariumId,
					})),
				},
			});
			dispatch({
				type: EVENTS.SET_UNREAD_NOTIFICATIONS,
				payload: query.data.length + unreadNotifications,
			});
		}
	}, [query.data, dispatch]);

	return query;
}
//endregion

//region MUTATIONS
export function useCreateAquarium() {
	const { dispatch } = useStateContext();
	return useMutation({
		mutationFn: (data: CreateAquariumRequest) => createAquarium(data),
		onError: (error) => {
			console.error("Error creating aquarium:", error);
		},
		onSuccess: (data) => {
			console.log("Aquarium created successfully service:", data);
			dispatch({
				type: EVENTS.ADD_AQUARIUM,
				payload: data,
			});
			console.log(`Aquarium created successfully with ID: ${data.id}`);
		},
	});
}

export function useShareAquarium() {
	return useMutation({
		mutationFn: (data: ShareAquariumRequest) => shareAquarium(data),
		onError: (error) => {
			console.error("Error changing water pump status:", error);
		},
		onSuccess: (aquariumId) => {
			console.log(`Aquarium shared successfully with ID: ${aquariumId}`);
		},
	});
}

export function useChangeWaterPumpStatus() {
	const { dispatch } = useStateContext();

	return useMutation({
		mutationFn: (aquariumId: string) => changeWaterPumpStatus(aquariumId),
		onError: (error) => {
			console.error("Error changing water pump status:", error);
		},
		onSuccess: (aquariumId) => {
			dispatch({
				type: EVENTS.CHANGE_WATER_PUMP_STATUS,
				payload: aquariumId,
			});
			console.log(`Water pump status for aquarium ${aquariumId} changed successfully`);
		},
	});
}

export function useUpdateThresholds() {
	const { dispatch } = useStateContext();

	return useMutation({
		mutationFn: (data: updateThresholdsRequest) => updateThresholds(data),
		onError: (error) => {
			console.error("Error updating thresholds:", error);
		},
		onSuccess: (data) => {
			dispatch({
				type: EVENTS.UPDATE_THRESHOLDS,
				payload: {
					aquariumId: data.aquariumId,
					thresholds: {
						minTemperature: data.minTemperature,
						maxTemperature: data.maxTemperature,
						minPH: data.minPH,
						maxPH: data.maxPH,
						minTds: data.minTds,
						maxTds: data.maxTds,
						minHeight: data.minHeight,
						maxHeight: data.maxHeight,
					},
				},
			});
			console.log("Thresholds updated successfully:", data);
		},
	});
}

export function useDeleteAquarium() {
	const { dispatch } = useStateContext();

	return useMutation({
		mutationFn: (data: string) => deleteAquarium(data),
		onError: (error) => {
			console.error("Error deleting aquarium:", error);
		},
		onSuccess: (data) => {
			dispatch({
				type: EVENTS.REMOVE_AQUARIUM,
				payload: data,
			});
			console.log(`Aquarium with ID ${data} deleted successfully`);
		},
	});
}

export function useEditAquarium() {
	const { dispatch } = useStateContext();

	return useMutation({
		mutationFn: (data: EditAquarium) => editAquarium(data),
		onError: (error) => {
			console.error("Error editing aquarium:", error);
		},
		onSuccess: (data) => {
			dispatch({
				type: EVENTS.UPDATE_AQUARIUM,
				payload: data,
			});
			console.log(`Aquarium with ID ${data} deleted successfully`);
		},
	});
}
//endregion
