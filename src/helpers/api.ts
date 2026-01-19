import axios from "axios";
import { getData, storeData } from "./localstorage";
import { ASYNC_STORE_VAR } from "../constants/constants";
import store from "../redux/store";
import authApi from "../services/authService";
import { logoutAction } from "../redux/auth/authAction";
import {
  checkInternetConnection,
  showToaster,
  stopLoader,
} from "../helpers/utils";
import { ONINTERNET } from "../constants/stringConstant";
import { getEnvConfig } from "./configService";

let isRefreshing = false;
let failedQueue = [];
let hasShownNetworkError = false;

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const axiosInstance = axios.create({
  baseURL: getEnvConfig("API_URL"),
  headers: {
    "content-Type": "application/json",
  },
});

export const setAuthToken = async (token) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

export const setDeviceId = async (id: string) => {
  axiosInstance.defaults.headers.common['X-DeviceID'] = id;
};

axiosInstance.interceptors.request.use(async (config) => {
  const isConnected = await checkInternetConnection();

  if (!isConnected) {
    if (!hasShownNetworkError) {
      showToaster(ONINTERNET, "E");
      hasShownNetworkError = true;
    }
    stopLoader();
    return Promise.reject(new Error("No internet connection"));
  }
  hasShownNetworkError = false;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.message === "No internet connection") {
      stopLoader();
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const accessToken = await getData(ASYNC_STORE_VAR.token);
        const refreshToken = await getData(ASYNC_STORE_VAR.refreshToken);
        if (!accessToken || !refreshToken) {
          store.dispatch(logoutAction());
          return Promise.reject(error);
        }

        const refreshData = await store.dispatch(
          authApi.endpoints.refreshToken.initiate({
            accessToken,
            refreshToken,
          })
        );

        if (refreshData?.data?.statusCode === 200) {
          const {
            access_token: newAccessToken,
            refreshToken: newRefreshToken,
          } = refreshData.data.data;

          await setAuthToken(newAccessToken);
          await storeData(ASYNC_STORE_VAR.token, newAccessToken);
          await storeData(ASYNC_STORE_VAR.refreshToken, newRefreshToken);

          processQueue(null, newAccessToken);
          isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          store.dispatch(logoutAction());
          processQueue(error, null);
          isRefreshing = false;
        }
      } catch (err) {
        store.dispatch(logoutAction());
        processQueue(err, null);
        isRefreshing = false;
      }
    }

    console.log("Final error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
