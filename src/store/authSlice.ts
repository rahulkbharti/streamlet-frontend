import { createSlice } from "@reduxjs/toolkit";

export type LoginData = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  username: string;
  email: string;
  name: string;
  exp: number; // Expiration time in milliseconds since epoch
};

export type AuthState = {
  loginData: LoginData | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  loginData: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.loginData = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.loginData = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
