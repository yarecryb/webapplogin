import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    
    const connection_URL = "https://localhost:8000";

    const parseCookie = (cookie, header) => {
        let cookieArray = cookie.split(';');
        let value = "";
        for(let i = 0; i<cookieArray.length; i++){
            if(cookieArray[i].trim().indexOf(header) === 0){
                value = cookieArray[i].substring(cookieArray[i].indexOf("=")+1);
                return value;
            }
        }
        return null;
    }
    const checkCookie = async () =>{
        try{
            if(document.cookie){
                let cookie = parseCookie(document.cookie, "token");
                const response = await axios.get(`${connection_URL}/account/loginWithToken`, 
                    {headers: {"Authorization" : `Bearer ${cookie}`} });
                if(response.status === 200){
                    setToken(cookie);
                    navigate("/landing");
                }else{
                    navigate("/home");
                }
            }
        } catch (error){
            return 401;
        }
    };
    

    const handleLogin = async (data) => {
        try {
            const response = await axios.post(`${connection_URL}/account/login`, data);

            if (response.status === 401) {
                return 401;
            } else {
                const token = await response.data.token;
                document.cookie = `token=${token}`;
                setToken(token);
                navigate("/landing");
            }
        } catch (error){
            return 401;
        }
    };

    const handleLogout = () => {
        document.cookie = `token=`;
        setToken(null);
    };

    const value = {
        token,
        onPageStart: checkCookie,
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