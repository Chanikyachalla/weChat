import mongoose from "mongoose";

export const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongo db connection sucessfull");
        
    } catch (error) {
        console.log(`error in db connection:${error}`);
    }
}