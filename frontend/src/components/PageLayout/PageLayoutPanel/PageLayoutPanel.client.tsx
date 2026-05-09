"use client";

import Drawer from "@/components/Drawer";
import { Media } from "@/components/Media";
import { MEDIA_CONDITION } from "@/components/Media/Media.constants";
import { useResponsiveProp } from "@/responsive/hooks/useResponsive";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { isSlotChild, markSlotComponent } from "../utils/slotting";
import { PageLayoutPanelProvider } from "./context";
import { PAGE_LAYOUT_PANEL_CONTENT_ALIGNMENT } from "./PageLayoutPanel.constants";
import styles from "./PageLayoutPanel.module.scss";
import {
  type NavigationContentComponentProps,
  type PageLayoutPanelProviderProps,
  type PageLayoutPanelRootProps,
} from "./PageLayoutPanel.types";
import { PageLayoutPanelRootWrapperComponent } from "./components/PageLayoutPanelRootWrapperComponent/PageLayoutPanelRootWrapperComponent";
import { PageLayoutPanelSideNavigationComponent } from "./components/PageLayoutPanelSideNavigationComponent/PageLayoutPanelSideNavigationComponent";

const NAVIGATION_CONTENT_SLOT = "PageLayoutPanel.NavigationContent";
const NAVIGATION_CONTENT_EXPORT_NAMES = ["NavigationContentComponent"] as const;

export function ProviderComponent(props: PageLayoutPanelProviderProps) {
  const { children, initialValue } = props;

  return <PageLayoutPanelProvider initialValue={initialValue}>{children}</PageLayoutPanelProvider>;
}

export function RootComponent(props: PageLayoutPanelRootProps) {
  const { children, as = "main" } = props;

  let navigationContent: React.ReactNode = null;
  const restChildren: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (
      isSlotChild(child, {
        slot: NAVIGATION_CONTENT_SLOT,
        exportNames: NAVIGATION_CONTENT_EXPORT_NAMES,
      })
    ) {
      navigationContent = child;
    } else {
      restChildren.push(child);
    }
  });

  return (
    <Drawer.Provider>
      <PageLayoutPanelRootWrapperComponent as={as} className={styles.pageRootComponent}>
        <Media.Client
          variant={MEDIA_CONDITION.BREAKPOINTS}
          condition={{ [BREAKPOINTS_KEYS.md]: true }}
          Fallback={
            <>
              {Boolean(navigationContent) && <Drawer.Content>{navigationContent}</Drawer.Content>}
            </>
          }
        >
          {Boolean(navigationContent) && (
            <PageLayoutPanelSideNavigationComponent>
              {navigationContent}
            </PageLayoutPanelSideNavigationComponent>
          )}
        </Media.Client>

        <div className={styles.pageRootComponent_content}>{restChildren}</div>
      </PageLayoutPanelRootWrapperComponent>
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
    >
      <span />
    </Media.Client>
  );
}

export function NavigationContentComponent(props: NavigationContentComponentProps) {
  const { children, alignment = PAGE_LAYOUT_PANEL_CONTENT_ALIGNMENT.CENTER } = props;

  const alignmentValue = useResponsiveProp(alignment);

  return (
    <ul className={styles.pageLayoutPanelNavigationContent}>
      {React.Children.map(children, (child, index) => (
        <li
          key={index}
          className={clsx(styles.pageLayoutPanelNavigationContent_item, {
            [styles.pageLayoutPanelNavigationContent_item__alignStart]:
              alignmentValue === PAGE_LAYOUT_PANEL_CONTENT_ALIGNMENT.START,
            [styles.pageLayoutPanelNavigationContent_item__alignEnd]:
              alignmentValue === PAGE_LAYOUT_PANEL_CONTENT_ALIGNMENT.END,
          })}
        >
          {child}
        </li>
      ))}
    </ul>
  );
}

markSlotComponent(NavigationContentComponent, NAVIGATION_CONTENT_SLOT);

export function HeaderComponent(props: React.PropsWithChildren) {
  const { children } = props;

  return <header className={styles.pageLayoutPanelHeader}>{children}</header>;
}

export function DetailsContent(props: React.PropsWithChildren) {
  const { children } = props;

  return <div className={styles.pageLayoutPanelDetailsContent}>{children}</div>;
}
