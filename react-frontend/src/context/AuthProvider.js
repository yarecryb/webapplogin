import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeAuth } from "../utils/FakeAuth";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);

    const handleLogin = async (username, password) => {
        if(username === "bj" && password === "pass424"){
            const token = await fakeAuth();
            setToken(token);
            navigate("/landing");
        }else{
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