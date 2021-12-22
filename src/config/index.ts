import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 5000;
export const DB_URL = process.env.DB_URL;
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const APP_JWT_SECRET = process.env.APP_JWT_SECRET || "";

export default {
  NODE_ENV,
  PORT,
  DB_URL,
  JWT_SECRET,
  APP_JWT_SECRET,
};
