import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  firstDay: number; // 0-6 (Monday-Sunday)
}

const initialState: SettingsState = {
  firstDay: 0,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<{ firstDay: number }>) => {
      state.firstDay = action.payload.firstDay;
    },
  },
});

export const { setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
