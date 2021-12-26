import "reflect-metadata";

import "colorts/lib/string";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import router from "./src/routes";
import ENV from "./src/config";
import { connectDB } from "./src/config/db";
import { errorHandler } from "./src/middlewares/error.middleware";
import { notFound } from "./src/middlewares/notFound.middleware";

(async () => {
  await connectDB();

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use("/", router);

  app.use(notFound);
  app.use(errorHandler);

  app.listen(ENV.PORT, () =>
    console.log(
      `🚀 Server is running in ${ENV.NODE_ENV} on port ${ENV.PORT}`.yellow.bold
    )
  );
})().catch((err) => console.error(`Error: ${err}`.red));

process.on("uncaughtException", (err) => console.error(`Error: ${err}`.red));
