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
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ServiceProvidersScreen() {
  const route = useRoute();
  const { tipoServico } = route.params;

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const ref = collection(db, "compromissos");
        const q = query(ref, where("tipo", "==", tipoServico));
        const snapshot = await getDocs(q);

        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(list);
      } catch (error) {
        console.error("Error fetching appointments:", error);
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
      <Text style={styles.title}>{tipoServico} available</Text>
      <FlatList
        data={appointments}
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
                <Text>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sendEmail(item.email)}
                style={styles.button}
              >
                <Text>Email</Text>
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
  header: { fontWeight: "bold" },
  buttons: { flexDirection: "row", marginTop: 5, gap: 10 },
  button: { padding: 6, backgroundColor: "#ddd", borderRadius: 4 },
});
