import { useState, useCallback } from 'react';
import AxiosInstance from '../AxiosInstance';

const useUpdateData = (endpoint) => {
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async () => {
      setLoading(true);
      try {
        const res = await AxiosInstance.patch(endpoint, systemData);
        setResponse(res.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }, [systemData, endpoint]);

  return { systemData, setSystemData, response, loading, error, handleSubmit };
};

export default useUpdateData;