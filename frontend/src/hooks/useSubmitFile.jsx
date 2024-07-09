import { useState } from 'react';
import AxiosInstance from '../AxiosInstance';

const useSubmitFile = (endpoint) => {
    const [file, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const res = await AxiosInstance.post(endpoint, file, {
            headers: {
              "Content-Type" : "multipart/form-data"
            },
          });
          setResponse(res.file);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };

      return {file, setData, response, loading, error, handleSubmit};
};

export default useSubmitFile;