import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import settingsReducer from "./reducers/settings";
import notificationsReducer from "./reducers/notifications";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    notifications: notificationsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
