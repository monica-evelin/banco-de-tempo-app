import React from "react";
import AppNavigator from "./AppNavigator"; // ajuste o caminho conforme a sua pasta
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
