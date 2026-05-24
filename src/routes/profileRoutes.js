const express = require("express");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

const userauth = require("../utils/userauth");
const {User} = require("../models/model");
const { updateDataSanitization, updatePasswordDataSanitization } = require("../utils/dataSanitization");


profileRouter.get("/profile", userauth, async (req, res) => {
    const user = req.user;
    const sendData = {};
    const fields = ["firstName", "lastName", "age", "gender", "emailId", "skills", "profileImageURL", "feedDetails", "createdAt"];
    fields.forEach(field => {
        sendData[field] = user[field];
    })

    res.send(sendData);
});

profileRouter.patch("/profile/update", userauth, async (req, res) => {

    try {
        updateDataSanitization(req);
        const user = req.user;
        const newData = req.body;
        Object.keys(newData).forEach((field) => {
            user[field] = newData[field];
        })
        const updatedUser = await user.save();
        const sendData = {};
        const fields = ["firstName", "lastName", "age", "gender", "emailId", "skills", "profileImageURL", "feedDetails", "createdAt"];
        fields.forEach(field => {
            sendData[field] = updatedUser[field];
        })
        res.send(sendData);
    }
    catch (error) {
        res.status(400).json({ "message": error.message });
    }
});

profileRouter.patch("/profile/update-password", userauth, async (req, res) => {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;

        const isCorrectPass = await bcrypt.compare(currentPassword, user.password);
        if (!isCorrectPass) {
            throw new Error("Enter currect password");
        }
        updatePasswordDataSanitization(req);

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ "message": "password updated successfully" });
    } catch (error) {
        res.status(400).json({ "message": error.message });
    }
});

profileRouter.delete("/profile/delete", userauth, async (req, res) => {
    const user = req.user;
    await User.findByIdAndDelete(user._id);
    res.cookie("token", null, { maxAge: 0 });
    res.json({ "message": `See you again ${user.firstName}, Account deleted successfully` });
});

module.exports = profileRouter;