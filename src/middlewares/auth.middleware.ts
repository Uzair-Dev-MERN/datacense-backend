import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}
import { verifyToken } from "../utils/jwt"; // Assuming you have this utility for JWT verification

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    res.status(401).json({ message: "Unauthorized. No token provided" });
    return;
  }

  try {
    // Verify the token and attach the user data to the request
    const decoded = verifyToken(token); // Decoding the token to get user ID and other details

    req.user = decoded; // Attach decoded user info to request object for future use (e.g., in the getProfile controller)
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    res.status(401).json({ message: "Unauthorized. Invalid or expired token" });
  }
};
