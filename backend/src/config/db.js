import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(
    "mongodb://127.0.0.1:27017/wechatdb"
    );
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("DB connection error:", error.message);
  }
};
