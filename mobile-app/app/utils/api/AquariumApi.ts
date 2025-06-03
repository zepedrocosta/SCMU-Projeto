import { Aquarium, AquariumListResponse, AquariumResponse } from "../../types/Aquarium";
import { axiosInstance, URL_PLACEHOLDER } from "./axiosConfig";

const ENDPOINTS = {
	AQUARIUM: "/aquariums",
	AQUARIUM_BY_ID: `/aquariums/${URL_PLACEHOLDER.AQUARIUM_ID}`,
	USER_AQUARIUMS: `/users/${URL_PLACEHOLDER.USER_ID}/aquariums`,
};

const mockResponse: AquariumResponse[] = [
	{
		id: "1",
		name: "Aquarium 1",
		location: "Living Room",
		isBombWorking: true,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "john_doe",
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
	},
	{
		id: "2",
		name: "Aquarium 2",
		location: "Lisbon",
		isBombWorking: true,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "john_doe",
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
	},
	{
		id: "3",
		name: "Aquarium 3",
		location: "Kitchen",
		isBombWorking: false,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "john_doe",
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
	},
	{
		id: "4",
		name: "Aquarium 4",
		location: "Bedroom",
		isBombWorking: true,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "john_doe",
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
	},
	{
		id: "5",
		name: "Aquarium 5",
		location: "Office",
		isBombWorking: true,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "john_doe",
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
	},
	{
		id: "6",
		name: "Aquarium 6",
		location: "Garage",
		isBombWorking: false,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "john_doe",
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
	},
	{
		id: "7",
		name: "Aquarium 7",
		location: "Balcony",
		isBombWorking: true,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "john_doe",
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
	},
	{
		id: "8",
		name: "Aquarium 8",
		location: "Garden",
		isBombWorking: false,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "john_doe",
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
	},
	{
		id: "9",
		name: "Aquarium 9",
		location: "Patio",
		isBombWorking: true,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "john_doe",
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
	},
	{
		id: "10",
		name: "Aquarium 10",
		location: "Veranda",
		isBombWorking: false,
		createdDate: "2024-01-01T00:00:00Z",
		ownerUsername: "john_doe",
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
	},
];

// Helper functions to map AquariumResponse to Aquarium type
export function mapToAquariumResponse(aquarium: AquariumResponse): AquariumResponse {
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
	};
}

export function mapToAquariumArrayResponse(aquariums: AquariumResponse[]): Aquarium[] {
	return aquariums.map((aquarium: AquariumResponse) => mapToAquariumResponse(aquarium));
}

//region GET
export async function getAquariumById(aquariumId: string): Promise<Aquarium> {
	const foundAquarium = mockResponse.find((aquarium) => aquarium.id === aquariumId);
	return foundAquarium || mockResponse[0];

	// TODO uncomment when backend is ready
	return await axiosInstance
		.get<AquariumResponse>(
			ENDPOINTS.AQUARIUM_BY_ID.replace(URL_PLACEHOLDER.AQUARIUM_ID, aquariumId)
		)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			console.error("Error fetching aquarium by ID:", error);
			throw error;
		});
}

export async function getUserAquariums(userId: string): Promise<Aquarium[]> {
	return mapToAquariumArrayResponse(mockResponse);

	// TODO uncomment when backend is ready
	// 	return await axiosInstance
	// 		.get<AquariumResponse[]>(
	// 			ENDPOINTS.USER_AQUARIUMS.replace(URL_PLACEHOLDER.USER_ID, userId)
	// 		)
	// 		.then((response) => {
	// 			return response.data;
	// 		})
	// 		.catch((error) => {
	// 			console.error("Error fetching aquariums by user ID:", error);
	// 			throw error;
	// 		});
}
