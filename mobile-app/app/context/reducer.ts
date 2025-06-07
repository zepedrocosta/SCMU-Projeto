import { defaultUser, State } from "./state";
import { User, UserDefaults } from "../types/User";
import { Aquarium, EditAquarium } from "../types/Aquarium";
import { Group } from "../types/Group";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const EVENTS = {
	SET_USER: "SET_USER",
	SET_AQUARIUMS: "SET_AQUARIUMS",
	SET_GROUPS: "SET_GROUPS",
	SET_DEFAULTS: "SET_DEFAULTS",
	ADD_AQUARIUM: "ADD_AQUARIUM",
	ADD_GROUP: "ADD_GROUP",
	ADD_AQUARIUMS_TO_GROUP: "ADD_AQUARIUMS_TO_GROUP",
	REMOVE_AQUARIUM: "REMOVE_AQUARIUM",
	REMOVE_AQUARIUMS_FROM_GROUP: "REMOVE_AQUARIUMS_FROM_GROUP",
	REMOVE_GROUP: "REMOVE_GROUP",
	CHANGE_WATER_PUMP_STATUS: "CHANGE_WATER_PUMP_STATUS",
	UPDATE_THRESHOLDS: "UPDATE_THRESHOLDS",
	UPDATE_AQUARIUM: "UPDATE_AQUARIUM",
	UPDATE_AQUARIUM_SNAPSHOT: "UPDATE_AQUARIUM_SNAPSHOT",
	CHANGE_NOTIFICATIONS_STATUS: "CHANGE_NOTIFICATIONS_STATUS",
	CLEAR_USER: "CLEAR_USER",
	LOAD_STATE: "LOAD_STATE",
} as const;

