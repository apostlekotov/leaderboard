import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const APP_JWT_SECRET = process.env.APP_JWT_SECRET || "appsecret";
export const EMAIL = process.env.EMAIL;
export const PASSWORD = process.env.PASSWORD;

export default {
  NODE_ENV,
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  APP_JWT_SECRET,
};
