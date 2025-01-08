import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { store } from "../store";
import { SettingsState } from "./../store/reducers/settings";

const url = `${process.env.EXPO_PUBLIC_FIREBASE_DB_BASE_URL}/settings.json`;

export async function getAllSettings() {
  const token =
    store.getState().auth.token || (await AsyncStorage.getItem("token"));
  const response = await axios.get(`${url}?auth=${token}`);
  return response.data;
}

export async function updateSettings(settings: SettingsState) {
  const token =
    store.getState().auth.token || (await AsyncStorage.getItem("token"));
  const response = await axios.put(`${url}?auth=${token}`, settings);
  return response.data;
}
