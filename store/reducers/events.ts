import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Event {
  id: string;
  type: string;
  title: string;
  dateStart: string;
  dateEnd: string;
  repeat: "daily" | "weekly" | "monthly" | "none";
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
    removeEvent: (state, action: PayloadAction<{ id: string }>) => {
      state.events = state.events.filter((e) => e.id !== action.payload.id);
    },
    updateEvent: (
      state,
      action: PayloadAction<{ id: string; updatedEvent: Partial<Event> }>
    ) => {
      const { id, updatedEvent } = action.payload;
      const eventIndex = state.events.findIndex((e) => e.id === id);

      if (eventIndex !== -1) {
        state.events[eventIndex] = {
          ...state.events[eventIndex],
          ...updatedEvent,
        };
      }
    },
  },
});

export const { setEvents, addEvent, removeEvent, updateEvent } =
  eventsSlice.actions;

export default eventsSlice.reducer;
