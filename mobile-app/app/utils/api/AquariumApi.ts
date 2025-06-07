import {
	Aquarium,
	AquariumListResponse,
	AquariumResponse,
	CreateAquariumRequest,
	CreateAquariumResponse,
	EditAquarium,
	LastSnapshotResponse,
	ShareAquariumRequest,
	Snapshot,
	ThresholdResponse,
	updateThresholdsRequest,
} from "../../types/Aquarium";
import {
	Notification,
	NotificationListResponse,
	NotificationNew,
} from "../../types/Notification";
import { axiosInstance, sleep, URL_PLACEHOLDER } from "./axiosConfig";

const basePath = "/aquariums";

const ENDPOINTS = {
	AQUARIUM: basePath,
	AQUARIUM_BY_ID: `/aquariums/${URL_PLACEHOLDER.AQUARIUM_ID}`,
	USER_AQUARIUMS: `${basePath}/list`,
	CHANGE_WATER_PUMP_STATUS: `${basePath}/bomb/?aquariumId=`,
	UPDATE_THRESHOLDS: `${basePath}/threshold`,
	UPDATE_AQUARIUM: basePath,
	GET_LAST_SNAPSHOT: `${basePath}/snapshot/${URL_PLACEHOLDER.AQUARIUM_ID}`,
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

function parseMetrics(message: string): string[] {
	return message.split(",").map((metric) => metric.trim());
}

// Helper functions to map AquariumResponse to Aquarium type
export function mapToAquariumResponse(aquarium: AquariumResponse): Aquarium {
	return {
		id: aquarium.id,
		name: aquarium.name,
		location: aquarium.location,
		isBombWorking: aquarium.isBombWorking,
		createdDate: aquarium.createdDate,
		ownerUsername: aquarium.ownerUsername,
		threshold: {
			minTemperature: aquarium.threshold.minTemperature,
			maxTemperature: aquarium.threshold.maxTemperature,
			minPH: aquarium.threshold.minPH,
			maxPH: aquarium.threshold.maxPH,
			minTds: aquarium.threshold.minTds,
			maxTds: aquarium.threshold.maxTds,
			minHeight: aquarium.threshold.minHeight,
			maxHeight: aquarium.threshold.maxHeight,
		},
		snapshot: {
			snapshotId: aquarium.snapshot?.snapshotId || "",
			temperature: aquarium.snapshot?.temperature || 0,
			light: aquarium.snapshot?.light || false,
			pH: aquarium.snapshot?.pH || 0,
			tds: aquarium.snapshot?.tds || 0,
			height: aquarium.snapshot?.height || 0,
			isBombWorking: aquarium.snapshot?.isBombWorking || false,
		},
		notifications: aquarium.notifications,
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
	const newAquarium: CreateAquariumResponse = {
		id: Math.random().toString(36).substring(2, 15), // Simulate a unique ID
		name: createAquariumRequest.name,
		location: createAquariumRequest.location,
		createdDate: new Date().toISOString(),
		createdBy: "currentUser",
	};

	const aq: Aquarium = {
		id: newAquarium.id,
		name: newAquarium.name,
		location: newAquarium.location,
		isBombWorking: true,
		createdDate: newAquarium.createdDate,
		ownerUsername: newAquarium.createdBy,
		threshold: mockThreshold,
		snapshot: mockSnapshot,
		notifications: mockNotifications,
	};

	return aq;

	// TODO uncomment when backend is ready
	// return await axiosInstance
	// 	.post<AquariumResponse>(ENDPOINTS.AQUARIUM, createAquariumRequest)
	// 	.then((response) => {
	// 		console.log("Aquarium created successfully:", response.data);
	// 		return mapToAquariumResponse(response.data);
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error creating aquarium:", error);
	// 		throw error;
	// 	});
}

export async function shareAquarium(
	shareAquariumRequest: ShareAquariumRequest
): Promise<void> {
	console.log("Sharing aquarium:", shareAquariumRequest);
	// Simulate a successful share operation

	// TODO uncomment when backend is ready
	// return await axiosInstance
	// 	.post(ENDPOINTS.SHARE_AQUARIUM, shareAquariumRequest)
	// 	.then(() => {
	// 		console.log("Aquarium shared successfully");
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error sharing aquarium:", error);
	// 		throw error;
	// 	});
}
//endregion

//region GET
export async function fetchAquariumsNotifications(
	aquariumId: string,
	timestamp: string
): Promise<NotificationListResponse> {
	const notifications: NotificationListResponse = {
		notifications: [
			{
				message: "temp,ph",
				createdDate: "2024-01-01T00:00:00Z",
				snapshotId: "1",
			},
			{
				message: "temp,ph,tds",
				createdDate: "2024-01-02T00:00:00Z",
				snapshotId: "2",
			},
			{
				message: "tds,height",
				createdDate: "2024-01-03T00:00:00Z",
				snapshotId: "3",
			},
		],
	};

	return notifications;

	// TODO uncomment when backend is ready
	// return await axiosInstance
	// 	.get<AquariumListResponse>(ENDPOINTS.AQUARIUM)
	// 	.then((response) => {
	// 		console.log("Fetched aquariums:", response.data);
	// 		return response.data;
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error fetching aquariums:", error);
	// 		throw error;
	// 	});
}

export async function getAquariumById(aquariumId: string): Promise<Aquarium> {
	const foundAquarium = mockResponse.find((aquarium) => aquarium.id === aquariumId);
	const response = mapToAquariumResponse(foundAquarium || mockResponse[0]);
	return response;

	// TODO uncomment when backend is ready
	// return await axiosInstance
	// 	.get<AquariumResponse>(
	// 		ENDPOINTS.AQUARIUM_BY_ID.replace(URL_PLACEHOLDER.AQUARIUM_ID, aquariumId)
	// 	)
	// 	.then((response) => {
	// 		return response.data;
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error fetching aquarium by ID:", error);
	// 		throw error;
	// 	});
}

export async function getUserAquariums(userId: string): Promise<Aquarium[]> {
	return mapToAquariumArrayResponse(mockResponse);

	// TODO uncomment when backend is ready
	// return await axiosInstance
	// 	.get<AquariumResponse[]>(ENDPOINTS.USER_AQUARIUMS)
	// 	.then((response) => {
	// 		console.log("Fetched user aquariums:", response.data);
	// 		return mapToAquariumArrayResponse(response.data);
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error fetching aquariums by user ID:", error);
	// 		throw error;
	// 	});
}

export async function getLastAquariumSnapshot(aquariumId: string): Promise<Snapshot> {
	const lastSnapshot: Snapshot[] = [
		{
			snapshotId: "1",
			temperature: 2,
			light: true,
			pH: 2,
			tds: 2,
			height: 2,
			isBombWorking: true,
		},
		{
			snapshotId: "2",
			temperature: 30,
			light: true,
			pH: 30,
			tds: 30,
			height: 30,
			isBombWorking: false,
		},
		{
			snapshotId: "3",
			temperature: 50,
			light: true,
			pH: 50,
			tds: 50,
			height: 50,
			isBombWorking: false,
		},
	];

	return lastSnapshot[Math.floor(Math.random() * lastSnapshot.length)];

	// TODO uncomment when backend is ready
	// return await axiosInstance
	// 	.get<LastSnapshotResponse>(
	// 		ENDPOINTS.GET_LAST_SNAPSHOT.replace(URL_PLACEHOLDER.AQUARIUM_ID, aquariumId)
	// 	)
	// 	.then((response) => {
	// 		console.log("Fetched aquarium last snapshot:", response.data);
	// 		return {
	// 			snapshotId: response.data.id,
	// 			temperature: response.data.temperature,
	// 			pH: response.data.pH,
	// 			tds: response.data.tds,
	// 			light: response.data.ldr,
	// 			height: response.data.height,
	// 			isBombWorking: response.data.isBombWorking,
	// 		};
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error fetching aquarium snapshots:", error);
	// 		throw error;
	// 	});
}
//eregion

//region PUT
export async function changeWaterPumpStatus(aquariumId: string): Promise<string> {
	await sleep(1000); // Simulate network delay

	return aquariumId;

	// TODO uncomment when backend is ready
	// return await axiosInstance
	// 	.put(ENDPOINTS.CHANGE_WATER_PUMP_STATUS + aquariumId)
	// 	.then(() => {
	// 		console.log(
	// 			`Water pump status for aquarium ${aquariumId} changed successfully`
	// 		);
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error changing water pump status:", error);
	// 		throw error;
	// 	});
}

export async function updateThresholds(updateThresholds: updateThresholdsRequest) {
	console.log("Updating thresholds:", updateThresholds);
	return updateThresholds;

	// TODO uncomment when backend is ready
	// return await axiosInstance
	// 	.put<ThresholdResponse>(ENDPOINTS.UPDATE_THRESHOLDS, updateThresholds)
	// 	.then((response) => {
	// 		console.log("Thresholds updated successfully:", response.data);
	// 		return response.data;
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error updating thresholds:", error);
	// 		throw error;
	// 	});
}

export async function editAquarium(editAquariumRequest: EditAquarium): Promise<EditAquarium> {
	console.log("Editing aquarium:", editAquariumRequest);
	const aquariumId = editAquariumRequest.id;
	return {
		id: aquariumId,
		name: editAquariumRequest.name,
		location: editAquariumRequest.location,
	};

	// // TODO uncomment when backend is ready
	// return await axiosInstance
	// 	.put<AquariumResponse>(ENDPOINTS.UPDATE_AQUARIUM)
	// 	.then((response) => {
	// 		console.log(`Aquarium ${aquariumId} edited successfully`, response.data);
	// 		return response.data;
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error editing aquarium:", error);
	// 		throw error;
	// 	});
}

//endregion

//region DELETE
export async function deleteAquarium(aquariumId: string): Promise<string> {
	console.log(`Deleting aquarium with ID: ${aquariumId}`);
	return aquariumId;

	// TODO uncomment when backend is ready
	// return await axiosInstance
	// 	.delete(ENDPOINTS.AQUARIUM_BY_ID.replace(URL_PLACEHOLDER.AQUARIUM_ID, aquariumId))
	// 	.then(() => {
	// 		console.log(`Aquarium ${aquariumId} deleted successfully`);
	// 		return aquariumId;
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error deleting aquarium:", error);
	// 		throw error;
	// 	});
}
