const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");

require('dotenv').config(); //tis makes process.env.MONGO_URI available for our application

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);
app.use(express.json());
app.use(cookieParser());
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('MongoDB connected');
    })
    .catch((error)=>{
        console.log('MongoDB connection failed', error);
    });


const port = 6010;
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})
