import { User, UserResponse, UserUpdateRequest, UserWithDefaults } from "../../types/User";
import { axiosInstance, URL_PLACEHOLDER } from "./axiosConfig";

const basepath = "/users";

const ENDPOINTS = {
	USER: `${basepath}/${URL_PLACEHOLDER.USER_ID}`,
};

//region GET
export async function getUserInfo(userId: string): Promise<UserWithDefaults> {
	const mockResponse: UserWithDefaults = {
		id: userId,
		name: "John Doe",
		email: "some@gmail.com",
		nickname: "johndoe",
		defaults: {
			darkMode: false,
		},
	};
	return mockResponse;
}

export async function updateUserInfo(
	userId: string,
	body: UserUpdateRequest
): Promise<UserResponse> {
	const mockResponse: UserResponse = {
		id: userId,
		name: body.name,
		email: "some@gmail.com",
		nickname: "johndoe",
	};

	return mockResponse;

	// TODO uncomment when backend is ready
	return axiosInstance
		.put<UserResponse>(ENDPOINTS.USER.replace(URL_PLACEHOLDER.USER_ID, userId), body)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			console.error("Error updating user info:", error);
			throw error;
		});
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
