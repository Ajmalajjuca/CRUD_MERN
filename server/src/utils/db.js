
import dotenv from 'dotenv'
dotenv.config();
import mongoose from 'mongoose'



const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URL
        

        if (!dbURI) {
            throw new Error("MongoDB URI is not defined in .env file");
        }

        let data = await mongoose.connect(dbURI);
        
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error occurred while connecting to MongoDB:', error.message);
        console.error(error);
    }
};

export default connectDB


