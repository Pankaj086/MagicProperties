import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

// app config
const app = express();
const port = process.env.PORT || 5000;
connectDB();
connectCloudinary();

// Get __dirname equivalent in ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());
app.use(cors());
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

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