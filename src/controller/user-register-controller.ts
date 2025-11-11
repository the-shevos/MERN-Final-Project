import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../model/User";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userName, userEmail, userPassword, role } = req.body;

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      res.status(400).json({ error: "Username is already taken" });
      return;
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const user = new User({
      userName,
      userEmail,
      userPassword: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};
