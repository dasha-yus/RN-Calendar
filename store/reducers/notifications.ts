import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  type: string;
  text: string;
  date: Date;
  repeat: "daily" | "weekly" | "monthly" | "none";
  imageUri: string;
}

export interface NotificationsState {
  notifications: Notification[];
}

const initialState: NotificationsState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (
      state,
      action: PayloadAction<{ notifications: Notification[] }>
    ) => {
      state.notifications = action.payload.notifications;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications = [...state.notifications, action.payload];
    },
    removeNotification: (state, action: PayloadAction<{ id: string }>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload.id
      );
    },
    updateNotification: (
      state,
      action: PayloadAction<{
        id: string;
        updatedNotification: Partial<Notification>;
      }>
    ) => {
      const { id, updatedNotification } = action.payload;
      const notificationIndex = state.notifications.findIndex(
        (n) => n.id === id
      );

      if (notificationIndex !== -1) {
        state.notifications[notificationIndex] = {
          ...state.notifications[notificationIndex],
          ...updatedNotification,
        };
      }
    },
  },
});

export const {
  setNotifications,
  addNotification,
  removeNotification,
  updateNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
