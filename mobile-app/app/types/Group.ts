import { Aquarium } from "./Aquarium";

export type Group = {
	id: string;
	name: string;
	description: string;
	color: string;
	createdAt: string;
	aquariums: Aquarium[];
};

export type GroupResponse = {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	aquariumsIds: string[];
};
