// backend/src/lib/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // accept both common env names
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log('DB DEBUG: resolved URI present?:', !!uri);

    if (!uri) {
      throw new Error('MONGO_URI (or MONGODB_URI) is NOT set. Check backend/.env and dotenv loading.');
    }

    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};
