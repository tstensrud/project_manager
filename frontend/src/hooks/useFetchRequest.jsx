import { useState, useCallback } from 'react';
import AxiosInstance from '../AxiosInstance';

const useFetchRequest = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AxiosInstance.get(endpoint);
      setData(response.data);
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { data, loading, error, setData, fetchData };
};

export default useFetchRequest;