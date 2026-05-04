import {
  authLoginUserInputPasswordMax,
  authLoginUserInputPasswordMin,
  authLoginUserInputPasswordRegExp,
  AuthLoginUserInput,
} from "@/generated/orval/zod/authLoginUserInput.zod";
import { AuthRegisterUserInput } from "@/generated/orval/zod/authRegisterUserInput.zod";
import { z } from "zod";
import { AUTH_FORM_VARIANTS } from "./AuthForm.constants";

const passwordSchema = z
  .string()
  .min(authLoginUserInputPasswordMin, {
    message: `Password must be at least ${authLoginUserInputPasswordMin} characters long.`,
  })
  .max(authLoginUserInputPasswordMax, {
    message: `Password must be at most ${authLoginUserInputPasswordMax} characters long.`,
  })
  .regex(authLoginUserInputPasswordRegExp, {
    message:
      "Password must contain at least one uppercase letter, one number and one special character.",
  });

export const authFormSchema = z.discriminatedUnion("variant", [
  AuthLoginUserInput.extend({
    password: passwordSchema,
    variant: z.literal(AUTH_FORM_VARIANTS.LOGIN),
  }),
  AuthRegisterUserInput.extend({
    password: passwordSchema,
    variant: z.literal(AUTH_FORM_VARIANTS.REGISTER),
  }),
]);

export type AuthFormSchemaType = z.infer<typeof authFormSchema>;
