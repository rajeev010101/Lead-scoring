import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      console.error('MONGODB_URI not set in env');
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI, {
      // Mongoose 7 no longer needs many options, keep defaults
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
