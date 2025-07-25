import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./context/AuthContext"; // IMPORTANTE!

import Home from "./screens/Home";
import CreateAppointment from "./screens/CreateAppointment";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import DetailsScreen from "./screens/DetailsScreen";
import MainTabs from "./MainTabs";
import TimeExchangeScreen from "./screens/TimeExchangeScreen";
import TermsScreen from "./screens/TermsScreen"; // Termos e condições
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen"; // Redefinir senha

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth(); // Get current user

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            {/* Telas para usuário autenticado */}
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
            {/* Telas para usuário não autenticado */}
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
          </>
        )}

        {/* Tela de Termos e Condições disponível para todos */}
        <Stack.Screen
          name="TermsScreen"
          component={TermsScreen}
          options={{ title: "Terms and Conditions" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
