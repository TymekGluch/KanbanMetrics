"use client";

import { usePathname } from "next/navigation";
import Link from "../Link";
import styles from "./Breadcrumbs.module.scss";
import { HomeSvg } from "@/assets/HomeSvg";
import { ChevronRightSvg } from "@/assets/ChevronRightSvg";
import clsx from "clsx";

const hiddenRoutes = ["auth"];

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
        className={clsx(styles.breadcrumbs_link, {
          [styles.breadcrumbs_link__active]: isHomeActive,
        })}
      >
        Home Page
      </Link.AsNextLink>

      {urls.map((url, index) => {
        const isActive = url === pathname;
        const label = pathnameChunks[index];
        const capitalisedLabel = label
          .split("")
          .map((char, index) => (index === 0 ? char.toUpperCase() : char))
          .join("");

        const shouldHideLink = hiddenRoutes.some((hiddenRoute) => url.endsWith(hiddenRoute));

        return (
          <>
            <ChevronRightSvg className={styles.breadcrumbs_separator} />

            {shouldHideLink ? (
              <p className={styles.breadcrumbs_inactiveLink}>{capitalisedLabel}</p>
            ) : (
              <Link.AsNextLink
                key={url}
                href={url}
                disabled={isActive}
                className={clsx(styles.breadcrumbs_link, {
                  [styles.breadcrumbs_link__active]: isActive,
                })}
              >
                {capitalisedLabel}
              </Link.AsNextLink>
            )}
          </>
        );
      })}
    </div>
  );
}
