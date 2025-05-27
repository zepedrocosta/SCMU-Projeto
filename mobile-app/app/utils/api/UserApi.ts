import { UserWithDefaults } from "../../types/User";
import { axiosInstance, URL_PLACEHOLDER } from "./axiosConfig";

const ENDPOINTS = {
	USER: `/users/${URL_PLACEHOLDER.USER_ID}`,
};

//region GET
export async function getUserInfo(userId: string): Promise<UserWithDefaults> {
	const mockResponse: UserWithDefaults = {
		id: userId,
		name: "John Doe",
		email: "some@gmail.com",
		defaults: {
			darkMode: false,
		},
	};
	return mockResponse;
}

// TODO uncomment when backend is ready
// export async function getUserInfo(userId: string): Promise<UserWithDefaults> {
// 	return axiosInstance
// 		.get<UserWithDefaults>(ENDPOINTS.USER.replace(URL_PLACEHOLDER.USER_ID, userId))
// 		.then((response) => {
// 			return response.data;
// 		})
// 		.catch((error) => {
// 			console.error("Error fetching user info:", error);
// 			throw error;
// 		});
// }
