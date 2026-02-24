import mongoose from "mongoose";

const connectToDatabase = async () => {
   try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    
    console.log("Connected to the database successfully");
   } catch (error) {
      console.error("Database connection error:", error);
   }

};

export default connectToDatabase;