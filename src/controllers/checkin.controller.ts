import { Request, Response } from "express";
import { checkinSchema, getCheckinSchema } from "../zod/checkin.zod";
import prisma from "../utils/prisma.utils";

export async function answerCheckin(req: Request, res: Response) {
  try {
    const data = checkinSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ success: false, message: data.error.errors });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user } });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const checkin = await prisma.checkIn.create({
      data: {
        thoughts: data.data.q5 || null,
        userId: user.id,
        mood: data.data.q6,
        energyLevel: data.data.q7,
        feelingRating: data.data.q1,
        sleptWell: data.data.q2,
        lookingForwardTo: data.data.q3,
        feelPrepared: data.data.q4,
      },
    });

    res
      .status(200)
      .json({ success: false, message: "Check-in answered successfully" });
    return;
  } catch (error) {
    console.error("Error answering check-in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
}

export async function getCheckin(req: Request, res: Response) {
  try {
    const parsedQuery = getCheckinSchema.safeParse(req.query);

    if (!parsedQuery.success) {
      res
        .status(400)
        .json({ success: false, message: parsedQuery.error.errors });
      return;
    }

    const { date } = parsedQuery.data;
    const parsedDate = new Date(date);

    const user = await prisma.user.findUnique({ where: { id: req.user } });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const checkin = await prisma.checkIn.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
          lt: new Date(parsedDate.setHours(23, 59, 59, 999)),
        },
      },
    });

    if (!checkin) {
      res.status(404).json({ success: false, message: "Check-in not found" });
      return;
    }

    res.status(200).json({ success: true, data: checkin });
  } catch (error) {
    console.error("Error fetching check-in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getLast7Checkin(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user } });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const checkins = await prisma.checkIn.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 7,
    });

    res.status(200).json({ success: true, data: checkins });
  } catch (error) {
    console.error("Error fetching last 7 check-ins:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function filledCheckinToday(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user } });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const checkin = await prisma.checkIn.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (checkin) {
      res.status(200).json({ success: true, message: true });
    } else {
      res.status(200).json({ success: true, message: false });
    }
  } catch (error) {
    console.error("Error checking if check-in is filled today:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
