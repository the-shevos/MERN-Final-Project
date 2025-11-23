import express from "express";
import {
  createContactRequest,
  getContactRequests,
  replyContact,
} from "../controller/contact-controller";

const router = express.Router();

router.post("/", createContactRequest);

router.get("/", getContactRequests);

router.post("/reply/:id", replyContact);

export default router;
