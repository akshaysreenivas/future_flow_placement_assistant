// import modules
const express=require("express");
const cors=require("cors");
const morgan = require("morgan");

require("dotenv").config()

// app 
const app=express()
// DB
const database=require("./config/db")
 database()

// middlewares 
app.use(morgan("dev"));
app.use(cors({origin:true,credentials:true}));


// port 
const port=process.env.SERVER_PORT || 8000;
// listen
app.listen(port,()=>{console.log("Server is running on Port ",port)})