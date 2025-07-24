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
      <Text style={styles.login_label}>Serviço: {item.skill}</Text>
      <Text style={styles.login_label}>Endereço: {item.address}</Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 8,
        }}
      >
        {/* Telefone */}
        <TouchableOpacity
          onPress={() =>
            item.phone
              ? Linking.openURL(`tel:${item.phone}`)
              : Alert.alert("Erro", "Número de telefone não disponível.")
          }
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Icon name="phone" size={24} color="#4CAF50" />
          <Text
            style={[
              styles.login_label,
              {
                marginLeft: 6,
                color: "black",
                textAlign: "center",
                maxWidth: 150,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.phone || "Não disponível"}
          </Text>
        </TouchableOpacity>

        {/* Espaço entre ícones */}
        <View style={{ width: 20 }} />

        {/* Email */}
        <TouchableOpacity
          onPress={() =>
            item.email
              ? Linking.openURL(`mailto:${item.email}`)
              : Alert.alert("Erro", "Email não disponível.")
          }
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Icon name="email-outline" size={24} color="#4CAF50" />
          <Text
            style={[
              styles.login_label,
              {
                marginLeft: 6,
                color: "black",
                textAlign: "center",
                maxWidth: 150,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.email || "Não disponível"}
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
