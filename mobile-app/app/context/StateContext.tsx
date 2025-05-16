import {
	createContext,
	Dispatch,
	FC,
	ReactNode,
	useContext,
	useEffect,
	useReducer,
} from "react";
import { Action, EVENTS, reducer } from "./reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialState, State } from "./state";

const StateContext = createContext<{
	user: State["user"];
	aquariums: State["aquariums"];
	defaults: State["defaults"];
	dispatch: Dispatch<Action>;
	isLoggedIn: boolean;
}>({
	user: initialState.user,
	aquariums: initialState.aquariums,
	defaults: initialState.defaults,
	dispatch: () => undefined,
	isLoggedIn: false,
});

export const StateProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	// Load persisted state on mount
	useEffect(() => {
		(async () => {
			const persistedState = await AsyncStorage.getItem("appState");
			if (persistedState) {
				dispatch({ type: EVENTS.LOAD_STATE, payload: JSON.parse(persistedState) });
			}
		})();
	}, []);

	// Persist state on change
	useEffect(() => {
		AsyncStorage.setItem("appState", JSON.stringify(state));
	}, [state]);

	const { user, aquariums, defaults } = state;
	const isLoggedIn = Boolean(user.id !== "");

	return (
		<StateContext.Provider value={{ user, aquariums, defaults, dispatch, isLoggedIn }}>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
