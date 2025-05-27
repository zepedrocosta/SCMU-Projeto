export type Aquarium = {
	id: string;
	name: string;
	description: string;
};

export type AquariumResponse = {
	id: string;
	name: string;
	description: string;
};

export type AquariumListResponse = {
	aquariumList: AquariumResponse[];
};
