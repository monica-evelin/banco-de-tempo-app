import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { Calendar } from "react-native-calendars";

export default function HomeScreen({ navigation }) {
  const mensagens = [
    "Você é incrível!",
    "Seu tempo vale ouro!",
    "Hoje vai ser um ótimo dia!",
    "Continue assim, você está indo muito bem!",
  ];

  const [mensagemAleatoria, setMensagemAleatoria] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * mensagens.length);
    setMensagemAleatoria(mensagens[randomIndex]);
  }, []);

  const sair = async () => {
    try {
      await firebase.auth().signOut();
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Erro ao sair", error.message);
    }
  };

  const uid = firebase.auth().currentUser?.uid;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        {mensagemAleatoria}
      </Text>

      <Calendar
        onDayPress={(day) => {
          console.log("Dia selecionado", day);
          navigation.navigate("CriarCompromisso", {
            uid,
            dataSelecionada: day.dateString,
          });
        }}
        markedDates={{
          "2025-07-11": {
            selected: true,
            marked: true,
            selectedColor: "blue",
          },
        }}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Sair" onPress={sair} />
      </View>
    </View>
  );
}
