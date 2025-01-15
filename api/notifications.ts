import { store } from "../store";
import { Notification } from "../store/reducers/notifications";
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
      date: response.data[key].notification.date,
      repeat: response.data[key].notification.repeat,
      imageUri: response.data[key].notification.imageUri,
    };
    notifications.push(notificationObj);
  }

  return notifications;
}

export async function createNotification(
  notification: Partial<Notification>
): Promise<Notification> {
  const token = store.getState().auth.token;
  const response = await AxiosInstance.post(`${url}?auth=${token}`, {
    notification,
  });
  const res = {
    id: response.data.name,
    type: "notification",
    ...notification,
  };
  // @ts-ignore
  return res;
}

export async function deleteNotification(id: string): Promise<Notification> {
  const token = store.getState().auth.token;
  const response = await AxiosInstance.delete(
    `${process.env.EXPO_PUBLIC_FIREBASE_DB_BASE_URL}/notifications/${id}.json?auth=${token}`
  );
  return response.data;
}

export async function updateNotificationData(
  id: string,
  notification: Partial<Notification>
): Promise<Notification> {
  const token = store.getState().auth.token;
  const response = await AxiosInstance.put(
    `${process.env.EXPO_PUBLIC_FIREBASE_DB_BASE_URL}/notifications/${id}.json?auth=${token}`,
    { notification }
  );
  return response.data;
}
