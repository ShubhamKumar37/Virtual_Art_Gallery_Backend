import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/database.js";
import fileUpload from "express-fileupload";
import { errorResponse } from "./middlewares/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import ip from "request-ip";
import { authRouter, userRouter, adminRouter, categoryRouter } from "./routes/index.js";

const app = express();

dotenv.config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ip.mw());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,   
    tempFileDir: "./temp",
    limit: 50 * 1024 * 1024,
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// Routs
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/category", categoryRouter);

app.use(errorResponse);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

app.get("/", (req, res) => {
    res.send("Hello World");
});
