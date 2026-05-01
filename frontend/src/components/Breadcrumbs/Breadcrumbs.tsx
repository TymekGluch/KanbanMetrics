"use client";

import { usePathname } from "next/navigation";
import Link from "../Link";
import styles from "./Breadcrumbs.module.scss";
import { HomeSvg } from "@/assets/HomeSvg";
import { ChevronRightSvg } from "@/assets/ChevronRightSvg";

export function Breadcrumbs() {
  const pathname = usePathname();

  const pathnameChunks = pathname.split("/").filter(Boolean);
  const urls = pathnameChunks.map((_, index, array) => `/${array.slice(0, index + 1).join("/")}`);

  const isHomeActive = pathname === "/";

  return (
    <div className={styles.breadcrumbs}>
      <Link.AsNextLink
        width="fit-content"
        href="/"
        disabled={isHomeActive}
        StartIconSlot={<HomeSvg className={styles.breadcrumbs_icon} />}
      >
        Home Page
      </Link.AsNextLink>

      {urls.map((url, index) => {
        const isActive = url === pathname;
        const label = pathnameChunks[index];
        const  capitalisedLabel = label
          .split("")
          .map((char, index) => (index === 0 ? char.toUpperCase() : char))
          .join("");

        return (
          <>
            <ChevronRightSvg className={
              styles.breadcrumbs_separator
            } />

            <Link.AsNextLink key={url} href={url} disabled={isActive}>
              {capitalisedLabel}
            </Link.AsNextLink>
          </>
        );
      })}
    </div>
  );
}
