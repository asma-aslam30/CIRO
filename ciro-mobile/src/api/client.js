import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Update with local IP for physical device testing

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const signalsApi = {
  sendSignals: (signals) => apiClient.post('/signals', signals),
  analyzeCrisis: () => apiClient.post('/analyze'),
};

export const crisisApi = {
  getCrisis: () => apiClient.get('/crisis'),
};

export const actionsApi = {
  getActions: () => apiClient.get('/actions'),
  getState: () => apiClient.get('/state'),
};

export default apiClient;
