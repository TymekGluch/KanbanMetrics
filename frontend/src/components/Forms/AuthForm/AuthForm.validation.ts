import { AuthLoginUserInput } from "@/generated/orval/zod/authLoginUserInput.zod";
import { AuthRegisterUserInput } from "@/generated/orval/zod/authRegisterUserInput.zod";
import { z } from "zod";
import { AUTH_FORM_VARIANTS } from "./AuthForm.constants";

export const authFormSchema = z.discriminatedUnion("variant", [
  AuthLoginUserInput.extend({ variant: z.literal(AUTH_FORM_VARIANTS.LOGIN) }),
  AuthRegisterUserInput.extend({ variant: z.literal(AUTH_FORM_VARIANTS.REGISTER) }),
]);

export type AuthFormSchemaType = z.infer<typeof authFormSchema>;
