import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Event {
  id: string;
  type: string;
  title: string;
  dateStart: Date;
  dateEnd: Date;
  repeat: "daily" | "weekly" | "monthly";
  color: string;
  description: string;
  notifications: number[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
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
  },
});

export const { setEvents } = eventsSlice.actions;

export default eventsSlice.reducer;
