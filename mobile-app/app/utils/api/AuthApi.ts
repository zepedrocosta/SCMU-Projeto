import { LoginRequest, LoginResponse } from "../../types/Login";
import { axiosInstance } from "./axiosConfig";

const ENDPOINTS = {
	AUTH: "/auth",
	REGISTER: "/users",
	REFRESH_TOKEN: "/auth/refresh-token",
};

export async function authenticateUser(body: LoginRequest): Promise<LoginResponse> {
	const mockResponse: LoginResponse = {
		userId: "mockUserId",
		accessToken: "mockAccessToken",
		refreshToken: "mockRefreshToken",
	};

	return mockResponse;

	// return axiosInstance
	// 	.post<LoginResponse>(ENDPOINTS.AUTH, body)
	// 	.then((response) => {
	// 		return response.data;
	// 	})
	// 	.catch((error) => {
	// 		console.error("Error during authentication:", error);
	// 		throw error;
	// 	});
}

// export async function registerUser(
// 	body: RegisterRequest
// ): Promise<ApiResponse<LoginResponse>> {
// 	return apiCall<LoginResponse>(axiosNoAuth, {
// 		url: ENDPOINTS.REGISTER,
// 		method: HTTP_METHOD.POST,
// 		data: body,
// 	});
// }
