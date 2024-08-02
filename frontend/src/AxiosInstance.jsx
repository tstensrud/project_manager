import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AxiosInstance = axios.create({
  //baseURL: 'http://127.0.0.1:5000',
  baseUrl: "https://project-manager-rust.vercel.app/api/"
});

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  /*if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }*/
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

AxiosInstance.interceptors.response.use((response) => {
  const data = response.data;
  
  if (data && data.access_token) {
    localStorage.setItem('token', data.access_token);
    
    response.config.headers.Authorization = `Bearer ${data.access_token}`;
  }
  
  return response;
}, (error) => {
  if (error.response.status === 401) {
    localStorage.removeItem("token");
    // Handle 401 errors, e.g., redirect to login page
    window.location.href = '/'
  }
  
  return Promise.reject(error);
});

export default AxiosInstance;