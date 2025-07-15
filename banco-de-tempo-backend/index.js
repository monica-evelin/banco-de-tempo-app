// index.js
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/criar-compromisso", async (req, res) => {
  const { uid, titulo, data, horario } = req.body;
  try {
    await db
      .collection("usuarios")
      .doc(uid)
      .collection("compromissos")
      .add({ titulo, data, horario });
    res.status(200).send({ mensagem: "Compromisso criado!" });
  } catch (error) {
    res.status(500).send({ erro: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
