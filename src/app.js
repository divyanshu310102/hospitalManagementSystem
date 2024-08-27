import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import userRouter from './routes/user.route.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Multer setup for handling multipart/form-data
const upload = multer();
app.use(upload.any()); // This allows handling multipart form data

app.use("/api/v1/user", userRouter);

export { app };
