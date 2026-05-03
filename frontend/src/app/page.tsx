import { ArrowRightSvg } from "@/assets/ArrowRightSvg";
import { ChartSvg } from "@/assets/ChartSvg";
import { CloudSvg } from "@/assets/CloudSvg";
import { RocketSvg } from "@/assets/RocketSvg";
import { TableSvg } from "@/assets/TableSvg";
import Button from "@/components/Button";
import {
  IRREGULAR_ICON_BADGE_COLORS,
  IRREGULAR_ICON_BADGE_VARIANTS,
  IrregularIconBadge,
} from "@/components/IrregularIconBadge";
import { Media } from "@/components/Media";
import { MEDIA_CONDITION } from "@/components/Media/Media.constants";
import PageLayoutDefault from "@/components/PageLayout/PageLayoutDefault";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";
import styles from "./page.module.scss";

export const metadata = {
  title: "Home Page",
  description:
    "Welcome to Morphyxis Kanban Metrics! Track your workflow performance and gain insights.",
};

export default function Home() {
  return (
    <PageLayoutDefault.Root>
      <PageLayoutDefault.Navigation />

      <PageLayoutDefault.Content>
        <div className={styles.homeContent}>
          <header className={styles.homeContent_header}>
            <h1 className={styles.homeContent_title}>Turn Kanban data into actionable metrics</h1>

            <p className={styles.homeContent_description}>
              Upload CSV or XML exports from your favorite Kanban tool and get detailed insights
              about your workflow performance, bottlenecks, and areas for improvement.
            </p>

            <Media.Client
              variant={MEDIA_CONDITION.BREAKPOINTS}
              condition={{ [BREAKPOINTS_KEYS.lg]: true }}
              Fallback={
                <picture className={styles.homeContent_imageWrapper}>
                  <source srcSet="/loginDark.webp" media="(prefers-color-scheme: dark)" />
                  <img
                    src="/login.webp"
                    alt=""
                    width={535}
                    height={467}
                    className={styles.homeContent_image}
                    loading="lazy"
                  />
                </picture>
              }
            />

            <Button.AsLink
              href="/auth/register"
              width={{
                default: "100%",
                lg: "fit-content",
              }}
              EndIconSlot={<ArrowRightSvg className={styles.homeContent_buttonIcon} />}
            >
              Get started for free
            </Button.AsLink>
          </header>

          <Media.Client
            variant={MEDIA_CONDITION.BREAKPOINTS}
            condition={{ [BREAKPOINTS_KEYS.lg]: true }}
          >
            <picture className={styles.homeContent_imageWrapper}>
              <source srcSet="/loginDark.webp" media="(prefers-color-scheme: dark)" />
              <img
                src="/login.webp"
                alt=""
                width={535}
                height={467}
                className={styles.homeContent_image}
                loading="lazy"
              />
            </picture>
          </Media.Client>
        </div>
      </PageLayoutDefault.Content>

      <PageLayoutDefault.FilledContent FooterSlot={<PageLayoutDefault.Footer />}>
        <div className={styles.homeFilledContent}>
          <section className={styles.homeFilledContent_section}>
            <h2 className={styles.homeFilledContent_title}>Why Morphyxis Kanban Metrics?</h2>

            <ul className={styles.homeFilledContent_list}>
              <li className={styles.homeFilledContent_listItem}>
                <section className={styles.homeFilledContent_listItemContent}>
                  <IrregularIconBadge
                    color={IRREGULAR_ICON_BADGE_COLORS.DEFAULT}
                    variant={IRREGULAR_ICON_BADGE_VARIANTS.V3}
                  >
                    <ChartSvg className={styles.homeFilledContent_listItemIcon} />
                  </IrregularIconBadge>

                  <h3 className={styles.homeFilledContent_listItemTitle}>Unified Metrics</h3>

                  <p className={styles.homeFilledContent_listItemDescription}>
                    Aggregate data from multiple Kanban boards into a single, comprehensive view.
                  </p>
                </section>
              </li>

              <li className={styles.homeFilledContent_listItem}>
                <section className={styles.homeFilledContent_listItemContent}>
                  <IrregularIconBadge
                    color={IRREGULAR_ICON_BADGE_COLORS.DEFAULT}
                    variant={IRREGULAR_ICON_BADGE_VARIANTS.V5}
                  >
                    <CloudSvg className={styles.homeFilledContent_listItemIcon} />
                  </IrregularIconBadge>

                  <h3 className={styles.homeFilledContent_listItemTitle}>Easy data import</h3>

                  <p className={styles.homeFilledContent_listItemDescription}>
                    Upload CSV or XML exports from your Kanban tool with just a few clicks.
                  </p>
                </section>
              </li>

              <li className={styles.homeFilledContent_listItem}>
                <section className={styles.homeFilledContent_listItemContent}>
                  <IrregularIconBadge
                    color={IRREGULAR_ICON_BADGE_COLORS.DEFAULT}
                    variant={IRREGULAR_ICON_BADGE_VARIANTS.V8}
                  >
                    <RocketSvg className={styles.homeFilledContent_listItemIcon} />
                  </IrregularIconBadge>

                  <h3 className={styles.homeFilledContent_listItemTitle}>Powerful insights</h3>

                  <p className={styles.homeFilledContent_listItemDescription}>
                    Gain deep insights into your Kanban workflow with advanced analytics and
                    visualizations.
                  </p>
                </section>
              </li>

              <li className={styles.homeFilledContent_listItem}>
                <section className={styles.homeFilledContent_listItemContent}>
                  <IrregularIconBadge
                    color={IRREGULAR_ICON_BADGE_COLORS.DEFAULT}
                    variant={IRREGULAR_ICON_BADGE_VARIANTS.V7}
                  >
                    <TableSvg className={styles.homeFilledContent_listItemIcon} />
                  </IrregularIconBadge>

                  <h3 className={styles.homeFilledContent_listItemTitle}>Track what matters</h3>

                  <p className={styles.homeFilledContent_listItemDescription}>
                    Focus on the metrics that drive your team&apos;s success and make informed
                    decisions.
                  </p>
                </section>
              </li>
            </ul>
          </section>

          <section className={styles.homeFilledContent_section}>
            <div className={styles.homeFilledContent_sectionHeader}>
              <div className={styles.homeFilledContent_sectionHeaderContent}>
                <h2 className={styles.homeFilledContent_title}>Work with your favorite tools</h2>

                <p className={styles.homeFilledContent_description}>
                  Export data and let Morphyxis Kanban Metrics do the heavy lifting. Our platform
                  supports CSV and XML
                </p>
              </div>

              <ul className={styles.homeFilledContent_brandList}>
                <li className={styles.homeFilledContent_brandListItem}>
                  <p className={styles.homeFilledContent_brandListItemText}>Github projects</p>
                </li>
                <li className={styles.homeFilledContent_brandListItem}>
                  <p className={styles.homeFilledContent_brandListItemText}>Jira Kanban</p>
                </li>
                <li className={styles.homeFilledContent_brandListItem}>
                  <p className={styles.homeFilledContent_brandListItemText}>Trello</p>
                </li>
              </ul>

              <p className={styles.homeFilledContent_brandDisclaimer}>
                Morphyxis Kanban Metrics is not affiliated with any of the mentioned tools. We
                simply provide a way to analyze your data from those tools in a unified platform.
              </p>
            </div>
          </section>
        </div>
      </PageLayoutDefault.FilledContent>
    </PageLayoutDefault.Root>
  );
}
