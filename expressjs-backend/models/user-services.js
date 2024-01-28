import mongoose from "mongoose";
import userModel from "./user.js";
import user from "./user.js";

// uncomment the following line to view mongoose debug messages
mongoose.set("debug", true);

mongoose
    .connect("mongodb://127.0.0.1:27017/users", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((error) => console.log(error));

async function getUsers(username) {
    let promise;
    if (username) {
        promise = findUserByUsername(username);
    } else {
        promise = await userModel.find();
    }
    return promise;
}

async function getUserByToken(token) {
    if (token) {
        try {
            const user = await userModel.find({ token: token });
            return user;
        } catch (error) {
            console.error(error);
            throw error;
        }
    } else {
        return null;
    }
}

async function addUser(user) {
    const userToAdd = new userModel(user);
    const promise = userToAdd.save().catch((e) => {
        return 500;
    });
    return promise;
}

async function deleteUser(username, password) {
    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return 404;
        }

        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            await user.deleteOne(this);
            return 204;
        } else {
            return 401;
        }
    } catch (error) {
        console.error(error);
        return 500;
    }
}

async function updatePasword(username, oldPassword, newPassword) {
    try {
        const user = await findUserByUsername(username);
    
        if (!user) {
            return 404;
        }

        const isMatch = await user.comparePassword(oldPassword);

        if (isMatch) {
            user.password = newPassword;
            await user.save();
            return 204;
        } else {
            return 401;
        }
    } catch (error) {
        console.error(error);
        return 500;
    }
}

async function updateToken(username, token){
    try {
        const user = await user.findOneAndUpdate(
            {username, username},
            {token, token}
        );
        if(!user){
            return 404;
        }
        return 204;
    } catch (error) {
        console.error(error);
        return 500;
    }
}

async function findUserByUsername(username) {
    return await userModel.findOne({ username: username });
}

export default {
    addUser,
    deleteUser,
    getUsers,
    getUserByToken,
    findUserByUsername,
    updatePasword,
    updateToken
};