import { z } from "zod";

const sixLengthNumberRegex = /^\d{6}$/;

export const AccountActivationAccountActivationInput = z.object({
  code: z.coerce.string().regex(sixLengthNumberRegex, "Activation code must be a 6-digit number"),
});
