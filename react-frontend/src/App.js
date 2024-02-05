import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Landing } from "./Landing";
import { Home } from "./Home";
import { Register } from "./Register";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { fakeAuth } from "./utils/FakeAuth";
import { NavLink } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { AuthProvider } from "./context/AuthProvider";
export const AuthContext = React.createContext(null);  // we will use this in other components

const App = () => {

    return (
        <AuthProvider>
            <Navigation />

            <h1>React Router</h1>

            <Routes>
                <Route index element={<Home />} />
                <Route index element={<Register />} />
                <Route path="landing" element={
                    <ProtectedRoute>
                        <Landing />
                    </ProtectedRoute>
                }
                />
                <Route path="home" element={<Home />} />
                <Route path="register" element={<Register />} />
                <Route path="*" element={<p>There's nothing here: 404!</p>} />
            </Routes>
        </AuthProvider>
    );
};

const Navigation = () => {
    const { value } = useAuth();

    useEffect(() =>{
        value.onPageStart();
    }, []);

    return (
        <nav>
            <NavLink to="/home">Home</NavLink>
            {!value.token && (
                <NavLink to="/register">Register</NavLink>
            )}
            <NavLink to="/landing">Landing</NavLink>
            {value.token && (
                <button type="button" onClick={value.onLogout}>
                    Sign Out
                </button>
            )}
        </nav>
    )
};

export default App;