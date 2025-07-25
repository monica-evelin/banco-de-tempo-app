import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Terms and Conditions</Text>

        <Text style={styles.paragraph}>
          Here you can add your full terms and conditions text. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </Text>

        <Text style={styles.paragraph}>
          More detailed terms and explanations...
        </Text>
        {/* Adicione mais texto conforme necessário */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
});
