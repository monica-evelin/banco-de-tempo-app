import React from "react";
import { ImageBackground, StyleSheet } from "react-native";

export default function Background({ children }) {
  return (
    <ImageBackground
      source={{
        uri: "https://www.transparenttextures.com/patterns/inspiration-geometry.png",
      }}
      resizeMode="repeat"
      style={styles.background}
      imageStyle={styles.image}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#3b5998",
    paddingTop: 40,
  },
  image: {
    opacity: 0.6,
  },
});
