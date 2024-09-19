import { useState } from 'react';
import AxiosInstance from '../AxiosInstance';

const useUpdateData = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.patch(endpoint, data);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, setData, response, loading, error, handleSubmit };
};

export default useUpdateData;