import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { colors } from "../../components/pickers/ColorPicker";

export interface SettingsState {
  firstDay: number; // 0-6 (Monday-Sunday)
  notificationsDefaultColor: string;
}

const initialState: SettingsState = {
  firstDay: 0,
  notificationsDefaultColor: colors[colors.length - 2],
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (
      state,
      action: PayloadAction<{
        firstDay: number;
        notificationsDefaultColor: string;
      }>
    ) => {
      state.firstDay = action.payload.firstDay;
      state.notificationsDefaultColor = action.payload.notificationsDefaultColor;
    },
  },
});

export const { setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
