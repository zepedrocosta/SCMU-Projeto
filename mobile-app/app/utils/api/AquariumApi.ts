import { createIconSetFromFontello } from "react-native-vector-icons";
import {
	Aquarium,
	AquariumListResponse,
	AquariumResponse,
	CreateAquariumRequest,
	CreateAquariumResponse,
	EditAquarium,
	LastSnapshotResponse,
	ShareAquariumRequest,
	SimpleAquarium,
	Snapshot,
	ThresholdResponse,
	updateThresholdsRequest,
} from "../../types/Aquarium";
import {
	Notification,
	NotificationListResponse,
	NotificationNew,
	NotificationResponse,
} from "../../types/Notification";
import { axiosInstance, sleep, URL_PLACEHOLDER } from "./axiosConfig";

const basePath = "/aquariums";

const ENDPOINTS = {
	CREATE_AQUARIUM: basePath,
	AQUARIUM_BY_ID: `/aquariums/${URL_PLACEHOLDER.AQUARIUM_ID}`,
	USER_AQUARIUMS: `${basePath}/list`,
	CHANGE_WATER_PUMP_STATUS: `${basePath}/bomb?aquariumId=`,
	UPDATE_THRESHOLDS: `${basePath}/threshold`,
	UPDATE_AQUARIUM: basePath,
	GET_LAST_SNAPSHOT: `${basePath}/snapshot/${URL_PLACEHOLDER.AQUARIUM_ID}`,
	DELETE_AQUARIUM: `${basePath}/${URL_PLACEHOLDER.AQUARIUM_ID}`,
	SHARE_AQUARIUM: `${basePath}/manage`,
	FETCH_NOTIFICATIONS: `${basePath}/notifications`,
};

const mockSnapshot: Snapshot = {
	snapshotId: "0",
	temperature: 0,
	light: false,
	pH: 0,
	tds: 0,
	height: 0,
	isBombWorking: false,
};

const mockNotifications: NotificationNew[] = [];

const mockThreshold: ThresholdResponse = {
	minTemperature: 20,
	maxTemperature: 28,
	minPH: 6.5,
	maxPH: 8.5,
	minTds: 100,
	maxTds: 500,
	minHeight: 30,
	maxHeight: 60,
};

