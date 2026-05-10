"use client";

import { HomeOutlinedSvg } from "@/assets/HomeOutlinedSvg";
import { PowerSvg } from "@/assets/PowerSvg";
import { SidebarFilledSvg } from "@/assets/SidebarFilledSvg";
import { SidebarSvg } from "@/assets/SidebarSvg";
import { UserOutlinedSvg } from "@/assets/UserOutlinedSvg";
import Button from "@/components/Button";
import { Hidden } from "@/components/Hidden/Hidden";
import { LogoutButton } from "@/components/LogoutButton/LogoutButton";
import { Media } from "@/components/Media";
import { MEDIA_CONDITION } from "@/components/Media/Media.constants";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";
import { pxToRem } from "@/utils/pxToRem";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { PageLayoutPanelContext } from "../../context";
import { pageLayoutPanelContextDefaultSpaces } from "../../context/LayoutContext";
import styles from "./PageLayoutPanelSideNavigationComponent.module.scss";

export function PageLayoutPanelSideNavigationComponent(props: React.PropsWithChildren) {
  const { children } = props;

  const { value, setValue } = React.useContext(PageLayoutPanelContext);

  const isNavigationHidden =
    value.contentSpace === pageLayoutPanelContextDefaultSpaces.contentSpace &&
    value.navigationSpace === pageLayoutPanelContextDefaultSpaces.navigationSpace;

  const [isTextVisible, setIsTextVisible] = React.useState(!isNavigationHidden);

  const handleToggleNavigation = () => {
    setValue((prev) => {
      const isPrevNavigationHidden =
        prev.contentSpace === pageLayoutPanelContextDefaultSpaces.contentSpace &&
        prev.navigationSpace === pageLayoutPanelContextDefaultSpaces.navigationSpace;

      if (!isPrevNavigationHidden) {
        setIsTextVisible(false);
      }

      return isPrevNavigationHidden
        ? {
            navigationSpace: pxToRem(300),
            contentSpace: "auto",
          }
        : pageLayoutPanelContextDefaultSpaces;
    });
  };

  return (
    <nav className={styles.pageLayoutPanelSideNavigation}>
      <div className={styles.pageLayoutPanelSideNavigation_header}>
        <Link href="/">
          <Media.Server
            variant={MEDIA_CONDITION.THEME}
            Fallback={
              <Image
                className={clsx(styles.pageLayoutPanelSideNavigation_logo, {
                  [styles.pageLayoutPanelSideNavigation_logo__isWide]: !isNavigationHidden,
                })}
                src="/logoMetricsDark.svg"
                alt="Morphyxis - kanban metrics"
                width={220}
                height={54}
                priority
              />
            }
          >
            <Image
              className={clsx(styles.pageLayoutPanelSideNavigation_logo, {
                [styles.pageLayoutPanelSideNavigation_logo__isWide]: !isNavigationHidden,
              })}
              src="/logoMetricsLight.svg"
              alt="Morphyxis - kanban metrics"
              width={220}
              height={54}
              priority
            />
          </Media.Server>
        </Link>

        <Button.AsButton
          onClick={handleToggleNavigation}
          variant="outlined"
          onTransitionEnd={() => {
            if (!isNavigationHidden) {
              setIsTextVisible(true);
            }
          }}
          className={clsx(styles.pageLayoutPanelSideNavigation_button, {
            [styles.pageLayoutPanelSideNavigation_button__active]: !isNavigationHidden,
          })}
        >
          {isNavigationHidden ? (
            <SidebarSvg className={styles.pageLayoutPanelSideNavigation_sidebarSvg} />
          ) : (
            <SidebarFilledSvg className={styles.pageLayoutPanelSideNavigation_sidebarSvg} />
          )}
          {isTextVisible ? <span>Hide navigation</span> : <Hidden>Open navigation</Hidden>}
        </Button.AsButton>

        <Button.AsLink
          href="/"
          variant="outlined"
          className={clsx(styles.pageLayoutPanelSideNavigation_button, {
            [styles.pageLayoutPanelSideNavigation_button__active]: !isNavigationHidden,
          })}
        >
          <HomeOutlinedSvg className={styles.pageLayoutPanelSideNavigation_sidebarSvg} />
          {isTextVisible ? <span>Go to Home page</span> : <Hidden>Go to Home page</Hidden>}
        </Button.AsLink>
      </div>

      {children}

      <Media.Client
        variant={MEDIA_CONDITION.BREAKPOINTS}
        condition={{
          [BREAKPOINTS_KEYS.xxl]: true,
        }}
      >
        <div className={styles.pageLayoutPanelSideNavigation_footer}>
          <Button.AsLink
            href="/dashboard/profile"
            className={clsx(styles.pageLayoutPanelSideNavigation_button, {
              [styles.pageLayoutPanelSideNavigation_button__active]: !isNavigationHidden,
            })}
            variant="outlined"
          >
            <UserOutlinedSvg className={styles.pageLayoutPanelSideNavigation_sidebarSvg} />

            {isTextVisible ? <span>Go to your Profile</span> : <Hidden>Go to your Profile</Hidden>}
          </Button.AsLink>

          <LogoutButton
            className={clsx(styles.pageLayoutPanelSideNavigation_button, {
              [styles.pageLayoutPanelSideNavigation_button__active]: !isNavigationHidden,
            })}
            variant="outlined"
          >
            <PowerSvg className={styles.pageLayoutPanelSideNavigation_sidebarSvg} />
            {isTextVisible ? <span>Logout</span> : <Hidden>Logout</Hidden>}
          </LogoutButton>
        </div>
      </Media.Client>
    </nav>
  );
}
