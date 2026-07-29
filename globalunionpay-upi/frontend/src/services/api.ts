import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: any) => api.post('/api/v1/auth/register', data),
  login: (data: any) => api.post('/api/v1/auth/login', data),
  sendOtp: (phone: string) => api.post('/api/v1/auth/send-otp', { phone }),
  verifyOtp: (data: any) => api.post('/api/v1/auth/verify-otp', data),
  refreshToken: (token: string) => api.post('/api/v1/auth/refresh-token', { refreshToken: token }),
};

export const upiApi = {
  createUpiId: (data: any) => api.post('/api/v1/upi/create', data),
  validateUpiId: (upiId: string) => api.get(`/api/v1/upi/validate/${upiId}`),
  validateByPhone: (phone: string) => api.get(`/api/v1/upi/validate/phone/${phone}`),
  initiatePayment: (data: any) => api.post('/api/v1/upi/pay', data),
  getMyUpiIds: () => api.get('/api/v1/upi/my-upi-ids'),
};

export const walletApi = {
  getBalance: () => api.get('/api/v1/wallet/balance'),
  addMoney: (amount: number) => api.post('/api/v1/wallet/add-money', { amount }),
};

export const transactionApi = {
  getTransactions: (page = 0, size = 20) =>
    api.get(`/api/v1/transactions?page=${page}&size=${size}`),
  getTransactionById: (id: string) => api.get(`/api/v1/transactions/${id}`),
};

export { api };
export default api;
