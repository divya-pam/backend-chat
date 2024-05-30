import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import groupRouter from "./routes/groups/routes.js";
import router from "./routes/messages/routes.js";
import userRouter from "./routes/user/routes.js";
import { Server } from "socket.io";

const app = express();

app.use(express.json());

const server = http.createServer(app);
const { PORT } = process.env || 4000;

app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

mongoose.connect("mongodb://localhost:27017/telegram-clone");
const db = mongoose.connection;
db.on("connected", () => {
  console.log("MongoDB connected");
});

server.listen(PORT, () => {
  console.log(PORT);
});

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.use("/user", userRouter);
app.use("/message", router);
app.use("/conversation", groupRouter);

export { io };
