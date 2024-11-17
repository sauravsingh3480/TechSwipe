const express = require("express");
const feedRouter = express.Router();

const {User} = require("../models/model");
const userauth = require("../utils/userauth");
const { feedCreateSanitization } = require("../utils/dataSanitization");

feedRouter.get("/feed", userauth, async (req, res) => {
    try {
        const { _id } = req.user;
        const users = await User.find({ _id: { $ne: _id } }, { emailId: 0, password: 0, updatedAt: 0 });
        res.send(users);
    }
    catch (error) {
        res.status(500).json({ "message": "Unable to get feeds" });
    }

});

feedRouter.post("/feed/create", userauth, async (req, res) => {
    try {
        feedCreateSanitization(req);
        const user = req.user;
        const { feedImageURL, caption } = req.body;

        user.feedDetails.unshift({ feedImageURL: feedImageURL, caption: caption });
        await user.save();
        res.json({ "message": "Feed created successfully" });
    }
    catch (error) {
        res.status(400).json({ "message": error.message });
    }

});

feedRouter.post("/feed/update/:feedId", userauth, async (req, res) => {
    try {
        const user = req.user;
        const { feedId } = req.params;
        const { caption } = req.body;
        for(let feed of user.feedDetails)
        {
            if(feed._id.toString() === feedId)
            {
                feed.caption = caption;
                break;
            }
        }
        await user.save();
        res.json({"message" : "feed updated"});
    }
    catch (error) {
        res.status(500).json({ "message": "Unable to update the feed" });
    }

});

feedRouter.delete("/feed/delete/:feedId", userauth, async (req, res) => {
    try {
        const user = req.user;
        const { feedId } = req.params;
        await User.updateOne(
            { _id: user._id },
            { $pull: { feedDetails: { _id: feedId } } } // Removes entry with specific _id
        );
        res.json({"message" : "feed deleted"});
    }
    catch (error) {
        res.status(500).json({ "message": "Unable to delete the feed" });
    }

});

module.exports = feedRouter;