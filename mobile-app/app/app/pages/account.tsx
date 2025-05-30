import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text, List, Divider, Button } from "react-native-paper";
import { useStateContext } from "../../context/StateContext";
import { EVENTS } from "../../context/reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoutes } from "../../utils/routes";

export default function AccountPage() {
  const { user, dispatch } = useStateContext();

  const router = useRoutes();

  const handleLogout = () => {
    AsyncStorage.removeItem("appState");
    AsyncStorage.removeItem("accessToken"); // TODO: Check why this was not here
    dispatch({ type: EVENTS.CLEAR_USER });
    router.gotoIndex();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={72} icon="account" style={styles.avatar} />
        <Text variant="titleLarge" style={styles.name}>
          {user.name || "Test User"}
        </Text>
        <Text variant="bodyMedium" style={styles.email}>
          {user.email || "test@gmail.com"}
        </Text>
      </View>
      <Divider style={{ marginVertical: 16 }} />
      <List.Section>
        <List.Item
          title="Edit Profile"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          onPress={() => {}}
        />

        <List.Item
          title="Notifications"
          left={(props) => <List.Icon {...props} icon="bell" />}
          onPress={() => {
            router.gotoNotifications();
          }}
        />
      </List.Section>
      <Divider style={{ marginVertical: 16 }} />
      <Button
        mode="contained-tonal"
        icon="logout"
        onPress={() => {
          handleLogout();
        }}
        style={styles.logout}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: "#2196f3",
    marginBottom: 8,
  },
  name: {
    marginTop: 4,
    fontWeight: "bold",
  },
  email: {
    color: "#888",
  },
  logout: {
    marginTop: 24,
  },
});
