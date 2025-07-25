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

//Adicionado o componente de fundo com imagem geométrica

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
          alignItems: "center",
          justifyContent: "center",
          marginTop: 0,
        }}
      >
        {/* Telefone */}
        <TouchableOpacity
          onPress={() =>
            item.phone
              ? Linking.openURL(`tel:${item.phone}`)
              : Alert.alert("Erro", "Phone number not available.")
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
            {item.phone || "Not available"}
          </Text>
        </TouchableOpacity>

        {/* Espaço entre ícones */}
        <View style={{ width: 20 }} />

        {/* Email */}
        <TouchableOpacity
          onPress={() =>
            item.email
              ? Linking.openURL(`mailto:${item.email}`)
              : Alert.alert("Erro", "Email not available.")
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
            {item.email || "Not available"}
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
    //  Envolvendo tudo com o fundo geométrico
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          // Cabeçalho com os inputs separado do FlatList

          ListHeaderComponent={
            <View style={styles.scroll_container}>
              {/*  Título traduzido */}

              <Text style={styles.header}>Search for service offers</Text>

              {/*  Labels traduzidas */}

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
          contentContainerStyle={
            {
              /*paddingBottom: 40*/
            }
          }
          style={{ marginTop: 20 }}
        />
      </SafeAreaView>
    </Background>
  );
}
