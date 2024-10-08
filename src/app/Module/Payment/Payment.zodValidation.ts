import { z } from "zod";

const paymentZodSchema = z.object({
  body: z.object({
    amount: z.number().refine((val) => typeof val === "number", {
      message: "amount must be a number",
    }),
  }),
});

export const paymentZodValidation = {
  paymentZodSchema,
};
