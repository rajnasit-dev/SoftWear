const express = require('express');
const cors = require("cors");
require("dotenv").config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes.js');

const app = express();
app.use(express.json());
app.use(cors())

const port = process.env.PORT;

connectDB();

app.get("/", (req, res)=>{
    res.send("Welcome To Rabbit API!");
});

// API Routes
app.use("/api/users", userRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}.`);
})