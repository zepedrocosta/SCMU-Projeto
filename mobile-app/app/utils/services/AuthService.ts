import { useMutation } from "@tanstack/react-query";
import { LoginRequest, RegisterRequest } from "../../types/Auth";
import { authenticateUser, registerUser } from "../api/AuthApi";
import { getUserAquariums } from "../api/AquariumApi";
import { getUserInfo } from "../api/UserApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStateContext } from "../../context/StateContext";
import { EVENTS } from "../../context/reducer";
import { useRoutes } from "../routes";
import { jwtDecode } from "jwt-decode";

export function useLogin() {
  const router = useRoutes();

  const { dispatch } = useStateContext();

  return useMutation({
    mutationFn: (data: LoginRequest) => authenticateUser(data),
    onError: (error) => {
      console.error("Login error:", error);
    },
    onSuccess: async (response) => {
      await AsyncStorage.setItem("accessToken", response);
      let t: any = jwtDecode(response); //TODO: Maybe create a type for this... Maybe not...

      try {
        // Fetch user aquarium data
        const [userInfo, userAquariums] = await Promise.all([
          getUserInfo(t.nickname),
          getUserAquariums(t.nickname),
        ]);

        if (userInfo) {
          dispatch({ type: EVENTS.SET_USER, payload: userInfo });
          dispatch({ type: EVENTS.SET_DEFAULTS, payload: userInfo.defaults });
        } else {
          console.error("User not found");
        }

        if (userAquariums) {
          dispatch({ type: EVENTS.SET_AQUARIUMS, payload: userAquariums });
          console.log("User aquariums:", userAquariums);
        } else {
          dispatch({ type: EVENTS.SET_AQUARIUMS, payload: [] });
          console.log("No aquariums found for user");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      router.gotoHome(true);
    },
  });
}

export function useRegister() {
  const router = useRoutes();

  const { dispatch } = useStateContext();

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onError: (error) => {
      console.error("Register error:", error);
    },
    onSuccess: async (response) => {
      const data = response;

      console.log("Register successful:", data);

      await AsyncStorage.setItem("accessToken", data.accessToken);

      try {
        // Fetch user aquarium data
        const [userInfo, userAquariums] = await Promise.all([
          getUserInfo(data.userId),
          getUserAquariums(data.userId),
        ]);

        if (userInfo) {
          dispatch({ type: EVENTS.SET_USER, payload: userInfo });
          dispatch({ type: EVENTS.SET_DEFAULTS, payload: userInfo.defaults });
        } else {
          console.error("User not found");
        }

        if (userAquariums) {
          dispatch({ type: EVENTS.SET_AQUARIUMS, payload: userAquariums });
          console.log("User aquariums:", userAquariums);
        } else {
          dispatch({ type: EVENTS.SET_AQUARIUMS, payload: [] });
          console.log("No aquariums found for user");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      router.gotoHome(true);
    },
  });
}
