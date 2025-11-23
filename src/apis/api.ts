import axios, { AxiosError, AxiosResponse } from "axios";
import store from "../store/store";
import { logout, login, type LoginData } from "../store/authSlice";
import toast from "react-hot-toast";
// import { showNotification } from "../utils/notification";
// import { AxiosRequestConfig } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    _slowRequestTimer?: NodeJS.Timeout;
  }
}

// --- Configuration ---
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TIME_OUT = 15000;
const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔁 Axios Request Interceptor
api.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (req: any & { _retry?: boolean }) => {
    const time = setTimeout(() => {
      toast("Taking Long Time");
    }, TIME_OUT);
    req._slowRequestTimer = time;

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
          toast.error("Error While Geting refresh token");
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

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config?._slowRequestTimer) {
      clearTimeout(response.config._slowRequestTimer);
    }
    return response;
  },
  (error: AxiosError) => {
    if (axios.isAxiosError(error)) {
      if (error.config?._slowRequestTimer) {
        clearTimeout(error.config._slowRequestTimer);
      }
      if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
        console.error("Request timed out:", error.message);
        toast.error("The server took too long to respond. Please try again.");
      }
      if (error.response?.status === 401) {
        console.warn("Received 401 Unauthorized. Logging out.");
        store.dispatch(logout());
        toast.error("You have been logged out. Please log in again.");
      }
    } else {
      console.error("Interceptor error:", error);
    }
  }
);

export default api;
