import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { auth } from "../firebaseConfig";

export default function CriarCompromisso({ route }) {
  const { uid } = route.params;

  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [mensagem, setMensagem] = useState("");

  const criarCompromisso = async () => {
    try {
      const resposta = await fetch(
        "http://192.168.0.100:3001/criar-compromisso",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, titulo, data, horario }),
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
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={{ marginBottom: 10, borderBottomWidth: 1, padding: 5 }}
      />
      <TextInput
        placeholder="Data"
        value={data}
        onChangeText={setData}
        style={{ marginBottom: 10, borderBottomWidth: 1, padding: 5 }}
      />
      <TextInput
        placeholder="Horário"
        value={horario}
        onChangeText={setHorario}
        style={{ marginBottom: 10, borderBottomWidth: 1, padding: 5 }}
      />
      <Button title="Criar Compromisso" onPress={criarCompromisso} />
      <Text style={{ marginTop: 10 }}>{mensagem}</Text>
    </View>
  );
}
