import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const ProtectedRoute = ({ children }) => {
    const { value } = useAuth();
    const googleToken = localStorage.getItem("TOKEN_KEY");
    const isValidToken = value.token && googleToken;

    if (!isValidToken) {
        return <Navigate to="/home" replace />;
    }
    return children;
};