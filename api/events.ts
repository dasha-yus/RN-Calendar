import { store } from "../store";
import { Event } from "../store/reducers/events";
import { AxiosInstance } from "./auth";

const url = `${process.env.EXPO_PUBLIC_FIREBASE_DB_BASE_URL}/events.json`;

export async function getAllEvents(): Promise<Event[]> {
  const token = store.getState().auth.token;
  const response = await AxiosInstance.get(`${url}?auth=${token}`);

  const events = [];

  for (const key in response.data) {
    const eventObj = {
      id: key,
      type: "event",
      title: response.data[key].event.title,
      dateStart: response.data[key].event.dateStart,
      dateEnd: response.data[key].event.dateEnd,
      // repeat: response.data[key].event.repeat,
      // notifications: [...response.data[key].event.repeat],
      imageUri: response.data[key].event.imageUri,
      location: response.data[key].event.location,
      color: response.data[key].event.color,
      note: response.data[key].event.note,
    };
    events.push(eventObj);
  }

  // @ts-ignore
  return events;
}

export async function createEvent(event: Partial<Event>): Promise<Event> {
  const token = store.getState().auth.token;
  const response = await AxiosInstance.post(`${url}?auth=${token}`, { event });
  const res = {
    id: response.data.name,
    type: "event",
    ...event,
  };
  // @ts-ignore
  return res;
}
