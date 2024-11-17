const express = require("express");
const cookieparcer = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/authRouters");
const profileRouter = require("./routes/profileRoutes");
const feedRouter = require("./routes/feedRouters");
const connecionsRouter = require("./routes/connectionsRouters");


const app = express();
app.use(express.json());
app.use(cookieparcer());
app.use(cors({
    origin: 'http://localhost:3000', // Allow this specific origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
    credentials: true // If you need to allow cookies or authentication headers
}));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", feedRouter);
app.use("/", connecionsRouter);


//Connecting to DB and listning
const connectDB = require("./config/database");

const { Connection } = require("mongoose");
connectDB()
    .then(() => {
        app.listen(7777, () => {
            console.log("Server is listening at port: 7777");
        })
    }).catch((error) => {
        console.error("Unable to connect with DB");
    })
