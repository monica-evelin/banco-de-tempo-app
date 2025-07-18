import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const FOOTER_IMAGE = require("../assets/Conversation.png");

export default function DetailsScreen({ route }) {
  const { compromisso } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{compromisso.title}</Text>

        <View style={styles.row}>
          <Icon name="text-box-outline" size={24} color="#4CAF50" />
          <Text style={styles.text}>
            {compromisso.descricao || "Sem descrição"}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="tag-outline" size={24} color="#4CAF50" />
          <Text style={styles.text}>
            Type: {compromisso.tipo || "Não informado"}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="email-outline" size={24} color="#4CAF50" />
          <Text style={styles.text}>
            Email: {compromisso.email || "Não informado"}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="phone-outline" size={24} color="#4CAF50" />
          <Text style={styles.text}>
            Phone: {compromisso.telemovel || "Não informado"}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="calendar-clock" size={24} color="#4CAF50" />
          <Text style={styles.text}>
            Date and Time: {compromisso.dateObj.toLocaleDateString()} às{" "}
            {compromisso.dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Image
          source={FOOTER_IMAGE}
          style={styles.footerImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(2, 3, 129, 1)",
  },
  content: {
    padding: 20,
    paddingBottom: 120, // espaço para footer
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    fontFamily: "Cochin", // uma fonte bonita, mude conforme disponível
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  text: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 12,
    fontFamily: "Georgia", // fonte elegante para texto
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerImage: {
    width: 550,
    height: 450,
    //opacity: 0.7,
  },
});
