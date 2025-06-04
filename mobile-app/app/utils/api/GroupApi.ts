import { Aquarium } from "../../types/Aquarium";
import { Group, GroupResponse } from "../../types/Group";
import { axiosInstance } from "./axiosConfig";

const basepath = "/aquariums/groups";

const ENDPOINTS = {
	GET_USER_GROUPS: basepath,
	ADD_AQUARIUMS_TO_GROUP: `${basepath}/aquariums`,
	ADD_GROUP: `${basepath}/group?groupName=`,
};

const mockResponse: GroupResponse[] = [
	{
		id: "1",
		name: "Aquarium Enthusiasts",
		description: "A group for aquarium lovers to share tips and experiences.",
		createdAt: "2023-01-01T12:00:00Z",
		aquariumsIds: ["1", "2", "3"],
	},
	{
		id: "2",
		name: "Marine Biologists",
		description: "A group for marine biology students and professionals.",
		createdAt: "2023-02-01T12:00:00Z",
		aquariumsIds: ["4", "5"],
	},
	{
		id: "3",
		name: "Freshwater Aquarists",
		description: "A group dedicated to freshwater aquarium setups.",
		createdAt: "2023-03-01T12:00:00Z",
		aquariumsIds: ["6", "7", "8"],
	},
	{
		id: "4",
		name: "Coral Reef Keepers",
		description: "For those who love coral reefs and marine life.",
		createdAt: "2023-04-01T12:00:00Z",
		aquariumsIds: ["2", "5"],
	},
	{
		id: "5",
		name: "Aquascaping Artists",
		description: "Share your aquascaping designs and ideas.",
		createdAt: "2023-05-01T12:00:00Z",
		aquariumsIds: ["3", "4", "6"],
	},
	{
		id: "6",
		name: "Aquarium Maintenance Crew",
		description: "A group for those who specialize in aquarium maintenance.",
		createdAt: "2023-06-01T12:00:00Z",
		aquariumsIds: ["1", "2", "3", "4"],
	},
	{
		id: "7",
		name: "Aquarium Photography",
		description: "For photographers who love capturing aquarium life.",
		createdAt: "2023-07-01T12:00:00Z",
		aquariumsIds: ["1", "5"],
	},
	{
		id: "8",
		name: "Aquarium DIY Projects",
		description: "Share your DIY aquarium projects and ideas.",
		createdAt: "2023-08-01T12:00:00Z",
		aquariumsIds: ["3", "6"],
	},
];

const colors = [
	"#4CAF50", // Green
	"#2196F3", // Blue
	"#FF9800", // Orange
	"#9C27B0", // Purple
	"#E91E63", // Pink
	"#FF5722", // Deep Orange
	"#3F51B5", // Indigo
	"#009688", // Teal
	"#795548", // Brown
];

export function mapGroupResponseToGroup(
	response: GroupResponse,
	aquariums: Aquarium[]
): Group {
	return {
		id: response.id,
		name: response.name,
		description: response.description,
		color: colors[Math.floor(Math.random() * colors.length)],
		createdAt: response.createdAt,
		aquariums: aquariums.filter((aq) => response.aquariumsIds.includes(aq.id)), // This is not filtering, it's returning every aquarium in general
	};
}

//region GET
export async function getUserGroups(): Promise<GroupResponse[]> {
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

export async function addGroup(groupName: string): Promise<GroupResponse> {
	console.log(`Adding group with name: ${groupName}`);
	return {
		id: String(Date.now()),
		name: groupName,
		description: "",
		createdAt: new Date().toISOString(),
		aquariumsIds: [],
	};

	// TODO remove this when backend is ready, check response type
	return await axiosInstance
		.post<string>(ENDPOINTS.ADD_GROUP + groupName)
		.then((response) => {
			return {
				id: response.data,
				name: groupName,
				description: "Mock response for group creation",
				createdAt: new Date().toISOString(),
				aquariumsIds: [],
			};
		})
		.catch((error) => {
			console.error("Error adding group:", error);
			throw error;
		});
}
//endregion

//region DELETE
export async function removeAquariumFromGroup(
	groupId: string,
	aquariumIds: string[]
): Promise<{ groupId: string; aquariumIds: string[] }> {
	// TODO remove this when backend is ready
	return { groupId, aquariumIds };

	for (const aquariumId of aquariumIds) {
		console.log(`Removing aquarium ${aquariumId} from group ${groupId}`);
		await axiosInstance
			.delete(`${basepath}?groupId=${groupId}&aquariumId=${aquariumId}`)
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.error("Error removing aquarium from group:", error);
				throw error;
			});
	}
}

export async function deleteGroup(groupId: string): Promise<string> {
	// TODO remove this when backend is ready
	console.log(`Deleting group with ID: ${groupId}`);
	return groupId;

	// return await axiosInstance
	// 	.delete(`${basepath}/group/${groupId}`)
	// 	.then(() => {
	// 		console.log(`Group with ID ${groupId} deleted successfully`);
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error deleting group:", error);
	// 		throw error;
	// 	});
}
//endregion
