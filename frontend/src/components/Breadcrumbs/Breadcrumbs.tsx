"use client";

import { usePathname } from "next/navigation";
import Link from "../Link";
import styles from "./Breadcrumbs.module.scss";
import { HomeSvg } from "@/assets/HomeSvg";
import { ChevronRightSvg } from "@/assets/ChevronRightSvg";
import clsx from "clsx";
import React from "react";
import { breadcrumbsHiddenRoutes, checkIsLongId } from "./Breadcrumbs.utils";
import { useTransformIdToWorkspaceName } from "./Breadcrumbs.hooks";
import { Media } from "../Media";
import { Hidden } from "../Hidden/Hidden";
import { MEDIA_CONDITION } from "../Media/Media.constants";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";

export function Breadcrumbs() {
  const pathname = usePathname();
  const { transformIdToWorkspaceName } = useTransformIdToWorkspaceName();

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
        <Media.Client
          variant={MEDIA_CONDITION.BREAKPOINTS}
          condition={{
            [BREAKPOINTS_KEYS.md]: true,
          }}
          Fallback={<Hidden>Home Page</Hidden>}
        >
          Home Page
        </Media.Client>
      </Link.AsNextLink>

      {urls.map((url, index) => {
        const isActive = url === pathname;
        const label = pathnameChunks[index];
        const capitalisedLabel = label
          .split("")
          .map((char, index) => (index === 0 ? char.toUpperCase() : char))
          .join("");

        const shouldHideLink = breadcrumbsHiddenRoutes.some((hiddenRoute) =>
          url.endsWith(hiddenRoute)
        );

        const resolvedLabel = checkIsLongId(label)
          ? transformIdToWorkspaceName(label)
          : capitalisedLabel;

        return (
          <React.Fragment key={url}>
            {shouldHideLink ? (
              <Media.Client
                variant={MEDIA_CONDITION.BREAKPOINTS}
                condition={{
                  [BREAKPOINTS_KEYS.md]: true,
                }}
              >
                <ChevronRightSvg className={styles.breadcrumbs_separator} />
              </Media.Client>
            ) : (
              <ChevronRightSvg className={styles.breadcrumbs_separator} />
            )}

            {shouldHideLink ? (
              <Media.Client
                variant={MEDIA_CONDITION.BREAKPOINTS}
                condition={{
                  [BREAKPOINTS_KEYS.md]: true,
                }}
              >
                <p className={styles.breadcrumbs_inactiveLink}>{resolvedLabel}</p>
              </Media.Client>
            ) : (
              <Link.AsNextLink
                href={url}
                disabled={isActive}
                className={clsx(styles.breadcrumbs_link, {
                  [styles.breadcrumbs_link__active]: isActive,
                })}
              >
                {resolvedLabel}
              </Link.AsNextLink>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
