import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from './auth';

const ProtectedRoute = ({ element }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const valid = await verifyToken();
      setIsValid(valid);
    };

    checkToken();
  }, []);

  if (isValid === null) {
    return <div>Loading...</div>;
  }

  return isValid ? element : <Navigate to="/noaccess" />;
};

export default ProtectedRoute;