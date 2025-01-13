import { Request, Response } from "express";
import User from "../models/user.model";
import { signToken, verifyToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/bcryptPassword";

export const register = async (req: Request, res: Response) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    res.status(401).json({ message: "Please fill all fields" });
    return;
  }
  if (password !== confirmPassword) {
    res
      .status(401)
      .json({ message: "Password and confirmpassword are not matched" });
    return;
  }

  const checkEmail = await User.findOne({ email: email.toLowerCase() });

  if (checkEmail) {
    res.status(400).json({ message: "Email is already registered" });
    return;
  }

  try {
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email && !password) {
    res.status(400).json({ message: "Please Enter email and Password" });
    return;
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const checkedPassword = await verifyPassword(password, user.password);

    if (!user || !checkedPassword) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const token = signToken({ id: user._id, email: user.email });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized. No token provided" });
    return;
  }

  try {
    const decoded = verifyToken(token);

    if (typeof decoded !== "string" && "id" in decoded) {
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({
        email: user.email,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile", error });
  }
};
