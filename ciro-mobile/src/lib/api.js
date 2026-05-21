import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://localhost:8000/api'; // Use 10.0.2.2 for Android emulator if needed later, but web mode uses localhost

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      await AsyncStorage.setItem('userToken', response.data.access_token);
    }
    return response.data;
  },
  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    if (response.data.access_token) {
      await AsyncStorage.setItem('userToken', response.data.access_token);
    }
    return response.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem('userToken');
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const signalAPI = {
  sendSignals: async (signals) => {
    const response = await api.post('/signals', signals);
    return response.data;
  },
  triggerAnalysis: async () => {
    const response = await api.post('/analyze');
    return response.data;
  },
  getRandomSignal: async (category) => {
    const response = await api.get(`/signals/random/${category}`);
    return response.data;
  },
  resetState: async () => {
    const response = await api.post('/reset');
    return response.data;
  },
  toggleAutopilot: async () => {
    const response = await api.post('/autopilot');
    return response.data;
  },
  getAutopilotStatus: async () => {
    const response = await api.get('/autopilot');
    return response.data;
  }
};

export const dataAPI = {
  getCrisis: async () => {
    const response = await api.get('/crisis');
    return response.data;
  },
  getActions: async () => {
    const response = await api.get('/actions');
    return response.data;
  }
};

export default api;
