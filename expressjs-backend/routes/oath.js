import genToken from "../backend.js";
// const express = require("express");
import express from "express";
import dotenv from "dotenv";
const router = express.Router();
// const dotenv = require("dotenv");
dotenv.config();

import { OAuth2Client } from "google-auth-library";

// const { OAuth2Client } = require("google-auth-library");

async function getUserData(access_token) {

    const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );
    const data = await response.json();
    console.log("data", data);

}

router.get("/", async function (req, res, next) {

    const code = req.query.code;

    try {

        const redirectUrl = "https://127.0.0.1:8000/oath";
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl
        );

        const result = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(result.tokens);
        const user = oAuth2Client.credentials;
        // show data that is returned from the Google call
        await getUserData(user.access_token);


        // call your code to generate a new JWT from your backend, don't reuse Googles
        
        token = genToken(user.appUser.userid);
        res.redirect(303, `http://localhost:3000/token=${token}`);

    } catch (err) {
        console.log("Error with signin with Google", err);
        res.redirect(303, "http://localhost:3000/");
  }

});
export default router;