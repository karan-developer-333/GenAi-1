import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setApiToken = (token: string | null) => {
  if (token) {
    (api.defaults.headers.common as any)['Authorization'] = `Bearer ${token}`;
  } else {
    delete (api.defaults.headers.common as any)['Authorization'];
  }
};

export default api;
