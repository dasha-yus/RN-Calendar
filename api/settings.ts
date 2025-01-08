import axios from "axios";

import { store } from "../store";
import { SettingsState } from "./../store/reducers/settings";

const token = store.getState().auth.token;
const url = `${process.env.EXPO_PUBLIC_FIREBASE_DB_BASE_URL}/settings.json?key=${process.env.EXPO_PUBLIC_FIREBASE_API_KEY}&auth=${token}`;

export async function getAllSettings() {
  const response = await axios.get(url);
  return response.data;
}

export async function updateSettings(settings: SettingsState) {
  const response = await axios.put(url, settings);
  return response.data;
}
