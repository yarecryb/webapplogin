import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Landing } from "./Landing";
import { Home } from "./Home";
import {ProtectedRoute} from "./utils/ProtectedRoute";
import { fakeAuth } from "./utils/FakeAuth";
import { NavLink } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { AuthProvider } from "./context/AuthProvider";
export const AuthContext = React.createContext(null);  // we will use this in other components

const App = () => {
    const [token, setToken] = React.useState(null);
    const [user, setUser] = React.useState(null);

    
    const handleLogin = async () => {
        const token = await fakeAuth();
        setToken(token);  
    };

    const handleLogout = () => {
        setToken(null);
    };
      
    return (
        <>
            <Navigation token={token} onLogout={handleLogout} />
{/* 
            {user ? (
                <button onClick={handleLogout}>Sign Out</button>
                ) : (
                <button onClick={handleLogin}>Sign In</button>
                )} */}
            
            <h1>React Router</h1>
            <AuthContext.Provider value={token}>
                <Routes>
                    <Route index element={<Home onLogin={handleLogin} />} />
                    <Route path="landing" element={<Landing />} />
                    <Route path="home" element={ <Home onLogin={handleLogin} />}/>
                    <Route path="*" element={<p>There's nothing here: 404!</p>} />
                </Routes>
            </AuthContext.Provider>
        </>
    );
};

const Navigation = ({token, onLogout}) => (
  <nav>
    {/* <Link to="/landing">Landing</Link> */}
    <Link to="/home">Home</Link>
    <NavLink to="/landing">Landing</NavLink>

    {token && (
    <button type="button" onClick={onLogout}>
      Sign Out
   </button>
    )}
  </nav>
);

export default App;