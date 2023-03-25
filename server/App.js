//env
require("dotenv").config();
// import modules
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const hrRouter = require("./routes/hrRouter");
const session = require("express-session");
// app
const app = express();
// DB
const database = require("./config/db");
database();

// middlewares
app.use(morgan("dev"));
app.use(cors({ origin: [process.env.CORS_ORIGIN_URL], methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], credentials: true, }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// port
const port = process.env.SERVER_PORT || 8000;
// listen
app.listen(port, () => {
    console.log("Server is running on Port ", port);
});
