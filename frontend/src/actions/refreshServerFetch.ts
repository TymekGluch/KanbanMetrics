"use server";

import { type nextFetchTags } from "@/nextFetchTags";
import { type ValueOf } from "@/types/valueOf";
import { revalidateTag, updateTag } from "next/cache";
import z from "zod";

const refreshServerFetchSchema = z.string().min(1);

export async function refreshServerFetchAction(tag: ValueOf<typeof nextFetchTags>) {
  const parsedTag = refreshServerFetchSchema.parse(tag);

  updateTag(parsedTag);
  revalidateTag(parsedTag, "max");
}
