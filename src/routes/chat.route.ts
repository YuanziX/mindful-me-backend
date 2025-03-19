import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/chat.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const chatRouter = Router();

chatRouter.get("/", authMiddleware, getMessages);
chatRouter.post("/", authMiddleware, sendMessage);

export default chatRouter;
