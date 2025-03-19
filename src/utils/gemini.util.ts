import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

declare global {
  var geminiClient: GoogleGenerativeAI | undefined;
}

let geminiClient: GoogleGenerativeAI;

if (!globalThis.geminiClient) {
  globalThis.geminiClient = new GoogleGenerativeAI(
    process.env.GEMINI_KEY || "key_not_found"
  );
}

geminiClient = globalThis.geminiClient;

const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model;
