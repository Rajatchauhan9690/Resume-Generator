import dotenv from "dotenv";

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI || !PORT || !JWT_SECRET) {
  console.error(
    "Missing required environment variables. Please check your .env file.",
  );
  process.exit(1);
}
