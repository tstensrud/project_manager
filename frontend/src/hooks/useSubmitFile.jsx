import { useState } from 'react';
import AxiosInstance from '../AxiosInstance';

const useSubmitFile = (endpoint) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    
    try {
      const res = await AxiosInstance.post(endpoint, formData);
      setResponse(res.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { file, setFile, response, loading, error, handleSubmit };
};

export default useSubmitFile;