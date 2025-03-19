import { Router } from "express";
import {
  answerCheckin,
  getCheckin,
  getLast7Checkin,
  filledCheckinToday,
} from "../controllers/checkin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const checkinRouter = Router();

checkinRouter.post("/", authMiddleware, answerCheckin);
checkinRouter.post("/", authMiddleware, getCheckin);
checkinRouter.post("/last7", authMiddleware, getLast7Checkin);
checkinRouter.get("/today", authMiddleware, filledCheckinToday);

export default checkinRouter;
