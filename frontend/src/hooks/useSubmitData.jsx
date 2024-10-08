import { useState } from 'react';
import AxiosInstance from '../AxiosInstance';

const useSubmitData = (endpoint) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        try {
          const res = await AxiosInstance.post(endpoint, data);
          setResponse(res.data);
          setLoading(false);
        } catch (err) {
          setError(err.response ? err.response.data : err.message);
          setLoading(false);
        }
      };

      return {data, setData, response, loading, error, handleSubmit};
};

export default useSubmitData;