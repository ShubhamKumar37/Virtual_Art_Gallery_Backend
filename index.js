import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/database.js";
import { errorResponse } from "./middlewares/index.js";

const app = express();

dotenv.config();
connectDB();

app.use(errorResponse);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

app.get("/", (req, res) => {
    res.send("Hello World");
});
