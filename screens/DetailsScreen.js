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
              <Text style={styles.noUsers}>No users found for this service.</Text>
            ) : (
              users.map((user, index) => {
                const isFavorite = currentUser?.favorites?.includes(user.uid);
                return (
                  <View key={index} style={styles.userCard}>
                    <View style={styles.row}>
                      <Image
                        source={
                          user.photoURL
                            ? { uri: user.photoURL }
                            : require("../assets/images/perfil.png")
                        }
                        style={styles.userImage}
                      />

                      <View style={styles.infoContainer}>
                        <Text style={styles.cardTitle}>
                          {user.fullName || "No name"}
                        </Text>

                        <TouchableOpacity
                          onPress={() => toggleFavorite(user)}
                          style={[
                            styles.favoriteIcon,
                            isFavorite && styles.favoriteIconActive,
                          ]}
                        >
                          <Icon
                            name={isFavorite ? "star" : "star-outline"}
                            size={28}
                            color={isFavorite ? "#FFD700" : "#999"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.buttonGroup}>
                      {user.phone && (
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => Linking.openURL(`tel:${user.phone}`)}
                        >
                          <Icon name="phone" size={18} color="#fff" />
                          <Text style={styles.buttonText}>Call</Text>
                        </TouchableOpacity>
                      )}
                      {user.email && (
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => Linking.openURL(`mailto:${user.email}`)}
                        >
                          <Icon name="email-outline" size={18} color="#fff" />
                          <Text style={styles.buttonText}>Email</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })
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
  overlay: {
    flex: 1,
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
    padding: 20,
    marginBottom: 30,
    width: "100%",
    minHeight: 140,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ccc",
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
  },
  favoriteIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIconActive: {
    borderWidth: 2,
    borderColor: "#999",
    borderRadius: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
});






