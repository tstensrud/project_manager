import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AxiosInstance = axios.create(
  
  {

  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

AxiosInstance.interceptors.request.use((config) => {

  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {

  return Promise.reject(error)

  
});

export default AxiosInstance;