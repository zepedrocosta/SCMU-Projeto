import { User, UserWithDefaults } from "../../types/User";
import { axiosInstance, URL_PLACEHOLDER } from "./axiosConfig";

const ENDPOINTS = {
  USER: `/users/${URL_PLACEHOLDER.USER_ID}`,
};

//region GET
export async function getUserInfo(userId: string): Promise<User> {
  const mockResponse: User = {
    nickname: userId,
    name: "John Doe",
    email: "some@gmail.com",
    role: "USER",
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
