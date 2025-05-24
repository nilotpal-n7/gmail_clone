import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import router from "./mails/route.js";
import dbConnect from "./mails/database.js";

const app = express();

app.use(cors("*"));

// Middleware ----> to parse json and read req.body
app.use(express.json());

// Routes
app.use("/api/mail", router);

const PORT = 8000;

async function startServer() {
  await dbConnect();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
