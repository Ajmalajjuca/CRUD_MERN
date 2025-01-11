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
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('public/uploads'));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public/uploads')));

// CORS Configuration
const corsOptions = {
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

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