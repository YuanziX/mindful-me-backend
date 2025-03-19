import { EnergyLevel, Mood } from "@prisma/client";
import { z } from "zod";

export const checkinSchema = z.object({
  q1: z.string(),
  q2: z.boolean().default(false),
  q3: z.string().nonempty(),
  q4: z.boolean().default(false),
  q5: z.string().optional(),
  q6: z.nativeEnum(Mood),
  q7: z.nativeEnum(EnergyLevel),
});

export const getCheckinSchema = z.object({
  date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid date format",
  }),
});
