import { type GetApiAccountActivationCodeGetSuccessResponse } from "@/generated/api-aliases";
import { nextFetchTags } from "@/nextFetchTags";

const fiveMinutesInSeconds = 60 * 5;

export async function getAccountActivationCodeFetch(
  headersList: Headers
): Promise<GetApiAccountActivationCodeGetSuccessResponse | null> {
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

  if (!host) return null;

  try {
    const response = await fetch(`${protocol}://${host}/api/account-activation-code/get`, {
      headers: {
        cookie: headersList.get("cookie") ?? "",
      },
      next: {
        revalidate: fiveMinutesInSeconds,
        tags: [nextFetchTags.accountActivationCode],
      },
    });

    if (!response.ok) {
      return null;
    }

    const activationCode: GetApiAccountActivationCodeGetSuccessResponse | null =
      await response.json();

    return activationCode;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[getActivationCodeFetch] failed to fetch activation code via /api/account/activation-code proxy",
        error
      );
    }

    return null;
  }
}
