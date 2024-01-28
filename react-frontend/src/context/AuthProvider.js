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

    const parseCookie = (cookie, header) => {
        let cookieArray = cookie.split(';');
        let value = "";
        for(let i = 0; i<cookieArray.length; i++){
            console.log(cookieArray[i]);
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
                console.log(cookie);
                const response = await axios.get(`${connection_URL}/account/loginWithToken`, 
                    {headers: {"Authorization" : `Bearer ${cookie}`} });
                console.log(response);
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