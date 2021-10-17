import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import { recievers } from "./recievers";
import { MONGODB_URI, PORT, SESSION_SECRET } from "./utils/secrets";
import { io } from "./socket";
import { cors } from "./utils/cors";

import { DBConnect } from "./config/database/connection";
import { GetMongoStore } from "./config/database/store";

import { userRouter } from "./routers/user/user";

const app = express();

DBConnect(MONGODB_URI);

const mongoStore = GetMongoStore(MONGODB_URI);

app.use(cors);
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
//app.use(graphqlAuthMiddleware);

// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema: graphqlSchema,
//     rootValue: graphqlResolver,
//     graphiql: true,
//     customFormatErrorFn(err) {
//       if (!err.originalError) {
//         return err;
//       }
//       const {
//         message,
//         originalError: { data, code },
//       } = err;
//       return {
//         code,
//         message,
//         result: {},
//         errors: data,
//       };
//     },
//   })
// );

app.use("/api/v1/user", userRouter.Router());

app.use((err, req, res, next) => {
  const { code, message, data } = err;
  let statusCode = code;
  if (statusCode == 11000) statusCode = 409;
  res.status(statusCode || 500).json({
    message,
    result: {},
    errors: data,
  });
});

const server = app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

// try {
//   const db = await mongoose.connect(MONGODB_URI.toString());
//   const server = app.listen(PORT || 8080);
//   console.log(`Server running at PORT: ${PORT || 8080}`);
//   const myio = io.init(server);
//   myio.on("connection", (socket) => {
//     console.log("CLIENT CONNECTED", socket.id);

//     socket.emit("message", `Welcome ${socket.id}`);

//     socket.broadcast.emit(
//       "message",
//       `Fellas, say hi to our nakama ${socket.id}`
//     );

//     console.log("userId = " + socket.handshake.query.userId);
//     let notificationReciever = socket.handshake.query.userId;
//     if (notificationReciever !== "undefined") {
//       recievers.push(notificationReciever);
//     }

//     socket.on("disconnect", () => {
//       if (notificationReciever !== undefined) {
//         let index = recievers.findIndex(
//           (reciever) => reciever === notificationReciever
//         );
//         recievers.splice(index, 1);
//       }
//       console.log(`${socket.id} disconnected`);
//       socket.broadcast.emit(
//         "message",
//         `Fellas, we have lost our nakama ${socket.id}`
//       );
//     });
//   });
// } catch (err) {
//   throw new Error("Database connection error");
// }
