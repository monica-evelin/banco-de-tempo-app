import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import styles from "../style/style";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Firebase Modular (v9+)
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Componente de fundo com imagem geométrica
import Background from "../components/Background";

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
    const filtered = users
      .filter((user) => {
        const addressMatch = user.address
          ?.toLowerCase()
          .includes(searchAddress.toLowerCase());
        const skillMatch = user.skill
          ?.toLowerCase()
          .includes(searchSkill.toLowerCase());
        return addressMatch && skillMatch;
      })
      .sort((a, b) => {
        if (!a.fullName) return 1;
        if (!b.fullName) return -1;
        return a.fullName.localeCompare(b.fullName);
      });

    setFilteredUsers(filtered);
  }, [searchAddress, searchSkill, users]);

const renderItem = ({ item }) => (
  <View style={[styles.card, { marginVertical: 10, padding: 12 }]}>
    <Text style={styles.cardTitle}>{item.fullName}</Text>
    <Text style={styles.login_label}>Service: {item.skill}</Text>
    <Text style={styles.login_label}>Address: {item.address}</Text>

    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 0,
      }}
    >
      {/* Botão Call */}
      <TouchableOpacity
        onPress={() =>
          item.phone
            ? Linking.openURL(`tel:${item.phone}`)
            : Alert.alert("Erro", "Phone number not available.")
        }
        style={{
          backgroundColor: "#4CAF50",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 6,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon name="phone" size={20} color="white" />
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            marginLeft: 6,
          }}
        >
          Call
        </Text>
      </TouchableOpacity>

      {/* Espaço entre os botões (gap de 2) */}
      <View style={{ width: 4 }} />

      {/* Botão Email */}
      <TouchableOpacity
        onPress={() =>
          item.email
            ? Linking.openURL(`mailto:${item.email}`)
            : Alert.alert("Erro", "Email not available.")
        }
        style={{
          backgroundColor: "#4CAF50",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 6,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon name="email-outline" size={20} color="white" />
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            marginLeft: 6,
          }}
        >
          Email
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);



  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.login_container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={
            <View style={styles.scroll_container}>
              <Text style={styles.header}>Search for service offers</Text>

              <Text style={styles.login_label}>Address</Text>
              <TextInput
                style={styles.login_input}
                placeholder="e.g. Leiria, Lisbon"
                value={searchAddress}
                onChangeText={setSearchAddress}
              />

              <Text style={styles.login_label}>Service</Text>
              <TextInput
                style={styles.login_input}
                placeholder="e.g. Cooking, PetSitting"
                value={searchSkill}
                onChangeText={setSearchSkill}
              />
            </View>
          }
          ListEmptyComponent={
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 10 }}>
              No users found.
            </Text>
          }
          style={{ marginTop: 20 }}
        />
      </SafeAreaView>
    </Background>
  );
}
