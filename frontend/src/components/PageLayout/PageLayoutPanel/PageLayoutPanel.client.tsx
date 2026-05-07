"use client";

import { Media } from "@/components/Media";
import { MEDIA_CONDITION } from "@/components/Media/Media.constants";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";
import Image from "next/image";
import Link from "next/link";
import { PageLayoutPanelProvider } from "./context";
import styles from "./PageLayoutPanel.module.scss";
import {
  type PageLayoutPanelProviderProps,
  type PageLayoutPanelRootProps,
} from "./PageLayoutPanel.types";
import Drawer from "@/components/Drawer";
import { IrregularAvatar } from "@/components/IrregularAvatar";
import React from "react";
import { UserContext } from "@/providers/UserProvider/UserProvider";
import Button from "@/components/Button";
import { COLORS } from "@/theme/theme.constants";
import { pxToRem } from "@/utils/pxToRem";

export function ProviderComponent(props: PageLayoutPanelProviderProps) {
  const { children } = props;

  return <PageLayoutPanelProvider>{children}</PageLayoutPanelProvider>;
}

export function RootComponent(props: PageLayoutPanelRootProps) {
  const { children, As: Component = "main" } = props;

  const user = React.useContext(UserContext);

  return (
    <Drawer.Provider>
      <Drawer.Content
        HeroSlot={
          <Link className={styles.pageLayoutPanelRootLink} href="/">
            <Media.Server
              variant={MEDIA_CONDITION.THEME}
              Fallback={
                <Image
                  src="/logoMetricsDark.svg"
                  className={styles.pageLayoutPanelRootLink_logo}
                  alt="Morphyxis - kanban metrics"
                  width={220}
                  height={54}
                  priority
                />
              }
            >
              <Image
                className={styles.pageLayoutPanelRootLink_logo}
                src="/logoMetricsLight.svg"
                alt="Morphyxis - kanban metrics"
                width={220}
                height={54}
                priority
              />
            </Media.Server>
          </Link>
        }
        FooterSlot={
          <Button.AsLink
            href="/dashboard/profile"
            StartIconSlot={
              <IrregularAvatar
                name={user?.name ?? ""}
                backgroundColor={COLORS.GRADIENT_BRAND_MAIN}
                size="sm"
              />
            }
            variant="outlined"
            width="100%"
            padding={`${pxToRem(16)} !important`}
            size="large"
          >
            <span className={styles.pageLayoutPanelRoot_UserButtonContent}>
              <span className={styles.pageLayoutPanelRoot_UserButtonName}>{user?.name ?? ""}</span>

              <span className={styles.pageLayoutPanelRoot_UserButtonEmail}>
                {user?.email ?? ""}
              </span>
            </span>
          </Button.AsLink>
        }
      />
      <Component>{children}</Component>
    </Drawer.Provider>
  );
}

export function TopNavigationMobileComponent() {
  return (
    <Media.Client
      variant={MEDIA_CONDITION.BREAKPOINTS}
      condition={{
        [BREAKPOINTS_KEYS.md]: true,
      }}
      Fallback={
        <nav className={styles.pageLayoutPanelTopNavigationMobile}>
          <Link className={styles.pageLayoutPanelTopNavigationMobile_logoLink} href="/">
            <Media.Server
              variant={MEDIA_CONDITION.THEME}
              Fallback={
                <Image
                  src="/logoMetricsDark.svg"
                  className={styles.pageLayoutPanelTopNavigationMobile_logo}
                  alt="Morphyxis - kanban metrics"
                  width={220}
                  height={54}
                  priority
                />
              }
            >
              <Image
                className={styles.pageLayoutPanelTopNavigationMobile_logo}
                src="/logoMetricsLight.svg"
                alt="Morphyxis - kanban metrics"
                width={220}
                height={54}
                priority
              />
            </Media.Server>
          </Link>

          <Drawer.Button
            name={{
              close: "Open navigation",
              open: "Close navigation",
            }}
          />
        </nav>
      }
    />
  );
}
