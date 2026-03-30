import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Basic end point for production
const BASE_URL = 'https://api.anushatechnologies.com';

export const TOKEN_KEY = '@anusha_jwt_token';

export const saveToken = async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const deleteToken = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const apiClient = axios.create({
    baseURL: BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
    try {
          const token = await getToken();
          if (token) {
                  config.headers.Authorization = `Bearer ${token}`;
          }
    } catch (error) {
          console.error("Error reading JWT token from SecureStore", error);
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
          if (error.message === 'Network Error') {
                  console.warn(`[NETWORK ERROR] Could not reach backend: ${error.config?.baseURL}${error.config?.url}`);
                  console.warn(`Please ensure ${error.config?.baseURL} is running and its port is open!`);
          }
          return Promise.reject(error);
    }
  );
