import express from "express";
import {
  createContactRequest,
  getContactRequests,
  replyContact,
  getContactRequestsLimit,
} from "../controller/contact-controller";

const router = express.Router();

router.post("/", createContactRequest);

router.get("/", getContactRequests);

router.get("/limit", getContactRequestsLimit);

router.post("/reply/:id", replyContact);

export default router;
