import dotenv from "dotenv";

// load env file
dotenv.config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env",
});

export const NODE_ENV = process.env.NODE_ENV || "development";
export const HTTP_PORT = process.env.HTTP_PORT;
export const HTTPS_PORT = process.env.HTTPS_PORT;
export const DB_URL = process.env.DB_URL;

export default { NODE_ENV, HTTP_PORT, HTTPS_PORT, DB_URL };
