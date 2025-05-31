import { defaultUser, State } from "./state";
import { User, UserDefaults } from "../types/User";
import { Aquarium } from "../types/Aquarium";
import { Group } from "../types/Group";

export const EVENTS = {
	SET_USER: "SET_USER",
	SET_AQUARIUMS: "SET_AQUARIUMS",
	SET_GROUPS: "SET_GROUPS",
	SET_DEFAULTS: "SET_DEFAULTS",
	// ADD_AQUARIUM: "ADD_AQUARIUM",
	// ADD_GROUP: "ADD_GROUP",
	ADD_AQUARIUMS_TO_GROUP: "ADD_AQUARIUMS_TO_GROUP",
	CLEAR_USER: "CLEAR_USER",
	LOAD_STATE: "LOAD_STATE",
} as const;

export type Action =
	| { type: typeof EVENTS.SET_USER; payload: User }
	| { type: typeof EVENTS.SET_AQUARIUMS; payload: Aquarium[] }
	| { type: typeof EVENTS.SET_GROUPS; payload: Group[] }
	| { type: typeof EVENTS.SET_DEFAULTS; payload: UserDefaults }
	// | { type: typeof EVENTS.ADD_AQUARIUM; payload: Aquarium }
	// | { type: typeof EVENTS.ADD_GROUP; payload: Group }
	| {
			type: typeof EVENTS.ADD_AQUARIUMS_TO_GROUP;
			payload: {
				groupId: string;
				aquariumIds: string[];
			};
	  }
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
		// case EVENTS.ADD_AQUARIUM:
		// 	return { ...state, aquariums: [...state.aquariums, action.payload] };
		// case EVENTS.ADD_GROUP:
		// 	return { ...state, groups: [...state.groups, action.payload] };
		case EVENTS.ADD_AQUARIUMS_TO_GROUP: {
			const { groupId, aquariumIds } = action.payload;
			const updatedGroups = state.groups.map((group) => {
				if (group.id === groupId) {
					const aquariumsToAdd = state.aquariums.filter((aq) =>
						aquariumIds.includes(aq.id)
					);
					return {
						...group,
						aquariums: [...(group.aquariums || []), ...aquariumsToAdd],
					};
				}
				return group;
			});
			return {
				...state,
				groups: updatedGroups,
			};
		}
		case EVENTS.CLEAR_USER: {
			//TODO REMVOVE FROM async storage the TOKEN
			return {
				...state,
				user: defaultUser,
				aquariums: [],
				groups: [],
				defaults: { darkMode: false },
			};
		}

		case EVENTS.LOAD_STATE:
			return { ...action.payload };
		default:
			return state;
	}
}
