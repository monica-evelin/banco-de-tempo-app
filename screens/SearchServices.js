import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  FlatList,
  View,
  ActivityIndicator,
} from "react-native";
import styles from "../style/style";

// Firebase Modular (v9+)
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function SearchServices() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchAddress, setSearchAddress] = useState("");
  const [searchSkill, setSearchSkill] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const addressMatch = user.address?.toLowerCase().includes(searchAddress.toLowerCase());
      const skillMatch = user.skill?.toLowerCase().includes(searchSkill.toLowerCase());
      return addressMatch && skillMatch;
    });

    setFilteredUsers(filtered);
  }, [searchAddress, searchSkill, users]);

  const renderItem = ({ item }) => (
    <View style={[styles.card, { marginVertical: 10, padding: 12 }]}>
      <Text style={styles.cardTitle}>{item.fullName}</Text>
      <Text style={styles.login_label}>Serviço: {item.skill}</Text>
      <Text style={styles.login_label}>Endereço: {item.address}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.login_container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.login_container}>
      <View style={styles.scroll_container}>
        <Text style={styles.header}>Pesquisar ofertas de serviço</Text>

        <Text style={styles.login_label}>Endereço</Text>
        <TextInput
          style={styles.login_input}
          placeholder="Ex: Leiria, Lisboa"
          value={searchAddress}
          onChangeText={setSearchAddress}
        />

        <Text style={styles.login_label}>Serviço</Text>
        <TextInput
          style={styles.login_input}
          placeholder="Ex: Cooking, PetSitting"
          value={searchSkill}
          onChangeText={setSearchSkill}
        />

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
              Nenhum utilizador encontrado.
            </Text>
          }
          style={{ marginTop: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}
