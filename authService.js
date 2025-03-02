import { admin } from "./firebaseConfig.js";

export const signUp = async (email, password) => {
  try {
    console.log(`📝 Tentative de création de compte pour : ${email}`);

    if (!email || !password) {
      console.error("❌ Erreur : Email et mot de passe requis !");
      throw new Error("Email et mot de passe requis");
    }

    const userRecord = await admin.auth().createUser({ email, password });

    console.log("✅ Utilisateur Firebase créé avec succès :", userRecord);
    return { uid: userRecord.uid, email: userRecord.email };
  } catch (error) {
    console.error("❌ Erreur d'inscription Firebase :", error);

    if (error.code) {
      console.error("📌 Code d'erreur Firebase :", error.code);
    }

    throw new Error(`Erreur Firebase : ${error.message}`);
  }
};
