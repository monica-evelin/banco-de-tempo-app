import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

export default function ServiceProvidersScreen() {
  const route = useRoute();
  const { tipoServico } = route.params;

  const [appointments, setAppointments] = useState([]);
  const [favorites, setFavorites] = useState([]); // ADICIONADO
  const userId = auth.currentUser?.uid; // pega o id do usuário logado

  // Buscar compromissos do tipo selecionado
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const compromissosRef = collection(db, "compromissos");
        const q = query(compromissosRef, where("tipo", "==", tipoServico));
        const snapshot = await getDocs(q);

        const promises = snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();

          let fullName = "Desconhecido";
          if (data.userId) {
            const userRef = doc(db, "users", data.userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              fullName = userData.favorites?.fullName || "Sem nome";
            }
          }

          return {
            id: docSnap.id,
            ...data,
            fullName,
          };
        });

        const listWithNames = await Promise.all(promises);
        setAppointments(listWithNames);
      } catch (error) {
        console.error("Erro ao buscar compromissos:", error);
      }
    };

    fetchAppointments();
  }, [tipoServico]);

  // Buscar favoritos do usuário
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;
      try {
        const userDocRef = doc(db, "users", userId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setFavorites(userData.favorites || []);
        } else {
          // Se o usuário não existir, cria documento com favoritos vazio
          await setDoc(userDocRef, { favorites: [] });
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [userId]);

  const call = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const sendEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  // Adicionar ou remover favorito
  const toggleFavorite = async (id) => {
    if (!userId) {
      alert("Você precisa estar logado para favoritar!");
      return;
    }

    const userDocRef = doc(db, "users", userId);
    let newFavorites;

    if (favorites.includes(id)) {
      newFavorites = favorites.filter((favId) => favId !== id);
    } else {
      newFavorites = [...favorites, id];
    }

    try {
      await updateDoc(userDocRef, { favorites: newFavorites });
      setFavorites(newFavorites);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tipoServico} disponíveis</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isFavorite = favorites.includes(item.id);
          return (
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.header}>{item.title}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <Text
                    style={[
                      styles.star,
                      isFavorite ? styles.starFilled : styles.starEmpty,
                    ]}
                  >
                    {isFavorite ? "★" : "☆"}
                  </Text>
                </TouchableOpacity>
              </View>
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
              </View>
            </View>
          );
        }}
      />
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: { fontWeight: "bold", fontSize: 16 },
  star: { fontSize: 24, marginLeft: 10 },
  starFilled: { color: "#FFD700" },
  starEmpty: { color: "#aaa" },
  buttons: { flexDirection: "row", marginTop: 5, gap: 10 },
  button: { padding: 6, backgroundColor: "#ddd", borderRadius: 4 },
});

