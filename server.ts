import "reflect-metadata";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import router from "./src/routes";
import ENV from "./src/config";
import { connectDB } from "./src/config/db";

(async () => {
  await connectDB();

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use("/", router);

  app.use((_, res, __) => res.status(404).send("Resource not found"));

  app.use((err, _, res, __) => {
    console.error(err);
    return res.status(500).send("Server Error");
  });

  app.listen(ENV.PORT, () =>
    console.log(`🚀 Server is running in ${ENV.NODE_ENV} on port ${ENV.PORT}`)
  );
})().catch((err) => console.error(err));

process.on("uncaughtException", (err) => console.error(err));
