import { store } from "../store";
import { SettingsState } from "./../store/reducers/settings";
import { AxiosInstance } from "./auth";

const url = `${process.env.EXPO_PUBLIC_FIREBASE_DB_BASE_URL}/settings.json`;

export async function getAllSettings() {
  const token = store.getState().auth.token;
  const response = await AxiosInstance.get(`${url}?auth=${token}`);
  return response.data;
}

export async function updateSettings(settings: SettingsState) {
  const token = store.getState().auth.token;
  const response = await AxiosInstance.put(`${url}?auth=${token}`, settings);
  return response.data;
}
