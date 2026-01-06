import axios from 'axios';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const getCookie = (name) => {
  const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
};

export const userApi = axios.create({
  baseURL: `${VITE_API_BASE}/v2/api/${VITE_API_PATH}`,
});

export const authApi = axios.create({
  baseURL: `${VITE_API_BASE}/v2`,
});

export const adminApi = axios.create({
  baseURL: `${VITE_API_BASE}/v2/api/${VITE_API_PATH}/admin`,
});

authApi.interceptors.request.use(
  (request) => {
    const token = getCookie('adminToken');
    if (token) request.headers.Authorization = token;
    return request;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.request.use(
  (request) => {
    const token = getCookie('adminToken');
    if (token) request.headers.Authorization = token;
    return request;
  },
  (error) => Promise.reject(error)
);
