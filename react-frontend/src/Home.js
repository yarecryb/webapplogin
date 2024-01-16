import { useState } from "react";
import { useAuth } from "./context/AuthProvider";

export const Home = () => { 
    const { value } = useAuth();
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        value.onLogin(username, password).then(
            (e) => {
                if(e === 401){
                    setError("Invalid username or password");
                }
            }
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
    </>
  );
};