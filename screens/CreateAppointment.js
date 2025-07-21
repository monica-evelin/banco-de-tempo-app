import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  TextInput,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

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
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />

      <Pressable onPress={() => setShowDatePicker(true)}>
        <Text style={styles.label}>📅 Data: {data.toLocaleDateString()}</Text>
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
        <Text style={styles.label}>
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

      {mensagem ? <Text style={styles.message}>{mensagem}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: { marginBottom: 20, borderBottomWidth: 1, padding: 5 },
  message: { marginTop: 20, color: "green" },
});
