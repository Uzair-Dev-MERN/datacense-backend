import jwt from "jsonwebtoken";

export const signToken = (payload: object) => {
  return jwt.sign(payload, `${process.env.JwtSecret}`, {
    expiresIn: process.env.expiresIn,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, `${process.env.JwtSecret}`);
};
