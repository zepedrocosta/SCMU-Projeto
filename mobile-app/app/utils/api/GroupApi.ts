import { Aquarium, AquariumResponse, SimpleAquarium } from "../../types/Aquarium";
import { Group, GroupResponse, GroupResponseAxios } from "../../types/Group";
import { axiosInstance, URL_PLACEHOLDER } from "./axiosConfig";

const basepath = "/aquariums/groups";

const ENDPOINTS = {
	GET_USER_GROUPS: basepath,
	ADD_AQUARIUMS_TO_GROUP: `${basepath}/aquariums`,
	ADD_GROUP: `${basepath}?groupName=`,
	ADD_AQUARIUM_TO_GROUP: `${basepath}/values`,
	REMOVE_AQUARIUM_FROM_GROUP: `${basepath}/values`,
	GET_GROUP_AQUARIUMS: `${basepath}/${URL_PLACEHOLDER.GROUP_ID}`,
};

const mockResponse: GroupResponse[] = [
	{
		id: "1",
		name: "Aquarium Enthusiasts",
		description: "A group for aquarium lovers to share tips and experiences.",
		aquariumsIds: ["1", "2", "3"],
	},
	{
		id: "2",
		name: "Marine Biologists",
		description: "A group for marine biology students and professionals.",
		aquariumsIds: ["4", "5"],
	},
	{
		id: "3",
		name: "Freshwater Aquarists",
		description: "A group dedicated to freshwater aquarium setups.",
		aquariumsIds: ["6", "7", "8"],
	},
	{
		id: "4",
		name: "Coral Reef Keepers",
		description: "For those who love coral reefs and marine life.",
		aquariumsIds: ["2", "5"],
	},
	{
		id: "5",
		name: "Aquascaping Artists",
		description: "Share your aquascaping designs and ideas.",
		aquariumsIds: ["3", "4", "6"],
	},
	{
		id: "6",
		name: "Aquarium Maintenance Crew",
		description: "A group for those who specialize in aquarium maintenance.",
		aquariumsIds: ["1", "2", "3", "4"],
	},
	{
		id: "7",
		name: "Aquarium Photography",
		description: "For photographers who love capturing aquarium life.",
		aquariumsIds: ["1", "5"],
	},
	{
		id: "8",
		name: "Aquarium DIY Projects",
		description: "Share your DIY aquarium projects and ideas.",
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
		aquariums: aquariums.filter((aq) => response.aquariumsIds.includes(aq.id)), // This is not filtering, it's returning every aquarium in general
	};
}

//region GET
export async function getUserGroups(): Promise<GroupResponse[]> {
	return await axiosInstance
		.get<GroupResponseAxios[]>(ENDPOINTS.GET_USER_GROUPS)
		.then((response) => {
			return response.data.map((group) => ({
				id: group.id,
				name: group.name,
				description: "Mock description for group",
				aquariumsIds: group.aquariumsIds ? group.aquariumsIds : [],
			}));
		})
		.catch((error) => {
			console.error("Error fetching gourps by user ID:", error);
			throw error;
		});
}

export async function getGroupAquariums(groupId: string): Promise<string[]> {
	console.log(`Fetching aquariums for group with ID: ${groupId}`);
	const res = await axiosInstance
		.get<SimpleAquarium[]>(
			ENDPOINTS.GET_GROUP_AQUARIUMS.replace(URL_PLACEHOLDER.GROUP_ID, groupId)
		)
		.then((response) => {
			console.log("Fetched aquariums:", response.data);
			return response.data;
		})
		.catch((error) => {
			console.error("Error fetching aquariums for group:", error);
			throw error;
		});
	return res.map((aquarium) => aquarium.id);
}
//endregion

//region POST
export async function addGroup(groupName: string): Promise<GroupResponse> {
	console.log(`Adding group with name: ${groupName}`);
	return await axiosInstance
		.post<GroupResponseAxios>(ENDPOINTS.ADD_GROUP + groupName)
		.then((response) => {
			return {
				id: response.data.id,
				name: response.data.name,
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

export async function addAquariumsToGroup(
	groupId: string,
	aquariumIds: string[]
): Promise<{ groupId: string; aquariumIds: string[] }> {
	for (const aquariumId of aquariumIds) {
		console.log(`Adding aquarium ${aquariumId} to group ${groupId}`);
		await axiosInstance
			.post(ENDPOINTS.ADD_AQUARIUM_TO_GROUP, {
				groupId: groupId,
				aquariumId: aquariumId,
			})
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.error("Error adding aquarium to group:", error);
				throw error;
			});
	}

	return { groupId, aquariumIds };
}
//endregion

//region DELETE~
export async function removeAquariumsFromGroup(
	groupId: string,
	aquariumIds: string[]
): Promise<{ groupId: string; aquariumIds: string[] }> {
	for (const aquariumId of aquariumIds) {
		console.log(`Removing aquarium ${aquariumId} from group ${groupId}`);
		await axiosInstance
			.delete(ENDPOINTS.REMOVE_AQUARIUM_FROM_GROUP, {
				data: {
					aquariumId: aquariumId,
					groupId: groupId,
				},
			})
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.error("Error removing aquarium from group:", error);
				console.error(`Group ID: ${groupId}, Aquarium ID: ${aquariumId}`);
				throw error;
			});
	}

	return { groupId, aquariumIds };
}

export async function deleteGroup(groupId: string): Promise<string> {
	console.log(`Deleting group with ID: ${groupId}`);
	await axiosInstance
		.delete(`${basepath}/${groupId}`)
		.then(() => {
			console.log(`Group with ID ${groupId} deleted successfully`);
		})
		.catch((error) => {
			console.error("Error deleting group:", error);
			throw error;
		});

	return groupId;
}
//endregion
