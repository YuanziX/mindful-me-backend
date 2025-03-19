import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../zod/auth.zod";
import { hashPassword, verifyPassword } from "../utils/hashing.util";
import { signToken } from "../utils/jwt.util";
import prisma from "../utils/prisma.utils";

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.safeParse(req.body);
    if (!data.success) {
      res.json({ success: false, message: data.error });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: data.data.email },
    });

    if (!user) {
      res.json({ success: false, message: "User does not exist" });
      return;
    }

    const verified = verifyPassword(user.password, data.data.password);
    if (!verified) {
      res.json({ success: false, message: "Password incorrect" });
      return;
    }

    res.json({ success: true, message: signToken(user.id) });
  } catch {
    res.json({ success: false, message: "Something went wrong" });
  }
}

export async function signup(req: Request, res: Response) {
  try {
    const data = signupSchema.safeParse(req.body);
    if (!data.success) {
      res.json({ success: false, message: data.error });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.data.email },
    });

    if (existingUser) {
      res.json({ success: false, message: "User already exists" });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        ...data.data,
        password: await hashPassword(data.data.password),
      },
    });

    res.json({ success: true, message: signToken(newUser.id) });
  } catch {
    res.json({ success: false, message: "Something went wrong" });
  }
}
