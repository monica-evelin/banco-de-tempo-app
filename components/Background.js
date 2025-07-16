// components/Background.js
import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";

const Background = ({ children }) => {
  return (
    <ImageBackground
      source={require("../assets/images/fundo.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "#020381", // ou ajuste conforme seu app
    padding: 20,
  },
});

export default Background;
