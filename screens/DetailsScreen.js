import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  SafeAreaView,
  Image,
} from "react-native";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function DetailsScreen({ route }) {
  const { compromisso } = route.params || {};
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!compromisso?.tipo) return;

    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filteredUsers = snapshot.docs
        .map((doc) => doc.data())
        .filter(
          (user) =>
            user.skill &&
            user.skill.toLowerCase() === compromisso.tipo.toLowerCase()
        );
      setUsers(filteredUsers);
    });

    return () => unsubscribe();
  }, [compromisso?.tipo]);

  const contactOptions = (email, phone) => {
    const options = [];
    if (email) {
      options.push({
        text: "Send Email",
        onPress: () => Linking.openURL(`mailto:${email}`),
      });
    }
    if (phone) {
      options.push({
        text: "Call",
        onPress: () => Linking.openURL(`tel:${phone}`),
      });
    }
    options.push({ text: "Cancel", style: "cancel" });

    Alert.alert("Contact Options", "Choose an option:", options, {
      cancelable: true,
    });
  };

  const dateObj = compromisso?.dateStr
    ? new Date(compromisso.dateStr)
    : new Date();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{compromisso?.title || "Details"}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Icon name="account" size={24} color="#4CAF50" />
            <Text style={styles.text}>{compromisso?.title}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="email-outline" size={24} color="#4CAF50" />
            <Text style={styles.text}>{compromisso?.email || "No email"}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="map-marker" size={24} color="#4CAF50" />
            <Text style={styles.text}>
              {compromisso?.morada || "No address"}
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

        <Text style={styles.sectionTitle}>Users offering this service:</Text>

        {users.length === 0 ? (
          <Text style={styles.noUsers}>No users found for this service.</Text>
        ) : (
          users.map((user, index) => (
            <View key={index} style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.row}>
                  <Icon name="account" size={20} color="#4CAF50" />
                  <Text style={styles.cardTitle}>
                    {user.fullName || "No name"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Icon name="email-outline" size={20} color="#4CAF50" />
                  <Text style={styles.cardDescription}>
                    {user.email || "No email"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Icon name="phone" size={20} color="#4CAF50" />
                  <Text style={styles.cardDescription}>
                    {user.phone || "No phone"}
                  </Text>
                </View>
              </View>

              <Image
                source={
                  user.photoURL
                    ? { uri: user.photoURL }
                    : require("../assets/images/perfil.png")
                }
                style={styles.userImage}
              />

              <View style={styles.buttonContainer}>
                {(user.email || user.phone) && (
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => contactOptions(user.email, user.phone)}
                  >
                    <Icon name="contacts" size={18} color="#fff" />
                    <Text style={styles.contactButtonText}>Contact</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "rgba(2, 3, 129, 1)",
  },
  content: { paddingVertical: 30 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  text: { marginLeft: 10, fontSize: 18, color: "#333" },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#fff",
  },
  noUsers: { fontSize: 16, color: "#ccc", textAlign: "center", marginTop: 20 },

  // User Card
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    position: "relative",
  },
  userInfo: {
    flex: 1,
  },
  userImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginLeft: 16,
    marginTop: -15, // <<< aqui para subir a imagem
    alignSelf: "flex-start",
    backgroundColor: "#ccc",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 12,
    right: 16,
  },
  contactButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
});
