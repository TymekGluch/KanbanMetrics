import {
  usersUpdateUserHandlerInputPasswordMax,
  usersUpdateUserHandlerInputPasswordMin,
  usersUpdateUserHandlerInputPasswordRegExp,
} from "@/generated/orval/zod/usersUpdateUserHandlerInput.zod";
import { z } from "zod";

const emptyStringToUndefined = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.preprocess((value) => {
    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }

    return value;
  }, schema.optional());

export const userDetailsSchema = z.object({
  name: emptyStringToUndefined(z.string().min(1, "Name is required")),
  email: emptyStringToUndefined(z.email("Invalid email address")),
});

export const newPasswordSchema = z.object({
  password: emptyStringToUndefined(
    z
      .string()
      .min(usersUpdateUserHandlerInputPasswordMin, {
        message: `Password must be at least ${usersUpdateUserHandlerInputPasswordMin} characters long.`,
      })
      .max(usersUpdateUserHandlerInputPasswordMax, {
        message: `Password must be at most ${usersUpdateUserHandlerInputPasswordMax} characters long.`,
      })
      .regex(usersUpdateUserHandlerInputPasswordRegExp, {
        message:
          "Password must contain at least one uppercase letter, one number and one special character.",
      })
  ),
  confirmPassword: emptyStringToUndefined(z.string()),
});

export const updateUserFormSchema = userDetailsSchema
  .and(newPasswordSchema)
  .refine(
    (data) => {
      if (data.password && !data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Please confirm your password",
      path: ["confirmPassword"],
    }
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UpdateUserFormSchemaInputType = z.input<typeof updateUserFormSchema>;
export type UpdateUserFormSchemaType = z.output<typeof updateUserFormSchema>;