const mockResponse: AquariumResponse[] = [
	{
		id: "1",
		name: "Aquarium 1",
		location: "Living Room",
		isBombWorking: true,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "johndoe1",
		threshold: {
			minTemperature: 20,
			maxTemperature: 28,
			minPH: 6.5,
			maxPH: 8.5,
			minTds: 100,
			maxTds: 500,
			minHeight: 30,
			maxHeight: 60,
		},
		snapshot: mockSnapshot,
		notifications: mockNotifications,
	},
	{
		id: "2",
		name: "Aquarium 2",
		location: "Lisbon",
		isBombWorking: true,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "johndoe",
		threshold: {
			minTemperature: 20,
			maxTemperature: 28,
			minPH: 6.5,
			maxPH: 8.5,
			minTds: 100,
			maxTds: 500,
			minHeight: 30,
			maxHeight: 60,
		},
		snapshot: mockSnapshot,
		notifications: mockNotifications,
	},
	{
		id: "3",
		name: "Aquarium 3",
		location: "Kitchen",
		isBombWorking: false,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "johndoe",
		threshold: {
			minTemperature: 20,
			maxTemperature: 28,
			minPH: 6.5,
			maxPH: 8.5,
			minTds: 100,
			maxTds: 500,
			minHeight: 30,
			maxHeight: 60,
		},
		snapshot: mockSnapshot,
		notifications: mockNotifications,
	},
	{
		id: "4",
		name: "Aquarium 4",
		location: "Bedroom",
		isBombWorking: true,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "johndoe",
		threshold: {
			minTemperature: 20,
			maxTemperature: 28,
			minPH: 6.5,
			maxPH: 8.5,
			minTds: 100,
			maxTds: 500,
			minHeight: 30,
			maxHeight: 60,
		},
		snapshot: mockSnapshot,
		notifications: mockNotifications,
	},
	{
		id: "5",
		name: "Aquarium 5",
		location: "Office",
		isBombWorking: true,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "johndoe",
		threshold: {
			minTemperature: 20,
			maxTemperature: 28,
			minPH: 6.5,
			maxPH: 8.5,
			minTds: 100,
			maxTds: 500,
			minHeight: 30,
			maxHeight: 60,
		},
		snapshot: mockSnapshot,
		notifications: mockNotifications,
	},
	{
		id: "6",
		name: "Aquarium 6",
		location: "Garage",
		isBombWorking: false,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "johndoe",
		threshold: {
			minTemperature: 20,
			maxTemperature: 28,
			minPH: 6.5,
			maxPH: 8.5,
			minTds: 100,
			maxTds: 500,
			minHeight: 30,
			maxHeight: 60,
		},
		snapshot: mockSnapshot,
		notifications: mockNotifications,
	},
	{
		id: "7",
		name: "Aquarium 7",
		location: "Balcony",
		isBombWorking: true,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "johndoe",
		threshold: {
			minTemperature: 20,
			maxTemperature: 28,
			minPH: 6.5,
			maxPH: 8.5,
			minTds: 100,
			maxTds: 500,
			minHeight: 30,
			maxHeight: 60,
		},
		snapshot: mockSnapshot,
		notifications: mockNotifications,
	},
	{
		id: "8",
		name: "Aquarium 8",
		location: "Garden",
		isBombWorking: false,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "johndoe",
		threshold: {
			minTemperature: 20,
			maxTemperature: 28,
			minPH: 6.5,
			maxPH: 8.5,
			minTds: 100,
			maxTds: 500,
			minHeight: 30,
			maxHeight: 60,
		},
		snapshot: mockSnapshot,
		notifications: mockNotifications,
	},
	{
		id: "9",
		name: "Aquarium 9",
		location: "Patio",
		isBombWorking: true,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "johndoe",
		threshold: {
			minTemperature: 20,
			maxTemperature: 28,
			minPH: 6.5,
			maxPH: 8.5,
			minTds: 100,
			maxTds: 500,
			minHeight: 30,
			maxHeight: 60,
		},
		snapshot: mockSnapshot,
		notifications: mockNotifications,
	},
	{
		id: "10",
		name: "Aquarium 10",
		location: "Veranda",
		isBombWorking: false,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "johndoe",
		threshold: {
			minTemperature: 20,
			maxTemperature: 28,
			minPH: 6.5,
			maxPH: 8.5,
			minTds: 100,
			maxTds: 500,
			minHeight: 30,
			maxHeight: 60,
		},
		snapshot: mockSnapshot,
		notifications: mockNotifications,
	},
];

// Helper functions to map AquariumResponse to Aquarium type
export function mapToAquariumResponse(aquarium: AquariumResponse): Aquarium {
	return {
		id: aquarium.id,
		name: aquarium.name,
		location: aquarium.location,
		isBombWorking: aquarium.isBombWorking,
		createdDate: aquarium.createdDate,
		ownerUsername: aquarium.ownerUsername
			? aquarium.ownerUsername
			: aquarium.createdBy || "Unknown",
		threshold: aquarium.threshold ? aquarium.threshold : mockThreshold,
		snapshot: mockSnapshot,
		notifications: mockNotifications,
	};
}

export function mapToAquariumArrayResponse(aquariums: AquariumResponse[]): Aquarium[] {
	return aquariums.map((aquarium: AquariumResponse) => mapToAquariumResponse(aquarium));
}

//region POST
export async function createAquarium(
	createAquariumRequest: CreateAquariumRequest
): Promise<Aquarium> {
	console.log("Creating aquarium:", createAquariumRequest);

	return await axiosInstance
		.post<AquariumResponse>(ENDPOINTS.CREATE_AQUARIUM, createAquariumRequest)
		.then((response) => {
			console.log("Aquarium created successfully:", response.data);
			return mapToAquariumResponse(response.data);
		})
		.catch((error) => {
			console.error("Error creating aquarium:", error);
			throw error;
		});
}

export async function shareAquarium(
	shareAquariumRequest: ShareAquariumRequest
): Promise<void> {
	console.log("Sharing aquarium:", shareAquariumRequest);
	return await axiosInstance
		.post(ENDPOINTS.SHARE_AQUARIUM, shareAquariumRequest)
		.then(() => {
			console.log("Aquarium shared successfully");
		})
		.catch((error) => {
			console.error("Error sharing aquarium:", error);
			throw error;
		});
}
//endregion

