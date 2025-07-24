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
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

export default function ServiceProvidersScreen() {
  const route = useRoute();
  const { tipoServico } = route.params;

  const [appointments, setAppointments] = useState([]);

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

  const call = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const sendEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tipoServico} disponíveis</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.header}>Nome: {item.fullName}</Text>
            <Text>Serviço: {item.title}</Text>
            <Text>Descrição: {item.descricao}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Telemóvel: {item.telemovel}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                onPress={() => call(item.telemovel)}
                style={styles.button}
              >
                <Text>📞 Ligar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sendEmail(item.email)}
                style={styles.button}
              >
                <Text>✉️ Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  header: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  buttons: { flexDirection: "row", marginTop: 5, gap: 10 },
  button: {
    padding: 6,
    backgroundColor: "#ddd",
    borderRadius: 4,
  },
});
