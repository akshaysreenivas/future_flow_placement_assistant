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
// Define an array of allowed origins
const allowedOrigins = [process.env.CORS_ORIGIN_URL_A, process.env.CORS_ORIGIN_URL_B];

// Configure CORS middleware with options
const corsOptions = {
    origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins array or if it's undefined (e.g., for same-origin requests)
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error("Not allowed by CORS")); // Block the request
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
    credentials: true, // Enable credentials
    optionsSuccessStatus: 204, // HTTP status code for successful OPTIONS requests
};

// Use the cors middleware with the defined options
app.use(cors(corsOptions));
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