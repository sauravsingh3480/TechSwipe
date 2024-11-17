const {User} = require("../models/model");
const jwt = require("jsonwebtoken");

const userauth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!req.cookies?.token) {
            throw new Error("token expired ,Please logIn again");
        }

        const userId = jwt.verify(token, "97088@SauraV");
        const user = await User.findById(userId);
        req.user = user;
        next();
    }
    catch (error) {
        res.status(400).json({ "message": error.message });
    }
}

module.exports = userauth;