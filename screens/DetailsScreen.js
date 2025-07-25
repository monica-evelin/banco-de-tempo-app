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
  ImageBackground,
} from "react-native";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/AuthContext";

export default function DetailsScreen({ route }) {
  const { compromisso } = route.params || {};
  const [users, setUsers] = useState([]);
  const { user: currentUser, setUser } = useAuth();

  useEffect(() => {
    if (!compromisso?.tipo) return;

    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filteredUsers = snapshot.docs
        .map((doc) => ({ uid: doc.id, ...doc.data() }))
        .filter(
          (user) =>
            user.skill &&
            user.skill.toLowerCase() === compromisso.tipo.toLowerCase()
        );
      setUsers(filteredUsers);
    });

    return () => unsubscribe();
  }, [compromisso?.tipo]);

  const toggleFavorite = async (targetUser) => {
    if (!currentUser?.uid || !targetUser?.uid) {
      console.warn("UIDs inválidos");
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid);
    const currentFavorites = currentUser.favorites || [];
    const alreadyFavorited = currentFavorites.includes(targetUser.uid);
    const updatedFavorites = alreadyFavorited
      ? currentFavorites.filter((uid) => uid !== targetUser.uid)
      : [...currentFavorites, targetUser.uid];
    try {
      await updateDoc(userDocRef, { favorites: updatedFavorites });
      setUser({ ...currentUser, favorites: updatedFavorites });
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
    }
  };

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={{
          uri: "https://www.transparenttextures.com/patterns/inspiration-geometry.png",
        }}
        style={styles.background}
        resizeMode="repeat"
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>{compromisso?.title || "Details"}</Text>

            {users.length === 0 ? (
              <Text style={styles.noUsers}>
                No users found for this service.
              </Text>
            ) : (
              users.map((user, index) => (
                <View key={index} style={styles.userCard}>
                  <View style={styles.userInfo}>
                    <View style={styles.row}>
                      <Icon name="account" size={20} color="#4CAF50" />
                      <Text style={styles.cardTitle}>{user.fullName || "No name"}</Text>

                      <TouchableOpacity
                        onPress={() => toggleFavorite(user)}
                        style={styles.favoriteIcon}
                      >
                        <Icon
                          name="star"
                          size={28}
                          color={
                            currentUser?.favorites?.includes(user.uid)
                              ? "#FFD700"
                              : "#999"
                          }
                          style={
                            currentUser?.favorites?.includes(user.uid)
                              ? styles.iconWithBorder
                              : styles.iconEmpty
                          }
                        />
                      </TouchableOpacity>
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
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#3b5998",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
    zIndex: 1,
    marginTop: 20,
  },
  noUsers: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginTop: 20,
  },
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
    marginTop: -15,
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
    marginRight: 10,
    flexShrink: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  favoriteIcon: {
    marginLeft: 5,
  },

  iconWithBorder: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 20,
  },

  iconEmpty: {
    color: "#999",
  },
});

