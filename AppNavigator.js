import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./context/AuthContext"; // IMPORTANTE!

import Home from "./screens/Home";
import createAppointment from "./screens/CreateAppointment";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import DetailsScreen from "./screens/DetailsScreen";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth(); // Pega o usuário atual

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="createAppointment" component={createAppointment} />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
