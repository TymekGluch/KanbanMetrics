"use server";

import { cookies } from "next/headers";
import type { LayoutContextValue } from "@/components/PageLayout/PageLayoutPanel/context/LayoutContext.types";

const PAGE_LAYOUT_PANEL_COOKIE_KEY = "kanbanmetrics-page-layout-panel";

function isLayoutContextValue(value: unknown): value is LayoutContextValue {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<LayoutContextValue>;

  return (
    typeof candidate.navigationSpace === "string" && typeof candidate.contentSpace === "string"
  );
}

export async function getPageLayoutPanelSpaces(): Promise<LayoutContextValue | null> {
  try {
    const cookieStore = await cookies();
    const rawValue = cookieStore.get(PAGE_LAYOUT_PANEL_COOKIE_KEY)?.value;

    if (!rawValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    return isLayoutContextValue(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export async function setPageLayoutPanelSpaces(spaces: LayoutContextValue): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(PAGE_LAYOUT_PANEL_COOKIE_KEY, JSON.stringify(spaces), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  } catch {
    console.warn("Failed to set page layout panel spaces cookie");
  }
}
