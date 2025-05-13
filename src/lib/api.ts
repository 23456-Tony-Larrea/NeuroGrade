import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const sendNotificationEmail = async (data: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  try {
    await api.post('/notifications/email', data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendParentNotification = async (data: {
  studentId: string;
  parentEmail: string;
  type: 'assignment' | 'attendance' | 'grade';
  message: string;
}) => {
  try {
    await api.post('/notifications/parent', data);
    return true;
  } catch (error) {
    console.error('Error sending parent notification:', error);
    return false;
  }
};

export default api;