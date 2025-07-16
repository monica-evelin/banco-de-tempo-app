import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scroll_container: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 80,
  },

  login_container: {
    flex: 1,
    backgroundColor: "rgba(2, 3, 129, 1)",
  },

  login_input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },

  login_label: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 4,
  },

  login_button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 5,
  },

  login_buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  login_link: {
    color: "#4CAF50",
    marginTop: 10,
    textAlign: "center",
  },

  footerContainer: {
    marginTop: 30,
    alignItems: "center",
  },

  footerImage: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },

  footerText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  // ---- estilos para a HomeScreen ----

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // fundo escuro translúcido
    paddingTop: 20,
  },

  header: {
    color: "white",
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    marginVertical: 10,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardTextContainer: {
    padding: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#ccc",
  },

  image: {
    width: "100%",
    resizeMode: "cover",
  },

  cardTitle: {
    fontWeight: "bold",
    color: "#333",
  },

  date: {
    color: "#666",
    textAlign: "center",
  },

  eventDescription: {
    color: "#444",
  },
  login_buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  link: {
    color: "#2196F3",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },

  logout_button: {
    backgroundColor: "#e53935",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default styles;
