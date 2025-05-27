import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../api/UserApi";

//region QUERIES
export function queryUserInfo(userId: string) {
	return useQuery({
		queryKey: ["user-info"],
		queryFn: () => getUserInfo(userId),
	});
}
