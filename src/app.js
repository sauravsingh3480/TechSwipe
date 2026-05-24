require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/authRouters");
const profileRouter = require("./routes/profileRoutes");
const feedRouter = require("./routes/feedRouters");
const connectionsRouter = require("./routes/connectionsRouters");

const connectDB = require("./config/database");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Allow this specific origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
    credentials: true // If you need to allow cookies or authentication headers
}));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", feedRouter);
app.use("/", connectionsRouter);


connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is listening on port ${process.env.PORT}`);
        })
    }).catch((error) => {
        console.error("Unable to connect with DB", error);
    })
