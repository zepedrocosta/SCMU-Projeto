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

const StateContext = createContext<{
  user: State["user"];
  aquariums: State["aquariums"];
  defaults: State["defaults"];
  dispatch: Dispatch<Action>;
  isLoggedIn: boolean;
  loading: boolean;
}>({
  user: initialState.user,
  aquariums: initialState.aquariums,
  defaults: initialState.defaults,
  dispatch: () => undefined,
  isLoggedIn: false,
  loading: true,
});

export const StateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      const persistedState = await AsyncStorage.getItem("appState");
      if (persistedState) {
        dispatch({
          type: EVENTS.LOAD_STATE,
          payload: JSON.parse(persistedState),
        });
      }
      setLoading(false);
    })();
  }, []);

  // Persist state on change
  useEffect(() => {
    AsyncStorage.setItem("appState", JSON.stringify(state));
  }, [state]);

  const { user, aquariums, defaults } = state;
  const isLoggedIn = Boolean(user.nickname !== "");

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
      value={{ user, aquariums, defaults, dispatch, isLoggedIn, loading }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
