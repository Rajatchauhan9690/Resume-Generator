import express from "express";
import authRouter from "./routes/user.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https:/resume-generator-wine-eight.vercel.app",
  "https://resume-generator-git-main-rajats-projects-149ec79a.vercel.app",
  "https://resume-generator-ju7or1urv-rajats-projects-149ec79a.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export default app;
