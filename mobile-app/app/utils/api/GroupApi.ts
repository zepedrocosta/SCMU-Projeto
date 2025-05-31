import { GroupResponse } from "../../types/Group";
import { axiosInstance } from "./axiosConfig";

const basepath = "/aquariums/groups";

const ENDPOINTS = {
	GET_USER_GROUPS: basepath,
	ADD_AQUARIUMS_TO_GROUP: `${basepath}/aquariums`,
};

//region GET
export async function getUserGroups(): Promise<GroupResponse[]> {
	const mockResponse: GroupResponse[] = [
		{
			id: "1",
			name: "Aquarium Enthusiasts",
			description: "A group for aquarium lovers to share tips and experiences.",
			numberOfAquariums: 5,
			color: "#4CAF50",
			createdAt: "2023-01-01T12:00:00Z",
			aquariumsIds: ["1", "2", "3"],
		},
		{
			id: "2",
			name: "Marine Biologists",
			description: "A group for marine biology students and professionals.",
			numberOfAquariums: 3,
			color: "#2196F3",
			createdAt: "2023-02-01T12:00:00Z",
			aquariumsIds: ["4", "5"],
		},
		{
			id: "3",
			name: "Freshwater Aquarists",
			description: "A group dedicated to freshwater aquarium setups.",
			numberOfAquariums: 7,
			color: "#FF9800",
			createdAt: "2023-03-01T12:00:00Z",
			aquariumsIds: ["6", "7", "8"],
		},
		{
			id: "4",
			name: "Coral Reef Keepers",
			description: "For those who love coral reefs and marine life.",
			numberOfAquariums: 2,
			color: "#9C27B0",
			createdAt: "2023-04-01T12:00:00Z",
			aquariumsIds: ["2", "5"],
		},
		{
			id: "5",
			name: "Aquascaping Artists",
			description: "Share your aquascaping designs and ideas.",
			numberOfAquariums: 4,
			color: "#E91E63",
			createdAt: "2023-05-01T12:00:00Z",
			aquariumsIds: ["3", "4", "6"],
		},
		{
			id: "6",
			name: "Aquarium Maintenance Crew",
			description: "A group for those who specialize in aquarium maintenance.",
			numberOfAquariums: 6,
			color: "#FF5722",
			createdAt: "2023-06-01T12:00:00Z",
			aquariumsIds: ["1", "2", "3", "4"],
		},
		{
			id: "7",
			name: "Aquarium Photography",
			description: "For photographers who love capturing aquarium life.",
			numberOfAquariums: 8,
			color: "#3F51B5",
			createdAt: "2023-07-01T12:00:00Z",
			aquariumsIds: ["1", "5"],
		},
		{
			id: "8",
			name: "Aquarium DIY Projects",
			description: "Share your DIY aquarium projects and ideas.",
			numberOfAquariums: 9,
			color: "#009688",
			createdAt: "2023-08-01T12:00:00Z",
			aquariumsIds: ["3", "6"],
		},
	];

	return mockResponse;

	// TODO uncomment when backend is ready
	// return await axiosInstance
	// 	.get<GroupResponse[]>(ENDPOINTS.GET_USER_GROUPS)
	// 	.then((response) => {
	// 		return response.data;
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error fetching gourps by user ID:", error);
	// 		throw error;
	// 	});
}
//endregion

//region POST
export async function addAquariumsToGroup(
	groupId: string,
	aquariumIds: string[]
): Promise<{ groupId: string; aquariumIds: string[] }> {
	// TODO remove this when backend is ready
	return { groupId, aquariumIds };

	for (const aquariumId of aquariumIds) {
		console.log(`Adding aquarium ${aquariumId} to group ${groupId}`);
		await axiosInstance
			.post(`${basepath}?groupId=${groupId}&aquariumId=${aquariumId}`)
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.error("Error adding aquarium to group:", error);
				throw error;
			});
	}
}
