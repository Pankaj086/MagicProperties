import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import cookieParser from "cookie-parser";
// import path from 'path';
// import { fileURLToPath } from 'url';

// app config
const app = express();
const port = process.env.PORT || 5000;
connectDB();
connectCloudinary();

// middleware
const corsOptions = {
  origin: ["http://localhost:5173", "https://magic-properties-7psv.vercel.app"], // Allow your frontend domain and others
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Enable cookies in requests and responses
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json()); // Parse JSON requests
// app.use('/uploads', express.static(path.join(__dirname, '/tmp')));

// api endpoints
app.get('/', (req, res) => res.status(200).send('API is running'));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(port, ()=> console.log(`Server is running on port: ${process.env.PORT}`));