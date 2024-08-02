import AxiosInstance from '../AxiosInstance';

export const verifyToken = async () => {
  try {
    const response = await AxiosInstance.get('http://127.0.0.1:5000/verify-token/');
    // const response = await AxiosInstance.get('https://project-manager-rust.vercel.app/api/verify-token/');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};