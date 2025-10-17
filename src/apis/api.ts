import axios from "axios";
import store from "../store/store";
import { logout, login, type LoginData } from "../store/authSlice";
// import { showNotification } from "../utils/notification";
// import { AxiosRequestConfig } from "axios";

// --- Configuration ---
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔁 Axios Request Interceptor
api.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (req: any & { _retry?: boolean }) => {
    const userData: LoginData | null = store.getState().auth.loginData ?? null;

    // console.log(userData);

    if (userData === null) return req;

    try {
      const currentTime = Date.now();
      const isExpired = userData.exp && currentTime > userData.exp;

      if (isExpired && !req._retry) {
        req._retry = true;
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken: userData.refreshToken,
        });
        console.log("Refresh token response status:", response.status);
        if (response.status !== 200) {
          store.dispatch(logout());
          return Promise.reject("Unable to refresh token, logging out.");
        }
        const refreshData = response.data as { accessToken: string };
        console.log("Response from refresh endpoint:", refreshData.accessToken);
        const refreshed = { ...userData };
        refreshed.accessToken = refreshData.accessToken;
        refreshed.exp = Date.now() + 15 * 60 * 1000;
        console.log("Storing refreshed token:", refreshed);
        store.dispatch(login(refreshed));

        req.headers["Authorization"] = `Bearer ${refreshed.accessToken}`;
      }
      req.headers["Authorization"] = `Bearer ${userData.accessToken}`;
      return req;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return req;
    }
  },
  (error) => Promise.reject(error)
);

export default api;
