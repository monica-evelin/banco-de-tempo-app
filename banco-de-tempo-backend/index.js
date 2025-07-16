const { Timestamp } = require("firebase-admin").firestore;

app.post("/criar-compromisso", async (req, res) => {
  const { uid, titulo, data, horario } = req.body;
  try {
    // Supondo que data = '2025-07-15' e horario = '14:30'
    const datetime = new Date(`${data}T${horario}:00`); // ISO 8601 completo
    const timestamp = Timestamp.fromDate(datetime);

    await db.collection("usuarios").doc(uid).collection("compromissos").add({
      titulo,
      datetime: timestamp,
    });
    res.status(200).send({ mensagem: "Compromisso criado!" });
  } catch (error) {
    res.status(500).send({ erro: error.message });
  }
});
