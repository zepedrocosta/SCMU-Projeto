import { useMutation, useQuery } from "@tanstack/react-query";
import { useStateContext } from "../../context/StateContext";
import { EVENTS } from "../../context/reducer";
import { changeWaterPumpStatus } from "../api/AquariumApi";

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
