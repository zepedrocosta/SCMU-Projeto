import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const basePath = "https://scmu.zepedrocosta.com/rest";

export const axiosInstance = axios.create({ baseURL: basePath });

axiosInstance.interceptors.request.use(
	async (config) => {
		const token = await AsyncStorage.getItem("accessToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const URL_PLACEHOLDER = {
	AQUARIUM_ID: ":aquariumId",
	USER_ID: ":userId",
};
