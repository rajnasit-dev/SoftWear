const express = require('express');
const cors = require("cors");
require("dotenv").config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const checkoutRoutes = require('./routes/checkoutRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const subscribeRoutes = require('./routes/subscribeRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const productAdminRoutes = require('./routes/productAdminRoutes.js');
const adminOrderRoutes = require('./routes/adminOrderRoutes.js')

const app = express();
app.use(express.json());
app.use(cors())

const port = process.env.PORT;

connectDB();

app.get("/", (req, res)=>{
    res.send("Welcome To SoftWear API (A clothing ecommerce web app).");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscribeRoutes);

//Admin
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}.`);
})