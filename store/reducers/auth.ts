import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { invokeRefreshToken } from "../../api/auth";

export interface AuthState {
  token: string;
  refreshToken: string;
  expiresIn: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: "",
  refreshToken: "",
  expiresIn: "",
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        expiresIn: string;
      }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.expiresIn = action.payload.expiresIn;
      state.isAuthenticated = true;

      AsyncStorage.setItem("token", action.payload.token);
      AsyncStorage.setItem("refreshToken", action.payload.refreshToken);
      AsyncStorage.setItem("expiresIn", action.payload.expiresIn);
    },
    logout: (state) => {
      state.token = "";
      state.refreshToken = "";
      state.expiresIn = "";
      state.isAuthenticated = false;

      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("refreshToken");
      AsyncStorage.removeItem("expiresIn");
    },
  },
});

export const { authenticate, logout } = authSlice.actions;

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (newToken: string, { dispatch }) => {
    try {
      const { token, refreshToken, expiresIn } = await invokeRefreshToken(
        newToken
      );
      dispatch(authenticate({ token, refreshToken, expiresIn }));
    } catch (error) {
      dispatch(logout());
    }
  }
);

export default authSlice.reducer;
