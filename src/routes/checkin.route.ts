import { Router } from "express";
import {
  answerCheckin,
  getCheckin,
  getLast7Checkin,
  filledCheckinToday,
} from "../controllers/checkin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/checkin", authMiddleware, answerCheckin);

router.post("/checkin", authMiddleware, getCheckin);

router.post("/checkin/last7", authMiddleware, getLast7Checkin);

router.get("/checkin/today", authMiddleware, filledCheckinToday);

export default router;
