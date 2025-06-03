export type Aquarium = {
	id: string;
	name: string;
	location: string;
	isBombWorking: boolean;
	createdDate: string;
	ownerUsername: string;
	threshold: ThresholdResponse;
};

export type ThresholdResponse = {
	minTemperature: number;
	maxTemperature: number;
	minPH: number;
	maxPH: number;
	minTds: number;
	maxTds: number;
	minHeight: number;
	maxHeight: number;
};

export type AquariumResponse = {
	id: string;
	name: string;
	location: string;
	isBombWorking: boolean;
	createdDate: string;
	ownerUsername: string;
	threshold: ThresholdResponse;
};

export type AquariumListResponse = {
	aquariumList: AquariumResponse[];
};
