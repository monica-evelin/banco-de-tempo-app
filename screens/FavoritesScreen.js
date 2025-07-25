import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { db } from "../firebaseConfig";
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


//Importar imagem de fundo
import Background from "../components/Background";

// Ícones para cada tipo de serviço
const skillIcons = {
  "Elderly Care": "🧑‍🦽",
  "Gardening": "🌿",
  "Babysitting": "👶",
  "Computer Help": "💻",
  "Cooking": "🍳",
  "House cleaning": "🧼",
  "Pet Sitting": "🐾",
  "Tutoring": "📚",
  "Outro": "🔧", // fallback
};

// Função para formatar nome (com espaço e letras maiúsculas corretamente)
const formatSkill = (skill) => {
  // Garante maiúsculas e espaçamento bonito mesmo se vier minúsculo ou junto
  const map = {
    elderlycare: "Elderly Care",
    gardening: "Gardening",
    babysitting: "Babysitting",
    computerhelp: "Computer Help",
    cooking: "Cooking",
    housecleaning: "House Cleaning",
    petsitting: "Pet Sitting",
    tutoring: "Tutoring",
  };

  const cleaned = skill?.toLowerCase().replace(/\s/g, "") || "outro";
  return map[cleaned] || "Outro";
};

export default function FavoritesScreen() {
  const { user: currentUser, setUser } = useAuth();
  const [groupedFavorites, setGroupedFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, [currentUser?.favorites, currentUser?.uid]);

  const fetchFavorites = async () => {
    if (!currentUser?.uid || !currentUser?.favorites?.length) {
      setGroupedFavorites([]);
      return;
    }

    try {
      const favIds = currentUser.favorites;
      const usersRef = collection(db, "users");

      // Divide os IDs em grupos de até 10 (limite da cláusula "in")
      const chunks = [];
      for (let i = 0; i < favIds.length; i += 10) {
        chunks.push(favIds.slice(i, i + 10));
      }

      let list = [];
      for (const chunk of chunks) {
        const q = query(usersRef, where("__name__", "in", chunk));
        const snapshot = await getDocs(q);
        list = [
          ...list,
          ...snapshot.docs.map((doc) => ({
            uid: doc.id,
            ...doc.data(),
          })),
        ];
      }

      // Agrupa por skill
      const grouped = {};
      list.forEach((user) => {
        const skill = user.skill?.toLowerCase() || "outro";
        if (!grouped[skill]) grouped[skill] = [];
        grouped[skill].push(user);
      });

      // Ordena os grupos e os usuários dentro de cada grupo
      const sortedGroups = Object.keys(grouped)
        .sort()
        .map((skill) => ({
          skill,
          users: grouped[skill].sort((a, b) =>
            (a.fullName || "").localeCompare(b.fullName || "")
          ),
        }));

      setGroupedFavorites(sortedGroups);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const removeFavorite = async (uidToRemove) => {
    if (!currentUser?.uid) return;

    try {
      const newFavorites = currentUser.favorites.filter(
        (favUid) => favUid !== uidToRemove
      );
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, { favorites: newFavorites });

      setUser({ ...currentUser, favorites: newFavorites });
    } catch (error) {
      console.error("Erro removing favorite:", error);
    }
  };

  const call = (phone) => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const sendEmail = (email) => {
    if (email) Linking.openURL(`mailto:${email}`);
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>My Favorites</Text>
        {groupedFavorites.length === 0 ? (
          <Text style={styles.noFav}>Uou don't have any favorites yet.</Text>
        ) : (
          <FlatList
            data={groupedFavorites}
            keyExtractor={(item) => item.skill}
            renderItem={({ item }) => (
              <View style={styles.group}>
                <View style={styles.groupTitleRow}>
                  <View style={styles.skillIconWrapper}>
                    <Text style={styles.skillIconText}>
                      {skillIcons[formatSkill(item.skill)] || "🔧"}
                    </Text>
                  </View>
                    <Text style={styles.groupTitle}>{formatSkill(item.skill)}</Text>
                </View>

                {item.users.map((user) => (
                  <View key={user.uid} style={styles.card}>
                    <View style={styles.headerRow}>
                      <Text style={styles.header}>
                        {user.fullName || "Sem nome"}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeFavorite(user.uid)}
                      >
                        <Text style={styles.star}>★</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.text}>
                      Email: {user.email || "N/A"}
                    </Text>
                    <Text style={styles.text}>
                      Phone: {user.phone || "N/A"}
                    </Text>
                   <View style={styles.buttons}>
                      <TouchableOpacity
                       onPress={() => call(user.phone)}
                       style={styles.button}
                      >
                        <Icon name="phone" size={20} color="white" />
                        <Text style={styles.buttonText}>Call</Text>
                      </TouchableOpacity>
                      <View style={{ width: 8 }} />
                      <TouchableOpacity
                        onPress={() => sendEmail(user.email)}
                        style={styles.button}
                      >
                        <Icon name="email-outline" size={20} color="white" />
                       <Text style={styles.buttonText}>Email</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                ))}
              </View>
            )}
          />
        )}
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  noFav: {
    textAlign: "center",
    color: "#ccc",
    fontSize: 16,
    marginTop: 30,
  },
  group: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff" /*"#4A4A4A",*/,
    textTransform: "capitalize",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  header: {
    fontWeight: "700",
    fontSize: 18,
    color: "#222",
  },
  star: {
    fontSize: 24,
    color: "#FFD700",
  },
  text: {
    color: "#444",
    fontSize: 15,
    marginVertical: 2,
  },
  buttons: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
  skillIconWrapper: {
    backgroundColor: "#fff",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  skillIconText: {
    fontSize: 20,
  },
  groupTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

});
