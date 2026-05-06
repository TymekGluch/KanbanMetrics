import { Breadcrumbs } from "@/components/Breadcrumbs/Breadcrumbs";
import { Footer as FooterComponent } from "@/components/Footer/Footer";
import { Media } from "@/components/Media";
import { MEDIA_CONDITION } from "@/components/Media/Media.constants";
import { UserIndicator } from "@/components/UserIndicator/UserIndicator";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { PAGE_LAYOUT_CONTENT_ALIGN } from "./PageLayoutDefault.constants";
import styles from "./PageLayoutDefault.module.scss";
import {
  type PageLayoutDefaultContentProps,
  type PageLayoutDefaultFilledContentProps,
  type PageLayoutDefaultNavigationProps,
  type PageLayoutDefaultRootProps,
} from "./PageLayoutDefault.types";

export function Navigation(props: PageLayoutDefaultNavigationProps) {
  const {
    children,
    withBreadcrumbs = false,
    BreadcrumbsSlot = null,
    withUserIndicator = false,
  } = props;

  return (
    <div className={styles.pageLayoutDefaultNavigation}>
      <nav className={styles.pageLayoutDefaultNavigation_nav}>
        <div className={styles.pageLayoutDefaultNavigation_navContent}>
          <Link className={styles.pageLayoutDefaultNavigation_logoLink} href="/">
            <Media.Server
              variant={MEDIA_CONDITION.THEME}
              Fallback={
                <Image
                  src="/logoMetricsDark.svg"
                  className={styles.pageLayoutDefaultNavigation_logo}
                  alt="Morphyxis - kanban metrics"
                  width={220}
                  height={54}
                  priority
                />
              }
            >
              <Image
                className={styles.pageLayoutDefaultNavigation_logo}
                src="/logoMetricsLight.svg"
                alt="Morphyxis - kanban metrics"
                width={220}
                height={54}
                priority
              />
            </Media.Server>
          </Link>

          <div className={styles.pageLayoutDefaultNavigation_content}>
            {children} {withUserIndicator && <UserIndicator />}
          </div>
        </div>
      </nav>

      {withBreadcrumbs && (
        <div className={styles.pageLayoutDefaultNavigation_breadcrumbs}>
          {Boolean(BreadcrumbsSlot) ? BreadcrumbsSlot : <Breadcrumbs />}
        </div>
      )}
    </div>
  );
}

export function Content(props: PageLayoutDefaultContentProps) {
  const { children, align = PAGE_LAYOUT_CONTENT_ALIGN.LEFT } = props;

  return (
    <div
      className={clsx(styles.pageLayoutDefaultContent, {
        [styles.pageLayoutDefaultContent__center]: align === PAGE_LAYOUT_CONTENT_ALIGN.CENTER,
        [styles.pageLayoutDefaultContent__right]: align === PAGE_LAYOUT_CONTENT_ALIGN.RIGHT,
      })}
    >
      {children}
    </div>
  );
}

export function FilledContent(props: PageLayoutDefaultFilledContentProps) {
  const { children, align = PAGE_LAYOUT_CONTENT_ALIGN.LEFT, FooterSlot = null } = props;

  return (
    <div
      className={clsx(styles.pageLayoutDefaultFilledContent, {
        [styles.pageLayoutDefaultFilledContent__center]: align === PAGE_LAYOUT_CONTENT_ALIGN.CENTER,
        [styles.pageLayoutDefaultFilledContent__right]: align === PAGE_LAYOUT_CONTENT_ALIGN.RIGHT,
      })}
    >
      <div className={styles.pageLayoutDefaultFilledContent_fullWidthWrapper}>
        <div className={styles.pageLayoutDefaultFilledContent_content}>
          <div className={styles.pageLayoutDefaultFilledContent_body}>{children}</div>

          {!!FooterSlot && (
            <div className={styles.pageLayoutDefaultFilledContent_footer}>{FooterSlot}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return <FooterComponent />;
}

export function Root(props: PageLayoutDefaultRootProps) {
  const { children } = props;

  const navigationGroup: React.ReactElement[] = [];
  const contentGroup: React.ReactElement[] = [];

  React.Children.forEach(children, (child) => {
    const validChild = [Navigation, Footer, Content, FilledContent];

    if (React.isValidElement(child) && !validChild.some((component) => child.type === component)) {
      throw new Error(
        "Use Only compound components inside PageLayoutDefault.Root, other components will be ignored."
      );
    }

    if (React.isValidElement(child) && child.type === Navigation) {
      navigationGroup.push(child);
    }

    if (
      React.isValidElement(child) &&
      (child.type === Content || child.type === FilledContent || child.type === Footer)
    ) {
      contentGroup.push(child);
    }
  });

  return (
    <main className={styles.pageLayoutDefault}>
      {navigationGroup.map((navigation, index) => {
        const nodeKey = navigation.key ?? `navigation-${index}`;

        return <React.Fragment key={nodeKey}>{navigation}</React.Fragment>;
      })}
      <div className={styles.pageLayoutDefault_content}>
        {contentGroup.map((content, index) => {
          const nodeKey = content.key ?? `content-${index}`;
          return <React.Fragment key={nodeKey}>{content}</React.Fragment>;
        })}
      </div>
    </main>
  );
}
