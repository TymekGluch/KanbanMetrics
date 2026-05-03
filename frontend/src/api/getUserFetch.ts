import { type GetApiUserMeSuccessResponse } from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";

const fiveMinutesInSeconds = 60 * 5;

export async function getUserFetch(
  headersList: Headers
): Promise<GetApiUserMeSuccessResponse | null> {
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

  if (!host) return null;

  try {
    const response = await fetch(`${protocol}://${host}/api/auth/me`, {
      headers: {
        cookie: headersList.get("cookie") ?? "",
      },
      next: {
        revalidate: fiveMinutesInSeconds,
        tags: [nextFetchTags.me],
      },
    });

    if (!response.ok) return null;

    const user: GetApiUserMeSuccessResponse | null = await response.json();
    return user;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[RootLayout] failed to fetch user via /api/auth/me proxy", error);
    }

    return null;
  }
}
