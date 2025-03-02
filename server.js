import express from "express";
import cors from "cors";
import { signUp } from "./authService.js";  // ✅ Assure-toi que ce fichier existe et contient bien la fonction signUp
import { createPersonalSheet } from "./googleSheetsService.js";

const app = express();
app.use(cors());
app.use(express.json()); // ✅ Permet de lire les requêtes JSON

// ✅ Ajout d'un log pour voir les requêtes entrantes
app.use((req, res, next) => {
  console.log(`🔥 Requête reçue : ${req.method} ${req.url}`, req.body);
  next();
});

// Route d'inscription
app.post("/signup", async (req, res) => {
  console.log("🔥 Requête reçue :", req.body);

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("❌ Erreur : Email et mot de passe manquants !");
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    console.log("📤 Tentative de création de l'utilisateur Firebase...");
    const user = await signUp(email, password);
    console.log("✅ Utilisateur Firebase créé :", user); // Ce log DOIT apparaître

    console.log("📄 Création de la feuille Google Sheets...");
    const sheetId = await createPersonalSheet(user.uid);
    console.log("✅ Feuille Google Sheets créée :", sheetId);

    return res.status(200).json({ user, sheetId });
  } catch (error) {
    console.error("❌ Erreur dans /signup :", error);
    return res.status(500).json({ error: error.message });
  }
});







// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
