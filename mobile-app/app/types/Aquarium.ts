import { Notification, NotificationNew } from "./Notification";

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
	username: string;
	aquariumId: string;
};

export type LastSnapshotResponse = {
	id: string;
	temperature: number;
	ldr: boolean;
	pH: number;
	tds: number;
	height: number;
	isBombWorking: boolean;
};

export type Snapshot = {
	snapshotId: string;
	temperature: number;
	pH: number;
	tds: number;
	light: boolean;
	height: number;
	isBombWorking: boolean;
};

export type CreateAquariumRequest = {
	macAddress: string;
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
