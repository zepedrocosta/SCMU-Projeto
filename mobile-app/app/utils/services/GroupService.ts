import { useQuery } from "@tanstack/react-query";
import { getUserGroups } from "../api/GroupApi";

//region QUERIES
export function queryUserGroups() {
	return useQuery({
		queryKey: ["user-groups"],
		queryFn: () => getUserGroups(),
	});
}
//endregion
