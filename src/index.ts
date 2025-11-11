import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRegisterRouter from "./routes/user-register-router";

dotenv.config();

const app = express();
const mongoURI = process.env.MONGO_URI || "";

mongoose
  .connect(mongoURI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRegisterRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
