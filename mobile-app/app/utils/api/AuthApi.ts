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
  return axiosInstance
    .post(ENDPOINTS.REGISTER, body)
    .then(async (response) => {
      const data = response.data as RegisterResponse;
      data.token = await authenticateUser({
        email: body.email,
        password: body.password,
      });
      return data;
    })
    .catch((error) => {
      console.error("Error during registration:", error);
      throw error;
    });
}
