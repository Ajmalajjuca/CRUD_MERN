import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/utils/db.js";
import userRoute from "./src/routes/userRoutes.js";
import adminRoute from "./src/routes/adminRoutes.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';

// load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initialize express
const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Environment Variables
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  credentials: true // If you need to include cookies
}));


// Routes
app.use("/", userRoute);
app.use("/admin", adminRoute);

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running in http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();