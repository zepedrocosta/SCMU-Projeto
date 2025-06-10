import { LoginRequest, LoginResponse } from "../../types/Auth";
import { Token } from "../../types/Token";
import { axiosInstance } from "./axiosConfig";
import { jwtDecode } from "jwt-decode";

const basePath = "/security";

const ENDPOINTS = {
	LOGIN: basePath,
	LOGOUT: basePath,
};

export function extractTokenFromResponse(response: any): string {
	const authHeader = response.headers["authorization"];
	if (!authHeader) {
		throw new Error("Authorization header not found in response");
	}
	const token = authHeader.split(" ")[1];
	if (!token) {
		throw new Error("Token not found in authorization header");
	}
	return token;
}

export async function authenticateUser(body: LoginRequest): Promise<LoginResponse> {
	return axiosInstance
		.put(ENDPOINTS.LOGIN, body)
		.then((response) => {
			const decodedToken: Token = jwtDecode(extractTokenFromResponse(response));

			console.log("Decoded token:", decodedToken);

			const loginResponse: LoginResponse = {
				nickname: decodedToken.nickname,
				accessToken: extractTokenFromResponse(response),
			};

			return loginResponse;
		})
		.catch((error) => {
			console.error("Error during authentication:", error);
			console.error("Details:", {
				path: error.config?.url,
				method: error.config?.method,
				status: error.response?.status,
				data: error.response?.data,
			});
			throw error;
		});
}

export async function logoutUser(): Promise<void> {
	return axiosInstance
		.delete(ENDPOINTS.LOGOUT)
		.then(() => {
			console.log("User logged out successfully");
		})
		.catch((error) => {
			console.error("Error during logout:", error);
			console.error("Details:", {
				path: error.config?.url,
				method: error.config?.method,
				status: error.response?.status,
				data: error.response?.data,
			});
			throw error;
		});

	console.log("Mock logout successful");
}
