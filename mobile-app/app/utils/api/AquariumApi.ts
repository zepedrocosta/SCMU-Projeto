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
