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
          console.log("Fetching excel");
          const res = await AxiosInstance.get(endpoint);
          setResponse(res.data);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };

      return {response, loading, error, handleSubmit};
};

export default useFetchExcel;