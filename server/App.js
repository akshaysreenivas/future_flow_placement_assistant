// import modules
require("dotenv").config();
//env
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const hrRouter = require("./routes/hrRouter");
const session = require("express-session");

// app
const app = express();
// DB
const database = require("./config/db");
database();

// MIDDLEWARES ...

app.use(morgan("dev"));
// cors setup 
app.use(cors({ origin: [process.env.CORS_ORIGIN_URL], methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], credentials: true, }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// creating session 
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 24 * 1 * 1000 },
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
app.listen(PORT, () => {
    console.log("Server is running on Port ", PORT);
});
