import { jwtDecode } from "jwt-decode";
import { RegisterRequest, RegisterResponse } from "../../types/Auth";
import { Token } from "../../types/Token";
import { User, UserResponse, UserUpdateRequest, UserWithDefaults } from "../../types/User";
import { axiosInstance, URL_PLACEHOLDER } from "./axiosConfig";
import { extractTokenFromResponse } from "./AuthApi";

const basepath = "/users";

const ENDPOINTS = {
	USER: `${basepath}/${URL_PLACEHOLDER.NICKNAME}`,
	REGISTER: basepath,
};

// region POST
export async function registerUser(body: RegisterRequest): Promise<RegisterResponse> {
	return axiosInstance
		.post<RegisterResponse>(ENDPOINTS.REGISTER, body)
		.then((response) => {
			return {
				email: response.data.email,
				password: response.data.password,
			};
		})
		.catch((error) => {
			console.error("Error during registration:", error);
			throw error;
		});
}
//endregion

//region GET
export async function getUserInfo(userId: string): Promise<UserWithDefaults> {
	// const mockResponse: UserWithDefaults = {
	// 	id: userId,
	// 	name: "John Doe",
	// 	email: "some@gmail.com",
	// 	nickname: "johndoe",
	// 	defaults: {
	// 		darkMode: false,
	// 		receiveNotifications: true,
	// 	},
	// };
	// return mockResponse;
	return axiosInstance
		.get<UserWithDefaults>(ENDPOINTS.USER.replace(URL_PLACEHOLDER.NICKNAME, userId))
		.then((response) => {
			const user: UserWithDefaults = {
				name: response.data.name,
				email: response.data.email,
				nickname: response.data.nickname,
				defaults: response.data.defaults || {
					darkMode: false,
					receiveNotifications: true,
				},
			};
			return user;
		})
		.catch((error) => {
			console.error("Error fetching user info:", error);
			throw error;
		});
}

export async function updateUserInfo(
	userId: string,
	body: UserUpdateRequest
): Promise<UserResponse> {
	const mockResponse: UserResponse = {
		name: body.name,
		email: "some@gmail.com",
		nickname: "johndoe",
	};

	return mockResponse;

	// TODO uncomment when backend is ready
	return axiosInstance
		.put<UserResponse>(ENDPOINTS.USER.replace(URL_PLACEHOLDER.NICKNAME, userId), body)
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
