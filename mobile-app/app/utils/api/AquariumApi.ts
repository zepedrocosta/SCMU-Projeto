import { AquariumListResponse, AquariumResponse } from "../../types/Aquarium";
import { axiosInstance, URL_PLACEHOLDER } from "./axiosConfig";

const ENDPOINTS = {
	AQUARIUM: "/aquariums",
	AQUARIUM_BY_ID: `/aquariums/${URL_PLACEHOLDER.AQUARIUM_ID}`,
	USER_AQUARIUMS: `/users/${URL_PLACEHOLDER.USER_ID}/aquariums`,
};

//region GET
export async function getAquariumById(aquariumId: string): Promise<AquariumResponse> {
	const mockResponse: AquariumResponse[] = [
		{
			id: "1",
			name: "My Aquarium",
			description: "A beautiful aquarium",
		},
		{
			id: "2",
			name: "My Second Aquarium",
			description: "Another beautiful aquarium",
		},
		{
			id: "3",
			name: "Mock Aquarium",
			description: "This is a mock aquarium for testing purposes.",
		},
	];

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

export async function getUserAquariums(userId: string): Promise<AquariumResponse[]> {
	const mockResponse: AquariumResponse[] = [
		{
			id: "1",
			name: "My Aquarium",
			description: "A beautiful aquarium",
		},
		{
			id: "2",
			name: "My Second Aquarium",
			description: "Another beautiful aquarium",
		},
		{
			id: "3",
			name: "Mock Aquarium",
			description: "This is a mock aquarium for testing purposes.",
		},
		{
			id: "4",
			name: "User Aquarium 1",
			description: "Aquarium owned by user 1",
		},
		{
			id: "5",
			name: "User Aquarium 2",
			description: "Another aquarium owned by user 1",
		},
		{
			id: "6",
			name: "User Aquarium 3",
			description: "Yet another aquarium owned by user 1",
		},
		{
			id: "7",
			name: "User Aquarium 4",
			description: "Fourth aquarium owned by user 1",
		},
		{
			id: "8",
			name: "User Aquarium 5",
			description: "Fifth aquarium owned by user 1",
		},
		{
			id: "9",
			name: "User Aquarium 6",
			description: "Sixth aquarium owned by user 1",
		},
		{
			id: "10",
			name: "User Aquarium 7",
			description: "Seventh aquarium owned by user 1",
		},
	];

	return mockResponse;

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
