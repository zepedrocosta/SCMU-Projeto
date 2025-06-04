import { Aquarium } from "../types/Aquarium.js";
import { Group } from "../types/Group.js";
import { User, UserDefaults } from "../types/User.js";

export const defaultUser: User = {
	id: "0",
	name: "",
	email: "",
};

export interface State {
	user: User;
	aquariums: Aquarium[];
	defaults: UserDefaults;
	groups: Group[];
}

export const initialState: State = {
	user: defaultUser,
	aquariums: [],
	groups: [],
	defaults: {
		darkMode: false,
	},
};
