import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/database.js";
import fileUpload from "express-fileupload";
import { errorResponse } from "./middlewares/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import ip from "request-ip";
const app = express();

dotenv.config();
connectDB();

app.use(fileUpload({
    userTempFiles: true,
    tempFileDir: "./temp",
    debug: true,
    createParentPath: true,
    abortOnLimit: true,
    limit: 50 * 1024 * 1024,
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ip.mw());
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(errorResponse);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

app.get("/", (req, res) => {
    res.send("Hello World");
});
