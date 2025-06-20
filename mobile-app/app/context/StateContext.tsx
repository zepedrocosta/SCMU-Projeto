import {
	createContext,
	Dispatch,
	FC,
	ReactNode,
	useContext,
	useEffect,
	useReducer,
	useState,
} from "react";
import { Action, EVENTS, reducer } from "./reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialState, State } from "./state";
import { ActivityIndicator } from "react-native-paper";
import { getUserInfo } from "../utils/api/UserApi";
import { getUserAquariums } from "../utils/api/AquariumApi";

const StateContext = createContext<{
	user: State["user"];
	aquariums: State["aquariums"];
	groups: State["groups"];
	defaults: State["defaults"];
	dispatch: Dispatch<Action>;
	isLoggedIn: boolean;
	loading: boolean;
	unreadNotifications: number;
}>({
	user: initialState.user,
	aquariums: initialState.aquariums,
	groups: initialState.groups,
	defaults: initialState.defaults,
	dispatch: () => undefined,
	isLoggedIn: false,
	loading: true,
	unreadNotifications: 0,
});

export const StateProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [loading, setLoading] = useState(true);

	// Load persisted state on mount
	useEffect(() => {
		(async () => {
			const persistedState = await AsyncStorage.getItem("appState");
			if (persistedState) {
				dispatch({ type: EVENTS.LOAD_STATE, payload: JSON.parse(persistedState) });
			} else {
				// Try to restore session from token
				const token = await AsyncStorage.getItem("accessToken");
				if (token) {
					const userId = "userId";
					if (userId) {
						try {
							const [userInfo, userAquariums] = await Promise.all([
								getUserInfo(userId),
								getUserAquariums(),
							]);
							dispatch({ type: EVENTS.SET_USER, payload: userInfo });
							dispatch({
								type: EVENTS.SET_DEFAULTS,
								payload: userInfo.defaults,
							});
							dispatch({ type: EVENTS.SET_AQUARIUMS, payload: userAquariums });
						} catch (e) {
							console.error("Failed to restore session", e);
						}
					}
				}
			}
			setLoading(false);
		})();
	}, []);

	// Persist state on change
	useEffect(() => {
		AsyncStorage.setItem("appState", JSON.stringify(state));
	}, [state]);

	const { user, aquariums, groups, defaults, unreadNotifications } = state;
	const isLoggedIn =
		typeof user.nickname === "string" && user.nickname.length > 0 && user.nickname !== "0";

	if (loading) {
		return (
			<ActivityIndicator
				animating={true}
				color={"red"}
				size={100}
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			/>
		);
	}

	return (
		<StateContext.Provider
			value={{
				user,
				aquariums,
				groups,
				defaults,
				dispatch,
				isLoggedIn,
				loading,
				unreadNotifications,
			}}
		>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
