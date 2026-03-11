import express from "express";
import mongoose from "mongoose";
import { userRouter } from "./APIs/UserAPI.js";
import {authorRouter} from './APIs/AuthorAPI.js'
import cors from "cors";
import {clerkMiddleware} from '@clerk/express'
import {config} from 'dotenv'
config()

//create express app
const app = express();
//parse body of req
app.use(cors(["http://localhost:5173"]));
app.use(express.json());
app.use(clerkMiddleware())
app.use("/user-api", userRouter);
app.use("/author-api",authorRouter)

//port number
const port = 4000;
//db connection
async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017/vnrblog2026");
  console.log("DB connection success");
  //assign port number
  app.listen(port, () => console.log(`server listening on port ${port} `));
}

connectDB();

//test route (removed later)
app.get("/test", (req, res) => {
  res.json({ message: "From Test route" });
});

//Error handler
app.use((err, req, res, next) => {
  console.log(err);
  if (err?.status === 401) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: err.message,
  });
});
