import { useState } from "react";
import { useAuth } from "./context/AuthProvider";
import axios from 'axios';

export const Register = () => {
    const [error, setError] = useState("");
    const connection_URL = "http://localhost:8000";
    const { value } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const signupData = {
            username: event.target.username.value,
            password: event.target.password.value
        };

        try {
            const response = await axios.post(`${connection_URL}/account/register`, signupData);

            if (response.status === 201){
                value.onLogin(signupData);
            }
        } catch (error){
            if (error.response && error.response.status === 401) {
                setError(error.response.data);
            }
        }
    }

    return (
        <>
          <h2>Register (Public)</h2>
          <p>Create an account</p>
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
}