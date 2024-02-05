import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";

import userServices from './models/user-services.js';
import user from "./models/user.js";
import middleware from "./middleware.js"

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

dotenv.config();
process.env.TOKEN_SECRET;

// note this only works on safari not chrome
https
    .createServer(
        // Provide the private and public key to the server by reading each
        // file's content with the readFileSync() method.
        {
            key: fs.readFileSync("key.pem"),
            cert: fs.readFileSync("cert.pem"),
        },
        app
    )
    .listen(port, () => {
        console.log(`server is running at port ${port}`);
    });

const genToken = (username) =>{
    return jwt.sign({username}, process.env.TOKEN_SECRET, { expiresIn: '7d' });
}

app.get('/account/loginWithToken', middleware.authenticateToken, async (req, res) => {
    try {
        // const authHeader = req.headers['authorization'];
        // const token = authHeader && authHeader.split(' ')[1];
        // const user = await userServices.getUserByToken(token);

        if(req.user){
            return res.status(200).send("logged in");
        }else{
            return res.status(401).send("invalid token");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("An error ocurred in the server.");
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await userServices.getUsers();
        return res.status(200).json({ user_list: users });
    } catch (error) {
        console.log(error);
        res.status(500).send("An error ocurred in the server.");
    }
});

app.post('/account/register/', async (req, res) => {
    const username = req.body.username;
    const pass = req.body.password;
    if (pass === pass.toLowerCase()) {
        return res.status(401).send("Password must contain at least one upper case letter");
    } else {
        return addUser(req.body, res);
    }
});

const addUser = async (user, res) => {
    try {
        const result = await userServices.addUser(user);
        if (result == 500) {
            return res.status(500).send("Unable to sign up");
        } else {
            const token = genToken(user.username);

            return res.status(201).json({"token":token});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("An error ocurred in the server.");
    }
}

app.post('/account/updatePassword', async (req, res) => {
    const username = req.body.username;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    if (newPassword === newPassword.toLowerCase()) {
        return res.status(401).send("Password must contain at least one upper case letter");
    } else {
        try {
            const e = await userServices.updatePasword(username, oldPassword, newPassword);
            if (e === 404) {
                return res.status(e).send("User not found");
            } else if (e === 401) {
                return res.status(e).send("Old passwords must match");
            } else if (e === 204) {
                return res.status(e).send("Password updated successfully");
            } else {
                console.log(e);
                return res.status(500).send(e);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send("An error ocurred in the server.");
        }
    }
});

app.post('/account/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await userServices.findUserByUsername(username);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const correctLogin = await user.comparePassword(password);
        if (correctLogin) {
            const token = genToken(user.username);
            return res.status(200).json({"token":token});
        } else {
            return res.status(401).send("cannot login");
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("An error ocurred in the server.");
    }
});

app.delete('/account/delete', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const e = await userServices.deleteUser(username, password);
        if (e === 404) {
            return res.status(e).send("User not found");
        } else if (e === 401) {
            return res.status(e).send("Old passwords must match");
        } else if (e === 204) {
            return res.status(e).send("Account deleted successfully");
        } else {
            console.log(e);
            return res.status(500).send(e);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("An error ocurred in the server.");
    }
});