export type Action =
	| { type: typeof EVENTS.SET_USER; payload: User }
	| { type: typeof EVENTS.SET_AQUARIUMS; payload: Aquarium[] }
	| { type: typeof EVENTS.SET_GROUPS; payload: Group[] }
	| { type: typeof EVENTS.SET_DEFAULTS; payload: UserDefaults }
	| { type: typeof EVENTS.ADD_AQUARIUM; payload: Aquarium }
	| { type: typeof EVENTS.ADD_GROUP; payload: Group }
	| {
			type: typeof EVENTS.ADD_AQUARIUMS_TO_GROUP;
			payload: {
				groupId: string;
				aquariumIds: string[];
			};
	  }
	| {
			type: typeof EVENTS.REMOVE_AQUARIUM;
			payload: string; // Aquarium ID
	  }
	| {
			type: typeof EVENTS.REMOVE_AQUARIUMS_FROM_GROUP;
			payload: {
				groupId: string;
				aquariumIds: string[];
			};
	  }
	| {
			type: typeof EVENTS.REMOVE_GROUP;
			payload: {
				groupId: string;
			};
	  }
	| { type: typeof EVENTS.CHANGE_WATER_PUMP_STATUS; payload: string }
	| {
			type: typeof EVENTS.UPDATE_THRESHOLDS;
			payload: {
				aquariumId: string;
				thresholds: {
					minTemperature: number;
					maxTemperature: number;
					minPH: number;
					maxPH: number;
					minTds: number;
					maxTds: number;
					minHeight: number;
					maxHeight: number;
				};
			};
	  }
	| { type: typeof EVENTS.UPDATE_AQUARIUM; payload: EditAquarium }
	| {
			type: typeof EVENTS.UPDATE_AQUARIUM_SNAPSHOT;
			payload: {
				aquariumId: string;
				snapshot: {
					snapshotId: string;
					temperature: number;
					light: boolean;
					pH: number;
					tds: number;
					height: number;
					isBombWorking: boolean;
				};
			};
	  }
	| { type: typeof EVENTS.CHANGE_NOTIFICATIONS_STATUS; payload: boolean }
	| { type: typeof EVENTS.CLEAR_USER }
	| { type: typeof EVENTS.LOAD_STATE; payload: State };

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case EVENTS.SET_USER:
			return { ...state, user: action.payload };
		case EVENTS.SET_AQUARIUMS:
			return { ...state, aquariums: action.payload };
		case EVENTS.SET_GROUPS:
			return { ...state, groups: action.payload };
		case EVENTS.SET_DEFAULTS:
			return { ...state, defaults: action.payload };
		case EVENTS.ADD_AQUARIUM:
			return { ...state, aquariums: [...state.aquariums, action.payload] };
		case EVENTS.ADD_GROUP:
			return { ...state, groups: [...state.groups, action.payload] };
		case EVENTS.ADD_AQUARIUMS_TO_GROUP: {
			const { groupId, aquariumIds } = action.payload;
			const updatedGroups = state.groups.map((group) => {
				if (group.id === groupId) {
					const existingAquariums = group.aquariums || [];
					const newAquariums = state.aquariums.filter(
						(aq) =>
							aquariumIds.includes(aq.id) &&
							!existingAquariums.some((ea) => ea.id === aq.id)
					);
					return {
						...group,
						aquariums: [...existingAquariums, ...newAquariums],
					};
				}
				return group;
			});
			return {
				...state,
				groups: updatedGroups,
			};
		}
		case EVENTS.REMOVE_AQUARIUM: {
			const aquariumId = action.payload;
			const updatedAquariums = state.aquariums.filter(
				(aquarium) => aquarium.id !== aquariumId
			);
			const updatedGroups = state.groups.map((group) => ({
				...group,
				aquariums: (group.aquariums || []).filter((aq) => aq.id !== aquariumId),
				numberOfAquariums: group.aquariums ? group.aquariums.length : 0,
			}));
			return {
				...state,
				aquariums: updatedAquariums,
				groups: updatedGroups,
			};
		}
		case EVENTS.REMOVE_AQUARIUMS_FROM_GROUP: {
			const { groupId, aquariumIds } = action.payload;
			const updatedGroups = state.groups.map((group) => {
				if (group.id === groupId) {
					return {
						...group,
						numberOfAquariums: group.aquariums
							? group.aquariums.length - aquariumIds.length
							: 0,
						aquariums: (group.aquariums || []).filter(
							(aq) => !aquariumIds.includes(aq.id)
						),
					};
				}
				return group;
			});
			return {
				...state,
				groups: updatedGroups,
			};
		}
		case EVENTS.REMOVE_GROUP: {
			const { groupId } = action.payload;
			const updatedGroups = state.groups.filter((group) => group.id !== groupId);
			return {
				...state,
				groups: updatedGroups,
			};
		}
		case EVENTS.CHANGE_WATER_PUMP_STATUS: {
			const aquariumId = action.payload;
			const updatedAquariums = state.aquariums.map((aquarium) => {
				if (aquarium.id === aquariumId) {
					return {
						...aquarium,
						isBombWorking: !aquarium.isBombWorking,
					};
				}
				return aquarium;
			});
			return { ...state, aquariums: updatedAquariums };
		}
		case EVENTS.UPDATE_THRESHOLDS: {
			const { aquariumId, thresholds } = action.payload;
			const updatedAquariums = state.aquariums.map((aquarium) => {
				if (aquarium.id === aquariumId) {
					return {
						...aquarium,
						threshold: {
							...aquarium.threshold,
							...thresholds,
						},
					};
				}
				return aquarium;
			});
			return { ...state, aquariums: updatedAquariums };
		}
		case EVENTS.UPDATE_AQUARIUM: {
			const updatedAquarium = action.payload;
			const updatedAquariums = state.aquariums.map((aquarium) => {
				if (aquarium.id === updatedAquarium.id) {
					return {
						...aquarium,
						...updatedAquarium,
					};
				}
				return aquarium;
			});
			return { ...state, aquariums: updatedAquariums };
		}
		case EVENTS.UPDATE_AQUARIUM_SNAPSHOT: {
			const { aquariumId, snapshot } = action.payload;
			const updatedAquariums = state.aquariums.map((aquarium) => {
				if (aquarium.id === aquariumId) {
					return {
						...aquarium,
						snapshot: snapshot,
					};
				}
				return aquarium;
			});
			return { ...state, aquariums: updatedAquariums };
		}
		case EVENTS.CHANGE_NOTIFICATIONS_STATUS: {
			const receiveNotifications = action.payload;
			const updatedDefaults = {
				...state.defaults,
				receiveNotifications,
			};
			return { ...state, defaults: updatedDefaults };
		}
		case EVENTS.CLEAR_USER: {
			AsyncStorage.removeItem("accessToken");
			return {
				...state,
				user: defaultUser,
				aquariums: [],
				groups: [],
				defaults: { darkMode: false, receiveNotifications: true },
			};
		}
		case EVENTS.LOAD_STATE:
			return { ...action.payload };
		default:
			return state;
	}
}
