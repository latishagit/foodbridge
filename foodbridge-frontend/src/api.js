import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/foodbridge/foodbridge-backend/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

