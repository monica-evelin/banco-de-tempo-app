import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./screens/Home";
import CreateAppointment from "./screens/CreateAppointment";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import DetailsScreen from "./screens/DetailsScreen";
import MainTabs from "./MainTabs";
import { useAuth } from "./context/AuthContext";
import TimeExchangeScreen from "./screens/TimeExchangeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth(); // Get current user

  return (
    <NavigationContainer>
<<<<<<< HEAD
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="createAppointment" component={createAppointment} />
        <Stack.Screen name="Details" component={DetailsScreen} />
=======
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="createAppointment"
              component={CreateAppointment}
            />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen
              name="TimeExchange"
              component={TimeExchangeScreen}
              options={{ title: "Time Exchange" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        )}
>>>>>>> origin/main
      </Stack.Navigator>
    </NavigationContainer>
  );
}
