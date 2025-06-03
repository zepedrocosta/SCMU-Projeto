import { useMutation, useQuery } from "@tanstack/react-query";
import { useStateContext } from "../../context/StateContext";
import { EVENTS } from "../../context/reducer";
import { changeWaterPumpStatus, updateThresholds } from "../api/AquariumApi";
import { updateThresholdsRequest } from "../../types/Aquarium";

//region QUERIES

//endregion

//region MUTATIONS
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
