import {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "../../types/Auth";
import { axiosInstance } from "./axiosConfig";

const ENDPOINTS = {
  AUTH: "/security",
  REGISTER: "/users",
  REFRESH_TOKEN: "/auth/refresh-token",
};

export async function authenticateUser(body: LoginRequest): Promise<string> {
  /*const mockResponse: LoginResponse = {
		userId: "mockUserId",
		accessToken: "mockAccessToken",
		refreshToken: "mockRefreshToken",
	};

	return mockResponse;*/

  //TODO - Uncomment the following code when the backend is ready
  return axiosInstance
    .put(ENDPOINTS.AUTH, body)
    .then((response) => {
      return response.headers["authorization"].split(" ")[1];
    })
    .catch((error) => {
      console.error("Error during authentication:", error);
      throw error;
    });
}

export async function registerUser(
  body: RegisterRequest
): Promise<RegisterResponse> {
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
