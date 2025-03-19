import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const EXPIRATION_TIME = "30d";

export const signToken = (id: string): string => {
  return jwt.sign({ id }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
};

// Function to verify a token and return the id
export const verifyToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    return decoded.id;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
