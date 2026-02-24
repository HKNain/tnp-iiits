import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToDatabase from "./db/dbConnection.js";
import authRoute from "./routes/auth.route.js";
import taskRoute from "./routes/task.route.js";
import placementRoute from "./routes/placement.route.js";


dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(
  cors({
    origin: "https://tnp-iiits.vercel.app", 
    // origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/task", taskRoute);
app.use("/api/placement", placementRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectToDatabase();
});