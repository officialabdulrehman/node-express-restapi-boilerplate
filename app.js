process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(`Uncaught EXCEPTION:  ${err}`);
  process.exit(1);
});

import express from "express";
import session from "express-session";
import compression from "compression";
import lusca from "lusca";
import passport from "passport";
import { MONGODB_URI, PORT, SESSION_SECRET } from "./utils/secrets";

import { cors } from "./utils/cors";
import { DBConnect } from "./config/database/connection";
import { GetMongoStore } from "./config/database/store";

import { userRouter } from "./routers/user/user";
import { defaultErrorHandler } from "./utils/helpers";
import "./config/auth/passport";

import { recievers } from "./recievers";
import { io } from "./socket";

export const app = express();
export default app;

DBConnect(MONGODB_URI);

const mongoStore = GetMongoStore(MONGODB_URI);

app.use(cors);
app.use(compression());
app.set("port", PORT || 3000);
app.use(express.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: mongoStore,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/api/v1/user", userRouter.Router());

app.use(defaultErrorHandler);
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled rejection: ${err}`);
});
