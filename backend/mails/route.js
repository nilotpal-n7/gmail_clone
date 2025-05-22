import express from "express";
import { createMail, getMails, starMail, deleteMail } from "./controller.js";

const router = express.Router();

// Route to create a new mail
router.post("/create", createMail);

// Route to get all mails
router.get("/getAll", getMails);

// Route to delete a mail by ID
router.delete("/delete/:id", deleteMail);

// Route to mark a mail as starred
router.get("/star", starMail);

export default router;
