import { store } from "../store";
import { AxiosInstance } from "./auth";

const url = `${process.env.EXPO_PUBLIC_FIREBASE_DB_BASE_URL}/events.json`;

export async function getAllEvents() {
  const token = store.getState().auth.token;
  const response = await AxiosInstance.get(`${url}?auth=${token}`);

  const events = [];

  for (const key in response.data) {
    const eventObj = {
      id: key,
      type: "event",
      title: response.data[key].title,
      dateStart: new Date(response.data[key].dateStart),
      dateEnd: new Date(response.data[key].dateEnd),
      repeat: response.data[key].repeat,
      notifications: [...response.data[key].repeat],
      place: response.data[key].place,
      color: response.data[key].color,
      note: response.data[key].note,
    };
    events.push(eventObj);
  }

  return events;
}
