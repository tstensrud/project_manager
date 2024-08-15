import AxiosInstance from '../AxiosInstance';
import {BASE_URL} from '../utils/globals.js'

export const verifyToken = async () => {
  try {
    const response = await AxiosInstance.get(`${BASE_URL}/verify-token/`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};