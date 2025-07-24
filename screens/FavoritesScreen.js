/*import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Alert,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [services, setServices] = useState([]);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  const fetchFavorites = async () => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const favIds = userSnap.data().favorites || [];

        if (favIds.length > 0) {
          const ref = collection(db, "compromissos");

          // Firestore só aceita no máximo 10 IDs com "in"
          const chunks = [];
          for (let i = 0; i < favIds.length; i += 10) {
            chunks.push(favIds.slice(i, i + 10));
          }

          const results = [];
          for (const chunk of chunks) {
            const q = query(ref, where("__name__", "in", chunk));
            const snapshot = await getDocs(q);
            snapshot.forEach((doc) => {
              results.push({ id: doc.id, ...doc.data() });
            });
          }

          setServices(results);
          setFavorites(favIds);
        } else {
          setServices([]);
          setFavorites([]);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    }
  };

  const call = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const sendEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const removeFromFavorites = async (serviceId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const currentFavs = userSnap.data().favorites || [];
        const updatedFavs = currentFavs.filter((id) => id !== serviceId);

        await updateDoc(userDocRef, {
          favorites: updatedFavs,
        });

        Alert.alert("Removido", "Serviço removido dos favoritos.");
        fetchFavorites(); // Atualiza a lista
      }
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      {services.length === 0 ? (
        <Text>Você ainda não tem favoritos.</Text>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.header}>{item.title}</Text>
              <Text>{item.descricao}</Text>
              <Text>{item.email}</Text>
              <Text>{item.telemovel}</Text>

              <View style={styles.buttons}>
                <TouchableOpacity
                  onPress={() => call(item.telemovel)}
                  style={styles.button}
                >
                  <Text>Ligar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => sendEmail(item.email)}
                  style={styles.button}
                >
                  <Text>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeFromFavorites(item.id)}
                  style={[styles.button, styles.removeButton]}
                >
                  <Text>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#eee",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  header: { fontWeight: "bold", fontSize: 16 },
  buttons: { flexDirection: "row", marginTop: 5, gap: 10, flexWrap: "wrap" },
  button: {
    padding: 6,
    backgroundColor: "#ddd",
    borderRadius: 4,
    marginTop: 5,
  },
  removeButton: {
    backgroundColor: "#ffbbbb",
  },
});*/
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
  getDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function FavoritesScreen() {
  const { user: currentUser, setUser } = useAuth();
  const [users, setUsers] = useState([]);

  // Atualiza lista sempre que o usuário mudar ou favoritos mudarem
  useEffect(() => {
    fetchFavorites();
  }, [currentUser?.favorites, currentUser?.uid]);

  const fetchFavorites = async () => {
    if (!currentUser?.uid || !currentUser?.favorites?.length) {
      setUsers([]);
      return;
    }

    try {
      const favIds = currentUser.favorites;

      const usersRef = collection(db, "users");

      // Dividir em chunks de 10 para consulta "in"
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

      setUsers(list);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
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

      // Atualiza o contexto do usuário para refletir a alteração
      setUser({ ...currentUser, favorites: newFavorites });
    } catch (error) {
      console.error("Erro ao remover dos favoritos:", error);
    }
  };

  const call = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const sendEmail = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      {users.length === 0 ? (
        <Text>Você ainda não tem favoritos.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.header}>{item.fullName || "Sem nome"}</Text>
                <TouchableOpacity onPress={() => removeFavorite(item.uid)}>
                  <Text style={styles.star}>★</Text>
                </TouchableOpacity>
              </View>
              <Text>Email: {item.email || "N/A"}</Text>
              <Text>Telefone: {item.phone || "N/A"}</Text>
              <View style={styles.buttons}>
                <TouchableOpacity onPress={() => call(item.phone)} style={styles.button}>
                  <Text>Ligar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => sendEmail(item.email)} style={styles.button}>
                  <Text>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 15,
    borderRadius: 12,
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    // Sombra para Android
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontWeight: "700",
    fontSize: 18,
    color: "#222",
  },
  star: {
    fontSize: 28,
    color: "#ff6b6b",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "flex-start",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 30,
    marginRight: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  text: {
    color: "#555",
    marginTop: 6,
    fontSize: 15,
  },
});






