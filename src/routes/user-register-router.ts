import express from "express";
import { createUser } from "../controller/user-register-controller";
const router = express.Router();

router.post("/register", createUser);

export default router;