//region GET
export async function fetchAquariumsNotifications(
	aquariumId: string,
	timestamp: string
): Promise<NotificationResponse[]> {
	console.log(`Fetching notifications for aquarium ${aquariumId} since ${timestamp}`);
	return await axiosInstance
		.get<NotificationResponse[]>(ENDPOINTS.FETCH_NOTIFICATIONS)
		.then((response) => {
			console.log("Fetched aquariums:", response.data);
			return response.data;
		})
		.catch((error) => {
			console.error("Error fetching aquariums:", error);
			throw error;
		});
}

export async function getUserAquariums(nickname: string): Promise<Aquarium[]> {
	return await axiosInstance
		.get<AquariumResponse[]>(ENDPOINTS.USER_AQUARIUMS)
		.then((response) => {
			console.log("Fetched user aquariums:", response.data);
			return mapToAquariumArrayResponse(response.data);
		})
		.catch((error) => {
			console.error("Error fetching aquariums by user ID:", error);
			throw error;
		});
}

export async function getLastAquariumSnapshot(aquariumId: string): Promise<Snapshot> {
	return await axiosInstance
		.get<LastSnapshotResponse>(
			ENDPOINTS.GET_LAST_SNAPSHOT.replace(URL_PLACEHOLDER.AQUARIUM_ID, aquariumId)
		)
		.then((response) => {
			console.log("Fetched aquarium last snapshot:", response.data);
			return {
				snapshotId: response.data.id,
				temperature: response.data.temperature,
				pH: response.data.pH,
				tds: response.data.tds,
				light: response.data.ldr,
				height: response.data.height,
				isBombWorking: response.data.isBombWorking,
			};
		})
		.catch((error) => {
			if (error.response && error.response.status === 404) {
				console.warn("Snapshot not found, returning mock snapshot.");
			} else {
				console.error("Error fetching aquarium snapshots:", error);
			}
			// Return a mock snapshot in case of error or 404
			return {
				snapshotId: "0",
				temperature: 0,
				pH: 0,
				tds: 0,
				light: false,
				height: 0,
				isBombWorking: false,
			};
		});
}
//eregion

//region PUT
export async function changeWaterPumpStatus(aquariumId: string): Promise<string> {
	await axiosInstance
		.put(ENDPOINTS.CHANGE_WATER_PUMP_STATUS + aquariumId)
		.then(() => {
			console.log(`Water pump status for aquarium ${aquariumId} changed successfully`);
		})
		.catch((error) => {
			console.error("Error changing water pump status:", error);
			throw error;
		});

	return aquariumId;
}

export async function updateThresholds(updateThresholds: updateThresholdsRequest) {
	console.log("Updating thresholds:", updateThresholds);

	await axiosInstance
		.put<ThresholdResponse>(ENDPOINTS.UPDATE_THRESHOLDS, updateThresholds)
		.then((response) => {
			console.log("Thresholds updated successfully:", response.data);
			return response.data;
		})
		.catch((error) => {
			console.error("Error updating thresholds:", error);
			throw error;
		});

	return updateThresholds;
}

export async function editAquarium(editAquariumRequest: EditAquarium): Promise<EditAquarium> {
	console.log("Editing aquarium:", editAquariumRequest);
	return await axiosInstance
		.put<SimpleAquarium>(ENDPOINTS.UPDATE_AQUARIUM, editAquariumRequest)
		.then((response) => {
			console.log(
				`Aquarium ${editAquariumRequest.id} edited successfully`,
				response.data
			);
			return response.data;
		})
		.catch((error) => {
			console.error("Error editing aquarium:", error);
			throw error;
		});
}
//endregion

//region DELETE
export async function deleteAquarium(aquariumId: string): Promise<string> {
	console.log(`Deleting aquarium with ID: ${aquariumId}`);
	await axiosInstance
		.delete(ENDPOINTS.DELETE_AQUARIUM.replace(URL_PLACEHOLDER.AQUARIUM_ID, aquariumId))
		.then(() => {
			console.log(`Aquarium ${aquariumId} deleted successfully`);
			return aquariumId;
		})
		.catch((error) => {
			console.error("Error deleting aquarium:", error);
			throw error;
		});

	return aquariumId;
}
