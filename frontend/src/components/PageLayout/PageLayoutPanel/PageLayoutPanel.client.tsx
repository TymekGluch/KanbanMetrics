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

export function ProviderComponent(props: PageLayoutPanelProviderProps) {
  const { children } = props;

  return <PageLayoutPanelProvider>{children}</PageLayoutPanelProvider>;
}

export function RootComponent(props: PageLayoutPanelRootProps) {
  const { children, As: Component = "main" } = props;

  return <Component>{children}</Component>;
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
        </nav>
      }
    />
  );
}
