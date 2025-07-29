
require('dotenv').config();
const express = require('express');
const connectToDatabase = require('./database/db');
const authRoutes = require('./routes/authRoute');
const bookRoutes = require('./routes/bookRoute');
const homeRoutes = require('./routes/homeRoute');
const adminRoutes = require('./routes/adminRoute');
const uploadFileRoutes = require('./routes/imageRoute');
const productRouter = require('./routes/productRoute');


const app = express();

const port = process.env.PORT || 8000;

// DATABASE CONNECTOR..........

connectToDatabase();

// MIDDLEWARE ................

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/file', uploadFileRoutes);
app.use('/api/product', productRouter);

app.listen(port,()=>{
    console.log(`Server is running ${port}`);
}); 