import {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
} from "../../types/Auth";
import { axiosInstance } from "./axiosConfig";

const basePath = "/security";

const ENDPOINTS = {
	LOGIN: basePath,
	LOGOUT: basePath,
};

export async function authenticateUser(body: LoginRequest): Promise<LoginResponse> {
	const mockResponse: LoginResponse = {
		userId: "mockUserId",
		accessToken: "mockAccessToken",
		refreshToken: "mockRefreshToken",
	};

	return mockResponse;

	//TODO - Uncomment the following code when the backend is ready
	// return axiosInstance
	// 	.put<LoginResponse>(ENDPOINTS.LOGIN, body)
	// 	.then((response) => {
	// 		return response.data;
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error during authentication:", error);
	// 		throw error;
	// 	});
}

export async function logoutUser(): Promise<void> {
	//TODO - Uncomment the following code when the backend is ready
	// return axiosInstance
	// 	.delete(ENDPOINTS.LOGOUT)
	// 	.then(() => {
	// 		console.log("User logged out successfully");
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error during logout:", error);
	// 		throw error;
	// 	});

	console.log("Mock logout successful");
}

export async function registerUser(body: RegisterRequest): Promise<RegisterResponse> {
	const mockResponse: RegisterResponse = {
		userId: "mockUserId",
		accessToken: "mockAccessToken",
		refreshToken: "mockRefreshToken",
	};

	return mockResponse;

	//TODO - Uncomment the following code when the backend is ready
	// return axiosInstance
	// 	.post<RegisterResponse>(ENDPOINTS.REGISTER, body)
	// 	.then((response) => {
	// 		return response.data;
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error during registration:", error);
	// 		throw error;
	// 	});
}
