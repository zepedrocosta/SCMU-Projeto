import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useEffect, useState } from "react";
import { useLogin } from "../utils/services/AuthService";
import { useRoutes } from "../utils/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useStateContext } from "../context/StateContext";
import { getUserInfo } from "../utils/api/UserApi";
import { getUserAquariums } from "../utils/api/AquariumApi";
import { EVENTS } from "../context/reducer";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Min 6 characters" }),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRoutes();

  const { mutate } = useLogin();
  const { dispatch } = useStateContext();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginInput) => {
    mutate(data, {});
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        let t: any = jwtDecode(token);
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
      }
    };
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/favicon.png")} style={styles.logo} />

      <Card>
        <Card.Title title="Login" />
        <Card.Content>
          <TextInput
            label="Email"
            mode="outlined"
            onChangeText={(text) => setValue("email", text)}
            error={!!errors.email}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry={!showPassword}
            onChangeText={(text) => setValue("password", text)}
            error={!!errors.password}
            style={{ marginTop: 16 }}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={{ marginTop: 24 }}
          >
            Login
          </Button>

          <Button
            mode="text"
            onPress={() => router.gotoRegister()}
            style={{ marginTop: 8 }}
          >
            Don't have an account? Register here
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  error: {
    color: "red",
    marginTop: 4,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
});
