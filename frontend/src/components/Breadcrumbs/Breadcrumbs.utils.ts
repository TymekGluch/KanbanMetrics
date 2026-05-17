import z from "zod";

export const breadcrumbsHiddenRoutes = ["auth", "workspaces"];

const longIdSchema = z.uuid();

export const checkIsLongId = (id: string) => {
  return longIdSchema.safeParse(id).success;
};
