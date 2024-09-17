import { useState } from 'react';
import AxiosInstance from '../AxiosInstance';

const useFetchExcel = (endpoint) => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const res = await AxiosInstance.get(endpoint);
          setResponse(res.data);
          setLoading(false);
        } catch (err) {
          setError(err.response ? err.response.data : err.message);
          setLoading(false);
        }
      };

      return {response, loading, error, handleSubmit};
};

export default useFetchExcel;