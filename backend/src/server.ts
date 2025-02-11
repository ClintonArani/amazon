import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Import your routes
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import userRoutes from './routes/userRoutes'
import orderRoutes from './routes/orderRoutes';
import cartRoutes from './routes/cartRoutes'

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Apply the CORS middleware
app.use(cors({
  origin: 'http://localhost:4200', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Use the product routes
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} . . .`);
});
