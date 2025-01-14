import { store } from "../store";
import { AxiosInstance } from "./auth";

const url = `${process.env.EXPO_PUBLIC_FIREBASE_DB_BASE_URL}/notifications.json`;

export async function getAllNotifications() {
  const token = store.getState().auth.token;
  const response = await AxiosInstance.get(`${url}?auth=${token}`);

  const notifications = [];

  for (const key in response.data) {
    const notificationObj = {
      id: key,
      type: "notification",
      text: response.data[key].notification.text,
      date: new Date(response.data[key].notification.date),
      repeat: response.data[key].notification.repeat,
    };
    notifications.push(notificationObj);
  }

  return notifications;
}
