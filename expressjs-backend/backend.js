import express from "express";
import cors from "cors";

import userServices from './models/user-services.js';
import user from "./models/user.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


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
            return res.status(201).send("Successful signup");
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
            return res.status(200).send("login successful");
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});