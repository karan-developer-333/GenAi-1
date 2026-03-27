import axios from 'axios';

console.log("process.env",process.env.NEXT_PUBLIC_SERVER_URL)

const api = axios.create({
  baseURL: '/api',
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
