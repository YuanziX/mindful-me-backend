import { Request, Response } from "express";
import { chatMessageSchema } from "../zod/chat.zod";
import prisma from "../utils/prisma.utils";
import model from "../utils/gemini.util";

export async function sendMessage(req: Request, res: Response) {
  try {
    const data = chatMessageSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ success: false, message: data.error.errors });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: req.body.user } });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    await prisma.chatMessage.create({
      data: {
        userId: user.id,
        message: data.data.message,
        fromUser: true,
      },
    });

    const history = await prisma.chatMessage.findMany({
      where: {
        userId: user.id,
      },
      take: 10,
      orderBy: {
        createdAt: "asc",
      },
    });

    const replyMessage = await model.generateContent(
      `reply to the following conversation ${history}`
    );

    const reply = await prisma.chatMessage.create({
      data: {
        userId: user.id,
        message: replyMessage.response.text(),
        fromUser: false,
      },
    });

    res.status(201).json({ success: true, data: reply });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.body.id } });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const messages = await prisma.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    res.status(200).json({ success: true, data: messages });
  } catch {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
