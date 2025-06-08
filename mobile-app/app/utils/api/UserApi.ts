import { RegisterRequest, RegisterResponse } from "../../types/Auth";
import { UserWithDefaults } from "../../types/User";
import { axiosInstance, URL_PLACEHOLDER } from "./axiosConfig";

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
			console.log("Fetched user info:", user);
			return user;
		})
		.catch((error) => {
			console.error("Error fetching user info:", error);
			throw error;
		});
}
