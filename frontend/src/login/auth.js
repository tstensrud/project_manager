import AxiosInstance from '../AxiosInstance';

export const verifyToken = async () => {
  try {
    const response = await AxiosInstance.get('http://127.0.0.1:5000/verify-token/'); // Adjust the endpoint as needed
    return response.status === 200;
  } catch (error) {
    return false;
  }
};