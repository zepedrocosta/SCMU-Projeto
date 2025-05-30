import { Aquarium } from "./Aquarium";

export type Group = {
	id: string;
	name: string;
	description: string;
	numberOfAquariums: number;
	color: string;
	createdAt: string;
	aquariums: Aquarium[];
};

export type GroupResponse = {
	id: string;
	name: string;
	description: string;
	numberOfAquariums: number;
	color: string;
	createdAt: string;
	aquariumsIds: string[];
};
