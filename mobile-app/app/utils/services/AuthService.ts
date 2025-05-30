import { useMutation } from "@tanstack/react-query";
import {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "../../types/Auth";
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
        const userAquariums = await getUserAquariums();

        dispatch({
          type: EVENTS.SET_USER,
          payload: {
            nickname: t.nickname,
            name: t.name,
            email: t.email,
            role: t.role,
          },
        });

        if (userAquariums)
          dispatch({ type: EVENTS.SET_AQUARIUMS, payload: userAquariums });
        else dispatch({ type: EVENTS.SET_AQUARIUMS, payload: [] });

        router.gotoHome(true);
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

      await AsyncStorage.setItem("accessToken", data.token);

      try {
        // Fetch user aquarium data
        const userAquariums = await getUserAquariums();

        dispatch({
          type: EVENTS.SET_USER,
          payload: {
            nickname: response.nickname,
            name: response.name,
            email: response.email,
            role: response.role,
          },
        });

        if (userAquariums)
          dispatch({ type: EVENTS.SET_AQUARIUMS, payload: userAquariums });
        else dispatch({ type: EVENTS.SET_AQUARIUMS, payload: [] });

        router.gotoHome(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      router.gotoHome(true);
    },
  });
}
