import { NotificationNew } from "./Notification";

export type Aquarium = {
	id: string;
	name: string;
	location: string;
	isBombWorking: boolean;
	createdDate: string;
	ownerUsername: string;
	threshold: ThresholdResponse;
	snapshot: Snapshot;
	notifications: NotificationNew[];
	history?: Snapshot[];
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
	createdBy?: string;
	ownerUsername: string;
	threshold: ThresholdResponse;
	snapshot: Snapshot | null;
	notifications: NotificationNew[] | [];
};

export type AquariumListResponse = {
	aquariumList: AquariumResponse[];
};

export type updateThresholdsRequest = {
	aquariumId: string;
	minTemperature: number;
	maxTemperature: number;
	minPH: number;
	maxPH: number;
	minTds: number;
	maxTds: number;
	minHeight: number;
	maxHeight: number;
};

export type thresholdsResponse = {
	minTemperature: number;
	maxTemperature: number;
	minPH: number;
	maxPH: number;
	minTds: number;
	maxTds: number;
	minHeight: number;
	maxHeight: number;
};

export type EditAquarium = {
	id: string;
	name: string;
	location: string;
};

export type ShareAquariumRequest = {
	nickname: string;
	aquariumId: string;
};

export type LastSnapshotResponse = {
	id: string;
	temperature: number;
	ldr: boolean;
	ph: number;
	tds: number;
	height: number;
	isBombWorking: boolean;
};

export type pageResponse<T> = {
	pageSize: number;
	page: number;
	totalPages: number;
	total: number;
	content: T[];
};

export type Snapshot = {
	id: string;
	temperature: number;
	ldr?: boolean;
	ph: number;
	tds: number;
	height: number;
	isBombWorking: boolean;
	createdDate?: string;
	aquariumId?: string;
	minTemperature?: string;
	maxTemperature?: string;
	minPh?: string;
	maxPh?: string;
	minTds?: string;
	maxTds?: string;
	minHeight?: string;
	maxHeight?: string;
	areValuesNormal?: boolean;
};

export type CreateAquariumRequest = {
	esp: string;
	name: string;
	location: string;
};

export type CreateAquariumResponse = {
	id: string;
	name: string;
	location: string;
	createdDate: string;
	createdBy: string;
};

export type SimpleAquarium = {
	id: string;
	name: string;
	location: string;
	createdBy: string;
	createdDate: string;
};
