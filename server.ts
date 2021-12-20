import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import cors from "cors";

import { NODE_ENV, HTTP_PORT, HTTPS_PORT } from "./src/config";

(async () => {
  const httpsOptions = {
    key: fs.readFileSync("sslcert/key.pem"),
    cert: fs.readFileSync("sslcert/cert.pem"),
  };

  const app = express();

  app.use(cors());

  app.get("/ping", (_, res) => res.send("pong"));

  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(httpsOptions, app);

  httpServer.listen(HTTP_PORT, () => console.log(`🚀 HTTP server is running in ${NODE_ENV} on port ${HTTP_PORT}`));
  httpsServer.listen(HTTPS_PORT, () => console.log(`🚀 HTTPS server is running in ${NODE_ENV} on port ${HTTPS_PORT}`));
})().catch((err) => console.error(err));
