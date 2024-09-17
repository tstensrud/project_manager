import { useState } from 'react';
import AxiosInstance from '../AxiosInstance';

const useDeleteData = (endpoint) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
            data: data
          };
          const res = await AxiosInstance.delete(endpoint, config);
          setResponse(res.data);
          setLoading(false);
        } catch (err) {
          setError(err.response ? err.response.data : err.message);
          setLoading(false);
        }
      };

      return {data, setData, response, loading, error, handleSubmit};
};

export default useDeleteData;