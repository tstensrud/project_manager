import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ component, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return component;
}

export default ProtectedRoute;