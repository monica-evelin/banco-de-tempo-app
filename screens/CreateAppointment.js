import React, { useState } from "react";
import { View, Button, Text, Platform, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth } from "../firebaseConfig";

export default function CriarCompromisso({ route }) {
  const { uid } = route.params;

  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShowDatePicker(Platform.OS === "ios");
    setData(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || data;
    setShowTimePicker(Platform.OS === "ios");
    setData(
      new Date(data.setHours(currentTime.getHours(), currentTime.getMinutes()))
    );
  };

  const criarCompromisso = async () => {
    try {
      const resposta = await fetch(
        "http://192.168.0.100:3001/criar-compromisso",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, titulo, datetime: data }),
        }
      );

      const json = await resposta.json();
      setMensagem(json.mensagem || "Compromisso criado!");
    } catch (error) {
      setMensagem("Erro ao criar compromisso: " + error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Título</Text>
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={{ marginBottom: 20, borderBottomWidth: 1, padding: 5 }}
      />

      <Pressable onPress={() => setShowDatePicker(true)}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          📅 Data: {data.toLocaleDateString()}
        </Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={data}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <Pressable onPress={() => setShowTimePicker(true)}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          ⏰ Hora:{" "}
          {data.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </Pressable>

      {showTimePicker && (
        <DateTimePicker
          value={data}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}

      <Button title="Criar Compromisso" onPress={criarCompromisso} />
      <Text style={{ marginTop: 20, color: "green" }}>{mensagem}</Text>
    </View>
  );
}
