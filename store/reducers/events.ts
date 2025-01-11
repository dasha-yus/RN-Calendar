import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Event {
  id: string;
  type: string;
  title: string;
  dateStart: string;
  dateEnd: string;
  repeat: "daily" | "weekly" | "monthly";
  color: string;
  note: string;
  notifications: number[];
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  imageUri: string;
}

export interface EventsState {
  events: Event[];
}

const initialState: EventsState = {
  events: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<{ events: Event[] }>) => {
      state.events = action.payload.events;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events = [...state.events, action.payload];
    },
  },
});

export const { setEvents, addEvent } = eventsSlice.actions;

export default eventsSlice.reducer;
