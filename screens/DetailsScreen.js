import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const BACKGROUND_IMAGE = require("../assets/images/fundo.png");
export default function DetailsScreen({ route }) {
  const { compromisso } = route.params || {};
  const dateObj = compromisso?.dateStr
    ? new Date(compromisso.dateStr)
    : new Date();
  const handlePhonePress = () => {
    if (compromisso?.telemovel) {
      Linking.openURL(`tel:${compromisso.telemovel}`);
    }
  };
  const handleEmailPress = () => {
    if (compromisso?.email) {
      Linking.openURL(`mailto:${compromisso.email}`);
    }
  };
  const contactOptions = () => {
    const options = [];
    if (compromisso?.email) {
      options.push({
        text: "Send Email",
        onPress: handleEmailPress,
      });
    }
    if (compromisso?.telemovel) {
      options.push({
        text: "Call",
        onPress: handlePhonePress,
      });
    }
    options.push({ text: "Cancel", style: "cancel" });
    Alert.alert("Contact Options", "Choose an option:", options, {
      cancelable: true,
    });
  };
  return (
<ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.background}
      resizeMode="cover"
>
<SafeAreaView style={styles.container}>
<ScrollView contentContainerStyle={styles.content}>
<Text style={styles.title}>{compromisso?.title || "Detalhes"}</Text>
<View style={styles.card}>
<View style={styles.row}>
<Icon name="account" size={24} color="#4CAF50" />
<Text style={styles.text}>{compromisso?.title}</Text>
</View>
<View style={styles.row}>
<Icon name="email-outline" size={24} color="#4CAF50" />
<Text style={styles.text}>
                {compromisso?.email || "Sem email"}
</Text>
</View>
<View style={styles.row}>
<Icon name="map-marker" size={24} color="#4CAF50" />
<Text style={styles.text}>
                {compromisso?.morada || "Sem morada"}
</Text>
</View>
<View style={styles.row}>
<Icon name="calendar" size={24} color="#4CAF50" />
<Text style={styles.text}>
                {dateObj.toLocaleDateString()} -{" "}
                {dateObj.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
</Text>
</View>
</View>
          {(compromisso?.telemovel || compromisso?.email) && (
<TouchableOpacity
              style={styles.contactButton}
              onPress={contactOptions}
>
<Icon name="contacts" size={20} color="#fff" />
<Text style={styles.contactButtonText}>Contact</Text>
</TouchableOpacity>
          )}
</ScrollView>
</SafeAreaView>
</ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    paddingVertical: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  contactButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "60%",
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
});
