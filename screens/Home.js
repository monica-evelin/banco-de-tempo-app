import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import styles from "../style/style";
import * as Calendar from "expo-calendar";

// firestore imports
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

// imagem de fundo
const BACKGROUND_IMAGE = require("../assets/images/fundo.png");

// Mensagens carinhosas aleatórias sobre o tempo
const mensagensCarinhosas = [
  "Que seu dia seja tão radiante quanto o sol!",
  "Aproveite cada momento com amor e alegria.",
  "Um abraço quentinho para você neste dia lindo!",
  "Que o vento leve embora suas preocupações hoje.",
  "Sorria, você está criando memórias maravilhosas.",
];

function getImageByTipo(tipo) {
  if (!tipo) return require("../assets/images/default.png");

  switch (tipo.toLowerCase()) {
    case "tutoring":
      return require("../assets/images/tutoring.png");
    case "cooking":
      return require("../assets/images/cooking.png");
    case "babysitting":
      return require("../assets/images/babysitting.png");
    case "pet sitting":
      return require("../assets/images/pet_sitting.png");
    case "housecleaning":
      return require("../assets/images/housecleaning.png");
    case "gardening":
      return require("../assets/images/gardening.png");
    case "computer help":
      return require("../assets/images/computer_help.png");
    case "elderly care":
      return require("../assets/images/elderly_care.png");
    default:
      return require("../assets/images/default.png");
  }
}

// Solicita permissão para acessar o calendário
async function getCalendarPermissions() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permissão para acessar calendário negada!");
    return false;
  }
  return true;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [compromissos, setCompromissos] = useState([]);
  const uid = auth.currentUser?.uid;

  // Mensagem carinhosa aleatória para exibir
  const [mensagemCarinhosa, setMensagemCarinhosa] = useState("");

  useEffect(() => {
    // Sorteia a mensagem carinhosa na montagem do componente
    const index = Math.floor(Math.random() * mensagensCarinhosas.length);
    setMensagemCarinhosa(mensagensCarinhosas[index]);
  }, []);

  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "compromissos"),
      // where("uid", "==", uid), // Se quiser filtrar pelo usuário, ativa aqui
      orderBy("datetime", "asc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const dados = snap.docs.map((doc) => {
        const c = doc.data();
        const dateObj = c.datetime?.toDate
          ? c.datetime.toDate()
          : new Date(c.datetime);

        return {
          id: doc.id,
          title: c.title,
          descricao: c.descricao,
          tipo: c.tipo,
          email: c.email,
          telemovel: c.telemovel,
          dateObj,
        };
      });

      setCompromissos(dados);
    });

    return unsubscribe;
  }, [uid]);

  const addToCalendar = async (c) => {
    const hasPermission = await getCalendarPermissions();
    if (!hasPermission) return;

    let defaultCalendarId;

    if (Platform.OS === "ios") {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      defaultCalendarId = calendars.find((cal) => cal.allowsModifications)?.id;
    } else {
      defaultCalendarId = await Calendar.getDefaultCalendarAsync().then(
        (cal) => cal?.id
      );
      if (!defaultCalendarId) {
        defaultCalendarId = await Calendar.createCalendarAsync({
          title: "Banco de Tempo",
          color: "blue",
          entityType: Calendar.EntityTypes.EVENT,
          sourceId: undefined,
          source: { isLocalAccount: true, name: "Banco de Tempo" },
          name: "Banco de Tempo",
          ownerAccount: "personal",
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
      }
    }

    try {
      await Calendar.createEventAsync(defaultCalendarId, {
        title: c.title,
        startDate: c.dateObj.toISOString(),
        endDate: new Date(c.dateObj.getTime() + 60 * 60 * 1000).toISOString(), // +1 hora
        notes: c.descricao,
        timeZone: "GMT",
      });
      Alert.alert("Evento criado no calendário!");
    } catch (error) {
      Alert.alert("Erro ao criar evento no calendário: " + error.message);
    }
  };

  const renderCompromisso = (c) => {
    const data = c.dateObj.toLocaleDateString();
    const hora = c.dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        key={c.id}
        style={[
          styles.card,
          {
            padding: 20,
            marginVertical: 16,
            width: "95%",
            alignSelf: "center",
          },
        ]}
      >
        <Image
          source={getImageByTipo(c.tipo)}
          style={[styles.image, { height: 200, borderRadius: 10 }]}
        />
        <Text
          style={[
            styles.cardTitle,
            { fontSize: 22, textAlign: "center", marginVertical: 10 },
          ]}
        >
          {c.title}
        </Text>
        <Text style={[styles.date, { fontSize: 16 }]}>{`${data} ${hora}`}</Text>
        <Text
          style={[
            styles.eventDescription,
            { marginVertical: 10, textAlign: "center" },
          ]}
          numberOfLines={2}
        >
          {c.descricao || "Sem descrição"}
        </Text>

        {/* Botão Entrar em contato */}
        {(c.email || c.telemovel) && (
          <TouchableOpacity
            style={styles.login_button}
            onPress={() => {
              let contato = "";
              if (c.email) contato += `Email: ${c.email}\n`;
              if (c.telemovel) contato += `Telemóvel: ${c.telemovel}\n`;

              Alert.alert(
                "Contato",
                contato,
                [
                  {
                    text: "Fechar",
                    style: "cancel",
                  },
                ],
                { cancelable: true }
              );
            }}
          >
            <Text style={styles.login_buttonText}>Entrar em contato</Text>
          </TouchableOpacity>
        )}

        {/* Botão Adicionar ao calendário */}
        <TouchableOpacity
          style={[styles.login_button, { marginTop: 10 }]}
          onPress={() => addToCalendar(c)}
        >
          <Text style={styles.login_buttonText}>Adicionar ao calendário</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const sair = async () => {
    try {
      await auth.signOut();
      navigation.replace("Login");
    } catch (e) {
      Alert.alert("Erro ao sair", e.message);
    }
  };

  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
        >
          {/* Mensagem carinhosa */}
          <Text
            style={{
              fontSize: 18,
              color: "#fff",
              marginTop: 30,
              fontStyle: "italic",
              textAlign: "center",
              paddingHorizontal: 20,
            }}
          >
            {mensagemCarinhosa}
          </Text>

          {compromissos.length === 0 && (
            <Text style={{ color: "#ccc", textAlign: "center", marginTop: 50 }}>
              Nenhum compromisso agendado.
            </Text>
          )}

          {compromissos.map(renderCompromisso)}

          <TouchableOpacity
            style={[
              styles.logout_button,
              { backgroundColor: "#2196F3", marginTop: 20, width: "95%" },
            ]}
            onPress={sair}
          >
            <Text style={styles.login_buttonText}>Sair</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
