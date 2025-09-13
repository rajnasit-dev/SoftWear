const express = require('express');
const cors = require("cors");
require("dotenv").config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const checkoutRoutes = require('./routes/checkoutRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');

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
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}.`);
})