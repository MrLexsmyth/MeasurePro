import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  gender: z.enum(["male", "female"]),
  notes: z.string().optional(),
});
