"use client";

import Button from "@/components/Button";
import { IrregularAvatar } from "@/components/IrregularAvatar";
import { Media } from "@/components/Media";
import { MEDIA_CONDITION } from "@/components/Media/Media.constants";
import { UserContext } from "@/providers/UserProvider/UserProvider";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";
import { COLORS } from "@/theme/theme.constants";
import { pxToRem } from "@/utils/pxToRem";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./RootCommonDrawerContent.module.scss";
import { DrawerContext } from "@/components/Drawer/context";
import { Breadcrumbs } from "@/components/Breadcrumbs/Breadcrumbs";
import { LogoutButton } from "@/components/LogoutButton/LogoutButton";
import { PowerSvg } from "@/assets/PowerSvg";

export function RootCommonDrawerContent(props: React.PropsWithChildren) {
  const { children } = props;

  const user = React.useContext(UserContext);
  const { setIsOpen } = React.useContext(DrawerContext);

  return (
    <Media.Client
      variant={MEDIA_CONDITION.BREAKPOINTS}
      condition={{ [BREAKPOINTS_KEYS.md]: true }}
      Fallback={
        <div className={styles.rootCommonDrawerContent}>
          <div className={styles.rootCommonDrawerContent_hero}>
            <Link className={styles.rootCommonDrawerContent_logoLink} href="/">
              <Media.Server
                variant={MEDIA_CONDITION.THEME}
                Fallback={
                  <Image
                    src="/logoMetricsDark.svg"
                    className={styles.rootCommonDrawerContent_logo}
                    alt="Morphyxis - kanban metrics"
                    width={220}
                    height={54}
                    priority
                  />
                }
              >
                <Image
                  className={styles.rootCommonDrawerContent_logo}
                  src="/logoMetricsLight.svg"
                  alt="Morphyxis - kanban metrics"
                  width={220}
                  height={54}
                  priority
                />
              </Media.Server>
            </Link>

            <div className={styles.rootCommonDrawerContent_breadcrumbsWrapper}>
              <Breadcrumbs />
            </div>
          </div>

          {children}

          <Button.AsLink
            href="/dashboard/profile"
            StartIconSlot={
              <IrregularAvatar
                name={user?.name ?? ""}
                backgroundColor={COLORS.GRADIENT_BRAND_MAIN}
                size="sm"
              />
            }
            onClick={() => setIsOpen(false)}
            variant="outlined"
            width="100%"
            padding={`${pxToRem(16)} !important`}
            size="large"
          >
            <span className={styles.rootCommonDrawerContent_userButtonContent}>
              <span className={styles.rootCommonDrawerContent_userButtonName}>
                {user?.name ?? ""}
              </span>

              <span className={styles.rootCommonDrawerContent_userButtonEmail}>
                {user?.email ?? ""}
              </span>
            </span>
          </Button.AsLink>

          <LogoutButton width="100%" variant="outlined">
            <PowerSvg className={styles.rootCommonDrawerContent_logoutIcon} />
            Logout
          </LogoutButton>
        </div>
      }
    />
  );
}
