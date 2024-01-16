import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeAuth } from "../utils/FakeAuth";
import axios from 'axios';

const AuthContext = createContext({});
// const axios = require('axios').default;

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    
    const connection_URL = "http://localhost:8000";

    const handleLogin = async (data) => {
        try {
            const response = await axios.post(`${connection_URL}/login`, data);

            if (response.status === 401) {
                return 401;
            } else {
                const token = await fakeAuth();
                setToken(token);
                navigate("/landing");
            }
        } catch (error){
            return 401;
        }
        
    };

    const handleLogout = () => {
        setToken(null);
    };

    const value = {
        token,
        onLogin: handleLogin,
        onLogout: handleLogout,
    };

    return (
        <AuthContext.Provider value={{ value }}>
            {children}
        </AuthContext.Provider>
    );
};

// give callers access to the context
export const useAuth = () => useContext(AuthContext);