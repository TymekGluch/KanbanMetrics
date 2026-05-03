import Link from "@/components/Link";
import { Media } from "@/components/Media";
import { MEDIA_CONDITION } from "@/components/Media/Media.constants";
import PageLayoutDefault from "@/components/PageLayout/PageLayoutDefault";
import { BREAKPOINTS_KEYS } from "@/responsive/responsive.constants";
import styles from "./page.module.scss";
import { AuthForm } from "@/components/Forms/AuthForm/AuthForm";
import { AUTH_FORM_VARIANTS } from "@/components/Forms/AuthForm/AuthForm.constants";

export const metadata = {
  title: "Register",
  description:
    "Create a new account to access Morphyxis Kanban Metrics and start tracking your workflow performance.",
};

export default function Register() {
  return (
    <PageLayoutDefault.Root>
      <PageLayoutDefault.Navigation withBreadcrumbs />

      <PageLayoutDefault.Content align="center">
        <div className={styles.authContent}>
          <header className={styles.authContent_header}>
            <h1 className={styles.authContent_title}>Create your account</h1>

            <p className={styles.authContent_description}>
              Get started with{" "}
              <em className={styles.authContent_emphasis}>Morphyxis Kanban Metrics</em> and track
              your workflow performance.
            </p>

            <Media.Client
              variant={MEDIA_CONDITION.BREAKPOINTS}
              condition={{
                [BREAKPOINTS_KEYS.lg]: true,
              }}
            >
              <div className={styles.authContent_imageWrapper}>
                <picture>
                  <source srcSet="/loginDark.webp" media="(prefers-color-scheme: dark)" />
                  <img
                    src="/login.webp"
                    alt=""
                    width={535}
                    height={467}
                    className={styles.authContent_image}
                    loading="lazy"
                  />
                </picture>
              </div>
            </Media.Client>
          </header>

          <div className={styles.authContent_form}>
            <AuthForm variant={AUTH_FORM_VARIANTS.REGISTER} />
          </div>
        </div>
        <Media.Client
          variant={MEDIA_CONDITION.BREAKPOINTS}
          condition={{
            [BREAKPOINTS_KEYS.lg]: true,
          }}
          Fallback={
            <div className={styles.authContent_imageWrapper}>
              <picture>
                <source srcSet="/loginDark.webp" media="(prefers-color-scheme: dark)" />
                <img
                  src="/login.webp"
                  alt=""
                  width={535}
                  height={467}
                  className={styles.authContent_image}
                  loading="lazy"
                />
              </picture>
            </div>
          }
        />
      </PageLayoutDefault.Content>

      <PageLayoutDefault.Footer />
    </PageLayoutDefault.Root>
  );
}
