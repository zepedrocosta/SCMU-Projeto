import { Aquarium } from "../types/Aquarium.js";
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
}

export const initialState: State = {
	user: defaultUser,
	aquariums: [],
	defaults: {
		darkMode: false,
	},
};
