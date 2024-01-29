import React, { useEffect, useState } from "react";
import { useAuth } from "./context/AuthProvider";
import axios from 'axios';

export const Landing = () => {
    const { value } = useAuth();
    const connection_URL = "https://localhost:8000";
    const [users, setUsers] = useState([{}]);
    useEffect(() =>{
        getUserData().then( (res) =>{
            if(res.status === 200){
                setUsers(res.data.user_list);
            }
        });
    },[]);

    const getUserData = async () => {
        try {
            const response = await axios.get(`${connection_URL}/users`);
            return response;
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const renderTable = () => {
        return (
            <>
                <h3>Usernames</h3>
                <ul>
                    {users && users.map((element) => (
                        <li key = {element._id}>
                            {element.username}
                        </li>
                    ))}
                </ul>
            </>
        )
    }

    return (
        <>
            <h2>Landing (Protected)</h2>
            {renderTable()}
        </>
    );
};