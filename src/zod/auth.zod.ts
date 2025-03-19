import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string(),
});
