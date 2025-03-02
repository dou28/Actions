import { google } from "googleapis";
import { promises as fs } from "fs";
import { db } from "./firebaseConfig.js";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const SERVICE_ACCOUNT_FILE = "./serviceAccountKey.json";

async function authorize() {
  const credentials = JSON.parse(await fs.readFile(SERVICE_ACCOUNT_FILE));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
  return auth;
}

// Création d'une copie privée de la feuille Google Sheets
export async function createPersonalSheet(userId) {
  const auth = await authorize();
  const sheets = google.sheets({ version: "v4", auth });
  const originalSheetId = "12fVaHt0VWqQXnN4hEcaHbV7BiCxcTFyPvj6wR_KZga4";

  try {
    const response = await sheets.spreadsheets.copy({
      spreadsheetId: originalSheetId,
      requestBody: {},
    });

    const newSheetId = response.data.spreadsheetId;
    await db.collection("users").doc(userId).set({ sheetId: newSheetId }, { merge: true });
    return newSheetId;
  } catch (error) {
    console.error("Erreur lors de la création de la copie de la feuille:", error);
    throw error;
  }
}

