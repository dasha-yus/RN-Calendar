import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import settingsReducer from "./reducers/settings";
import notificationsReducer from "./reducers/notifications";
import eventsReducer from "./reducers/events";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    notifications: notificationsReducer,
    events: eventsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
