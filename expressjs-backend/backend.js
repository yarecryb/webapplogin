const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());

const port = 8000;

const users = {
    users_list : [
        {
            username: "bj",
            password: "pass424"
        }
    ]
};

app.use(express.json());

app.get('/users', (req, res) => {
    res.send(users['users_list']);
});


app.post('/account/register/', (req, res) =>{
    const username = req.body.username;
    const pass = req.body.password;
    if(pass === pass.toLowerCase()){
        return res.status(401).send("Password must contain at least one upper case letter");
    }else{
        addUser(req.body);
        return res.status(200).send("account created");
    }
});

const addUser = (user) =>{
    users['users_list'].push(user);
    return user;
}

app.post('/login', (req, res) => {
    const username = req.body.username;
    const pass = req.body.password;
    if (users['users_list'].some((user) => user['username'] === username && user['password'] === pass)){
        return res.status(200).send("login successful");
    }else {
        return res.status(401).send("cannot login");
    }
    
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});