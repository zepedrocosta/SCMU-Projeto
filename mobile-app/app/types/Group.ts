import { Aquarium } from "./Aquarium";

export type Group = {
	id: string;
	name: string;
	description: string;
	color: string;
	aquariums: Aquarium[];
};

export type GroupResponseAxios = {
	id: string;
	name: string;
	aquariumsIds: string[];
};

export type GroupResponse = {
	id: string;
	name: string;
	description: string;
	aquariumsIds: string[];
};
