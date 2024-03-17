import { useState } from "react";
import { useAuth } from "./context/AuthProvider";
import axios from 'axios';

export const Home = () => { 
    const { value } = useAuth();
    const [error, setError] = useState("");
    const connection_URL = "https://localhost:8000";

    const handleSubmit = (event) => {
        event.preventDefault();
        const loginData = {
            username: event.target.username.value,
            password: event.target.password.value
        };

        value.onLogin(loginData).then(
            (e) => {
                if(e === 401){
                    setError("Invalid username or password");
                }
            }
        )
    }

    const navigate = (url) => {
        window.location.href = url;
    }

    const auth = async () => {
        try {
            const response = await axios.post(`${connection_URL}/request`);
            const url = await response.data.url;
            navigate(url);
        } catch (error) {
            console.error('Error fetching oauth:', error);
        }
    }
    
    const renderOAuth = () => {
        return (
            <>
                <h2>Google OAuth</h2>
                <button type="button" onClick={()=> auth()}>
                    OAuth
                </button>
            </>
        )
    }

    return (
      <>
        <h2>Home (Public)</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input type="text" id="username" name="username"/>
            </div>
            <div>
                <label>Password:</label>
                <input type="password" id="password" name="password"/>
            </div>
            
            <div>
                <button type="submit">
                    Sign In
                </button>
            </div>

            {(error && error !== "") && <p style={{fontSize: 40, color: "black"}}>{error}</p>}
        </form>
        {renderOAuth()}
    </>
  );
};