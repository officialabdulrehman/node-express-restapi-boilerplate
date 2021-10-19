process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(`Uncaught EXCEPTION:  ${err}`);
  process.exit(1);
});

import express from "express";
import compression from "compression";
import lusca from "lusca";

import { DBConnect } from "./config/database/connection";

import { MONGODB_URI, PORT } from "./utils/secrets";
import { cors } from "./utils/cors";
import { defaultErrorHandler } from "./utils/helpers";

import { userRouter } from "./routers/user/user";

import { recievers } from "./recievers";
import { io } from "./socket";

export const app = express();
export default app;

DBConnect(MONGODB_URI);

app.use(cors);
app.use(compression());
app.set("port", PORT || 3000);
app.use(express.json());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  // Middleware for testing
  next();
});

app.use("/api/v1/user", userRouter.Router());

app.use(defaultErrorHandler);

process.on("unhandledRejection", (err) => {
  console.log(`Unhandled rejection: ${err}`);
});
