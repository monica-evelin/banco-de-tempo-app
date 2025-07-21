import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const BACKGROUND_IMAGE = require("../assets/images/fundo.png");

export default function DetailsScreen({ route }) {
  const { tipo } = route.params || {};
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
    if (!tipo) return;

    // Busca todos os compromissos e filtra localmente pelo tipo ignorando case
    const q = query(collection(db, "compromissos"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.tipo?.toLowerCase() === tipo.toLowerCase());

      setContatos(dados);
    });

    return () => unsubscribe();
  }, [tipo]);

  const contactOptions = (contato) => {
    const options = [];
    if (contato.email) {
      options.push({
        text: "Send Email",
        onPress: () => Linking.openURL(`mailto:${contato.email}`),
      });
    }
    if (contato.telemovel) {
      options.push({
        text: "Call",
        onPress: () => Linking.openURL(`tel:${contato.telemovel}`),
      });
    }
    options.push({ text: "Cancel", style: "cancel" });
    Alert.alert("Contact Options", "Choose an option:", options, {
      cancelable: true,
    });
  };

  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Contatos para "{tipo}"</Text>

          {contatos.length === 0 ? (
            <Text style={styles.noContacts}>
              Nenhum contato encontrado para este tipo.
            </Text>
          ) : (
            contatos.map((contato) => (
              <View key={contato.id} style={styles.card}>
                <View style={styles.row}>
                  <Icon name="account" size={24} color="#4CAF50" />
                  <Text style={styles.text}>{contato.title || "Sem nome"}</Text>
                </View>
                <View style={styles.row}>
                  <Icon name="email-outline" size={24} color="#4CAF50" />
                  <Text style={styles.text}>
                    {contato.email || "Sem email"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Icon name="phone" size={24} color="#4CAF50" />
                  <Text style={styles.text}>
                    {contato.telemovel || "Sem telefone"}
                  </Text>
                </View>

                {(contato.email || contato.telemovel) && (
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => contactOptions(contato)}
                  >
                    <Icon name="contacts" size={20} color="#fff" />
                    <Text style={styles.contactButtonText}>Contactar</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    paddingVertical: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  noContacts: {
    fontSize: 18,
    color: "#ccc",
    textAlign: "center",
    marginTop: 50,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  contactButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
});
