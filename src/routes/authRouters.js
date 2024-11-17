const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { signUpDataSanitization } = require("../utils/dataSanitization");
const {User} = require("../models/model");

const authRouter = express.Router();
authRouter.post("/signUp", async (req, res) => {
    try {
        if (req.cookies?.token) {
            throw new Error("You are already logIned");
        }
        const { firstName, lastName, age, gender, emailId, password } = req.body;

        //check user alread exists or not
        const findUser = await User.findOne({ emailId: emailId });
        if (findUser) {
            throw new Error("User already exists");
        }

        //sanitize signUp data
        signUpDataSanitization(req);

        //password encryption
        const encrypedPass = await bcrypt.hash(password, 10);

        //new user creation, storing into DB and sending cookies
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            age: age,
            gender: gender,
            emailId: emailId,
            password: encrypedPass,
        });
        const userData = await user.save();
        const token = jwt.sign({ _id: userData._id }, "97088@SauraV", { expiresIn: 432000000 });
        res.cookie("token", token, {
            maxAge: 432000000,
            httpOnly: true,
            secure: true,
            sameSite: 'lax'
        });
        res.json({"message": "User created successfully"});
    } 
    catch (error) {
        res.status(400).json({ "message": error.message });
    }

});

authRouter.post("/logIn", async (req, res) => {
    try {
        if (req.cookies?.token) {
            throw new Error("You are already logIned");
        }
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credetentials");
        }
        const isCorrectPass = await bcrypt.compare(password, user.password);
        if (!isCorrectPass) {
            throw new Error("Invalid Credetentials");
        }

        const token = jwt.sign({ _id: user._id }, "97088@SauraV", { expiresIn: 432000000 });
        res.cookie("token", token, {
            maxAge: 432000000,     // 5 days
            httpOnly: true,         // Cookie inaccessible to client-side scripts
            secure: true,           // Only over HTTPS
            sameSite: 'lax'         // Prevents CSRF attacks while allowing basic cross-origin requests
        });

        res.json({ "messege": "logIn successfully" });
    } catch (error) {
        res.status(400).json({ "message": error.message });
    }
});

authRouter.post("/logOut",(req,res) =>{
    res.cookie("token",null,{maxAge : 0});
    res.json({"message": "User logOut successfully"});
})

module.exports = authRouter;