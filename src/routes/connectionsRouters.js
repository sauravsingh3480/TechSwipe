const express = require("express");
const connecionsRouter = express.Router();

const userauth = require("../utils/userauth");
const { Connections, User } = require("../models/model");


//Get connections with Accepted status --OK
connecionsRouter.get("/connections", userauth, async (req, res) => {
    const myId = req.user._id;
    const connections = await Connections.find({
        $or: [
            { fromId: myId },
            { toId: myId }
        ],
        status: "Accepted"
    });
    res.send(connections);
});

//Sendig all users information those have send connection request to the user who accessesign this api --OK
connecionsRouter.get("/connections/req-list", userauth, async (req, res) => {
    try {
        const requests = await Connections.find({ toId: req.user._id, status: "Pending" });
        const requestSenders = [];
        for (let request of requests) {
            const user = await User.findById({ _id: request.fromId }, { _id: 1, firstName: 1, lastName: 1, profileImageURL: 1, bio: 1 });
            requestSenders.push(user);
        }
        res.send(requestSenders);
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }

});

//Getting all users information who are requested by you
connecionsRouter.get("/connections/send-list", userauth, async (req, res) => {
    try {
        const requests = await Connections.find({ fromId: req.user._id, status: "Pending" });
        const requestedUsers = [];
        for (let request of requests) {
            const user = await User.findById({ _id: request.toId }, { _id: 1, firstName: 1, lastName: 1, profileImageURL: 1, bio: 1 });
            requestedUsers.push(user);
        }
        res.send(requestedUsers);
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
});

connecionsRouter.post("/connections/unsend/:reqId", userauth, async (req, res) => {
    try {
        const reqId = req.params?.reqId;
        await Connections.findByIdAndDelete(reqId)
        res.json({"messege" : "Connection request unsended"});
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
});

//Sending UserInforamtion along with ConnectionStatus between you and him or her --OK
connecionsRouter.get("/connections/visit-profile/:id", userauth, async (req, res) => {
    try {
        const myId = req.user._id;
        const userId = req.params.id;
        if (req.user._id.toString() === userId) {
            throw new Error("You are not your own connection");
        }

        const user = await User.findById({ _id: userId }, { emailId: 0, password: 0, updatedAt: 0 });
        if (!user) {
            throw new Error("User not exists");
        }

        const connectionStatus = await Connections.find({
            $or: [
                { fromId: myId, toId: userId },
                { fromId: userId, toId: myId }
            ]
        });
        const profileInfo = [
            { userInfo: user },
            { connectionStatus: connectionStatus }
        ];
        res.send(profileInfo);
    }
    catch (error) {
        res.status(500).json({ "message": error.message });
    }
});

//Sending connection request to a user --OK
connecionsRouter.post("/connections/send/:toId", userauth, async (req, res) => {
    try {
        const myId = req.user._id;
        const userId = req.params?.toId;
        const isUserExists = await User.findById(userId);
        if (!isUserExists) {
            throw new Error("User not exist");
        }
        else if (myId.toString() === userId) {
            throw new Error("You cannot make connection with yourself");
        }
        const isConnection = await Connections.find({
            $or: [{ fromId: myId, toId: userId },
            { fromId: userId, toId: myId }
            ]
        });
        if (isConnection.length > 0) {
            throw new Error("Connection already exists");
        }
        const connections = new Connections({
            fromId: myId,
            toId: new Object(userId),
        })
        await connections.save();
        res.json({ "message": "Connection request sended" })
    }
    catch (error) {
        res.status(400).json({ "message": error.message });
    }

});

//Accepting or Rejecting user connection request --OK
connecionsRouter.post("/connections/:decision/:reqId", userauth, async (req, res) => {
    try {
        const { reqId, decision } = req.params;
        const connection = await Connections.findById(reqId);
        if (!connection) {
            throw new Error("Connection dosn't exists");
        }
        else if (connection.toId.toString() !== req.user._id.toString()) {
            throw new Error("You can Accept or Reject this connecion request");
        }

        if (decision === "accept") {
            connection.status = "Accepted";
            await connection.save();
            res.json({ "message": "Connection request accepted" });
        }
        else if (decision === "reject") {
            await Connections.findByIdAndDelete(reqId);
            res.json({ "message": "Connection request rejected" });
        }
    }
    catch (error) {
        res.json({ "message": error.message });
    }
});

module.exports = connecionsRouter;