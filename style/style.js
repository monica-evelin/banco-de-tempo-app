import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Usado no ScrollView
  scroll_container: {
    padding: 24,
    paddingTop: 60, // empurra o conteúdo para baixo
    paddingBottom: 80, // deixa espaço para o botão Sign Up não ficar colado no final
  },

  login_container: {
    flex: 1,
    backgroundColor: "rgba(2, 3, 129, 1)", // ou 40,116, 252, 1 // opcional: fundo escuro
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
    marginBottom: 30,
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
    width: 300, // 👈 você pode ajustar conforme necessário
    height: 300, // 👈 idem aqui
    marginBottom: 10,
  },

  footerText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default styles;
