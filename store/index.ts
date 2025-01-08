import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import settingsReducer from "./reducers/settings";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
