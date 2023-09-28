// import modules
require("dotenv").config();
//env
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const http = require("http");
const errorHandler = require("./middlewares/errorHandler");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const hrRouter = require("./routes/hrRouter");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const server = http.createServer(app);
// DB
const database = require("./config/db");
database();

// MIDDLEWARES ...
app.use(morgan("dev"));
// cors setup 
app.use(cors({credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// creating session 
app.use(cookieParser());
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge  : 1000 * 60 * 60 * 24 
    }
}));

// static files
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/hr", hrRouter);


// ERROR HANDLER MIDDLEWARE 
app.use(errorHandler);


// port
const PORT = process.env.SERVER_PORT || 8000;
// listen
server.listen(PORT, () => {
    console.log("Server is running on Port ", PORT);
});