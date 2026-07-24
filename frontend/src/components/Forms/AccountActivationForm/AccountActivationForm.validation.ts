import { z } from "zod";

const sixLengthNumberRegex = /^\d{6}$/;

export const AccountActivationAccountActivationInput = z.object({
  code: z.coerce.string().regex(sixLengthNumberRegex, "Activation code must be a 6-digit number"),
  turnstileToken: z.string().min(1, "Turnstile verification is required, maybe you are Bot?"),
});
